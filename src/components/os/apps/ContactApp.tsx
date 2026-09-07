import { useState } from 'react'
import type { AppProps } from './index'
import { profile } from '../../../data/about'

type ContactLink = { label: string; value: string; href: string }

export default function ContactApp(_props: AppProps) {
  const [copied, setCopied] = useState(false)

  const links: ContactLink[] = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    {
      label: 'GitHub',
      value: profile.github.replace(/^https?:\/\//, ''),
      href: profile.github,
    },
    {
      label: 'LinkedIn',
      value: profile.linkedin.replace(/^https?:\/\//, ''),
      href: profile.linkedin,
    },
    ...(profile.twitter
      ? [
          {
            label: 'X / Twitter',
            value: profile.twitter.replace(/^https?:\/\//, ''),
            href: profile.twitter,
          },
        ]
      : []),
  ]

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard unavailable — the mailto link still works
    }
  }

  return (
    <article className="app app-contact">
      <h1 className="app__title">Contact</h1>
      <p className="app__lede">
        Open to interesting AI and full-stack work. The fastest way to reach
        me is email.
      </p>

      <ul className="app-contact__list">
        {links.map((link) => (
          <li key={link.label} className="app-contact__row">
            <span className="app-contact__label">{link.label}</span>
            <a
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
              className="app-contact__value"
            >
              {link.value}
            </a>
          </li>
        ))}
      </ul>

      <div className="app__actions">
        <a className="app__btn app__btn--primary" href={`mailto:${profile.email}`}>
          Send an email
        </a>
        <button className="app__btn" onClick={copyEmail}>
          {copied ? 'Copied' : 'Copy address'}
        </button>
      </div>
    </article>
  )
}
