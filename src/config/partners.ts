export const FILE = {
  logo: 'https://utoken.gg/api/files/67b51105-d54b-4340-bd10-b5e06d02daeb.gif',
  banner: 'https://utoken.gg/api/files/5054a996-ba3b-40c9-99ec-1712a3a8de8f.jpg',
  avatar: 'https://pbs.twimg.com/profile_images/2095607383317770240/ghlLcwK4.jpg',
}

export const SOCIAL = {
  x: 'https://x.com/uNORMANCOMICS',
  telegram: 'https://t.me/+E3QAvdB1r281ZjAx',
}

export const robinhoodPartners = [
  { symbol: 'WETH', name: 'Wrapped Ether', address: '0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73' },
  { symbol: 'USDG', name: 'Global Dollar', address: '0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168' },
  { symbol: 'NVDA', name: 'NVIDIA • Robinhood Token', address: '0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC' },
  { symbol: 'AAPL', name: 'Apple • Robinhood Token', address: '0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9' },
] as const

export const mintClubVenues = [
  {
    symbol: 'UPEPECASH',
    title: 'UPEPECASH',
    href: 'https://mint.club/nft/robinhood/UPEPECASH',
    kind: 'nft1155',
  },
  {
    symbol: 'UFEELSFAKE',
    title: 'UFEELSFAKE',
    href: 'https://mint.club/token/robinhood/UFEELSFAKE',
    kind: 'token',
  },
  {
    symbol: 'UFEELSFAKE/uNRMN',
    title: 'UFEELSFAKE / $uNRMN pool',
    href: 'https://mint.club/token/robinhood/UFEELSFAKE',
    kind: 'stake',
  },
] as const
