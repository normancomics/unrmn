import { useEffect, useState } from 'react'
import { FILE, SOCIAL } from '../config/partners'
import { fetchComments, type DeskComment } from '../services/utokenDesk'
import { shortenAddress } from '../lib/format'

export function CommunityPage() {
  const [comments, setComments] = useState<DeskComment[]>([])

  useEffect(() => {
    fetchComments().then(setComments).catch(() => undefined)
  }, [])

  return (
    <section className="stack">
      <article className="card">
        <img className="avatar" src={FILE.avatar} alt="@uNORMANCOMICS" />
        <h2>Collection chat</h2>
        <p className="meta">
          Same thread as utoken.gg/collection/unrmn. Posting still happens on µToken
          until this desk has a signer for their comment route.
        </p>
        <div className="inline wrap">
          <a className="button" href={SOCIAL.x} target="_blank" rel="noreferrer">
            @uNORMANCOMICS
          </a>
          <a className="button" href={SOCIAL.telegram} target="_blank" rel="noreferrer">
            Telegram
          </a>
          <a className="button" href="https://utoken.gg/collection/unrmn" target="_blank" rel="noreferrer">
            Chat on µToken
          </a>
        </div>
      </article>
      {comments.map((row) => (
        <article key={row.id} className="card">
          <p>{row.content}</p>
          <p className="meta">
            {row.author.username || shortenAddress(row.author.address)} ·{' '}
            {new Date(row.createdAt).toLocaleString()}
          </p>
        </article>
      ))}
      {comments.length === 0 && <article className="card">Chat hydrating…</article>}
    </section>
  )
}
