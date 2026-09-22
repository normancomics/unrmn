import { createPublicClient, formatUnits, http, type Hex } from 'viem'
import { explorerTxUrl, robinhoodChain, UNRMN_TOKEN } from '../config/chain'
import { utokenStreamCandidates } from '../config/utoken'

export type ActivitySide = 'BUY' | 'SELL' | 'SEND'

export interface ActivityItem {
  id: string
  side: ActivitySide
  maker: string
  amount: number
  ethAmount: number | null
  usd: number | null
  txHash: string
  tsMs: number
  href: string
  source: 'utoken' | 'chain'
}

const publicClient = createPublicClient({
  chain: robinhoodChain,
  transport: http(import.meta.env.VITE_RPC_URL || robinhoodChain.rpcUrls.default.http[0]),
})

const TRANSFER_TOPIC =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' as Hex
const ZERO = '0x0000000000000000000000000000000000000000'

function topicAddress(topic: string) {
  return `0x${topic.slice(26)}`
}

async function fetchText(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`bad ${response.status}`)
  return response.text()
}

function parseStream(raw: string): ActivityItem[] {
  const items: ActivityItem[] = []
  const blocks = raw.split('\n\n')
  for (const block of blocks) {
    const dataLine = block.split('\n').find((line) => line.startsWith('data:'))
    if (!dataLine) continue
    try {
      const payload = JSON.parse(dataLine.slice(5).trim()) as {
        trades?: Array<{
          id: string
          side: string
          maker: string
          tokenAmount: number
          ethAmount?: number
          valueUsd?: number
          txHash: string
          tsMs: number
        }>
        transfers?: Array<{
          id: string
          from: string
          to: string
          amount?: number
          tokenAmount?: number
          txHash: string
          tsMs: number
        }>
      }
      for (const trade of payload.trades ?? []) {
        const side = trade.side.toUpperCase() === 'BUY' ? 'BUY' : 'SELL'
        items.push({
          id: trade.id,
          side,
          maker: trade.maker,
          amount: trade.tokenAmount,
          ethAmount: trade.ethAmount ?? null,
          usd: trade.valueUsd ?? null,
          txHash: trade.txHash,
          tsMs: trade.tsMs,
          href: explorerTxUrl(trade.txHash),
          source: 'utoken',
        })
      }
      for (const transfer of payload.transfers ?? []) {
        items.push({
          id: transfer.id,
          side: 'SEND',
          maker: transfer.from,
          amount: transfer.tokenAmount ?? transfer.amount ?? 0,
          ethAmount: null,
          usd: null,
          txHash: transfer.txHash,
          tsMs: transfer.tsMs,
          href: explorerTxUrl(transfer.txHash),
          source: 'utoken',
        })
      }
    } catch {
      continue
    }
  }
  return items
}

async function fetchUtokenActivity(): Promise<ActivityItem[]> {
  for (const url of utokenStreamCandidates) {
    try {
      const raw = await Promise.race([
        fetchText(url),
        new Promise<string>((_, reject) => {
          setTimeout(() => reject(new Error('timeout')), 8000)
        }),
      ])
      const parsed = parseStream(raw)
      if (parsed.length) return parsed
    } catch {
      continue
    }
  }
  return []
}

async function fetchChainActivity(): Promise<ActivityItem[]> {
  const latest = await publicClient.getBlockNumber()
  const fromBlock = latest > 400000n ? latest - 400000n : 0n
  const logs = await publicClient.request({
    method: 'eth_getLogs',
    params: [
      {
        address: UNRMN_TOKEN.address,
        fromBlock: `0x${fromBlock.toString(16)}`,
        toBlock: `0x${latest.toString(16)}`,
        topics: [TRANSFER_TOPIC],
      },
    ],
  })
  return logs
    .slice(-40)
    .reverse()
    .map((log) => {
      const from = topicAddress(log.topics?.[1] ?? ZERO)
      const to = topicAddress(log.topics?.[2] ?? ZERO)
      const amount = Number(formatUnits(BigInt(log.data ?? '0x0'), UNRMN_TOKEN.decimals))
      const side: ActivitySide = from === ZERO ? 'BUY' : to === ZERO ? 'SELL' : 'SEND'
      const hash = log.transactionHash ?? '0x'
      return {
        id: `${hash}-${log.logIndex}`,
        side,
        maker: side === 'BUY' ? to : from,
        amount,
        ethAmount: null,
        usd: null,
        txHash: hash,
        tsMs: Date.now(),
        href: explorerTxUrl(hash),
        source: 'chain' as const,
      }
    })
}

export async function readActivityFeed(): Promise<ActivityItem[]> {
  const [stream, chain] = await Promise.all([
    fetchUtokenActivity().catch(() => []),
    fetchChainActivity().catch(() => []),
  ])
  const merged = new Map<string, ActivityItem>()
  for (const item of [...stream, ...chain]) {
    const key = `${item.txHash}-${item.side}-${item.amount}`
    if (!merged.has(key)) merged.set(key, item)
  }
  return [...merged.values()].sort((a, b) => b.tsMs - a.tsMs).slice(0, 40)
}
