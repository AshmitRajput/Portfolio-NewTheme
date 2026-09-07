import type { AppProps } from './index'
import { profile } from '../../../data/about'

export default function AboutApp({ openApp }: AppProps) {
  return (
    <article className="app app-about">
      <header className="app-about__header">
        <div className="app-about__avatar" aria-hidden="true">
          {profile.name.charAt(0)}
        </div>
        <div>
          <h1 className="app__title">{profile.name}</h1>
          <p className="app-about__role">
            {profile.role} · {profile.location}
          </p>
        </div>
      </header>

      <p className="app__lede">{profile.tagline}</p>

      {profile.bio.map((paragraph, i) => (
        <p key={i} className="app__body">
          {paragraph}
        </p>
      ))}

      <h2 className="app__section">Education</h2>
      <ul className="app-about__education">
        {profile.education.map((edu) => (
          <li key={edu.degree + edu.institution}>
            <div className="app-about__edu-head">
              <strong>{edu.degree}</strong>
              <span className="app__muted">{edu.period}</span>
            </div>
            <div>{edu.institution}</div>
            {edu.detail && <div className="app__muted">{edu.detail}</div>}
          </li>
        ))}
      </ul>

      <h2 className="app__section">Interests</h2>
      <ul className="app__chips">
        {profile.interests.map((item) => (
          <li key={item} className="app__chip">
            {item}
          </li>
        ))}
      </ul>

      <div className="app__actions">
        <button className="app__btn app__btn--primary" onClick={() => openApp('projects')}>
          See my projects
        </button>
        <button className="app__btn" onClick={() => openApp('contact')}>
          Get in touch
        </button>
      </div>
    </article>
  )
}
