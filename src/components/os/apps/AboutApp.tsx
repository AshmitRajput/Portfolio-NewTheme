import type { AppProps } from './index'
import { profile } from '../../../data/about'
import { skills } from '../../../data/skills'

// Keeps each Skills-card category to a glanceable length — same
// truncation idiom ProjectsApp already uses for its tech chips
// (slice + a ghost "+N" chip), reused here rather than invented.
const MAX_ITEMS_PER_GROUP = 6

export default function AboutApp({ openApp }: AppProps) {
  return (
    <article className="app app-about">
      <header className="app-about__header">
        <div>
          <span className="app__overline">Profile</span>
          <h1 className="app__title">About me</h1>
        </div>
        <a
          className="app-about__linkedin"
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          My LinkedIn profile <span aria-hidden="true">↗</span>
        </a>
      </header>

      <p className="app-about__role">
        {profile.name} · {profile.role} · {profile.location}
      </p>
      <p className="app__lede">{profile.tagline}</p>

      <div className="app-about__hairline" aria-hidden="true" />

      <div className="app-about__layout">
        <div className="app-about__bio">
          {profile.bio.map((paragraph, i) => (
            <p key={i} className="app__body">
              {paragraph}
            </p>
          ))}

          <div className="app__actions">
            <button className="app__btn app__btn--primary" onClick={() => openApp('projects')}>
              See my projects
            </button>
            <button className="app__btn" onClick={() => openApp('contact')}>
              Get in touch
            </button>
          </div>
        </div>

        <div className="app-about__side">
          <section className="app-about__card">
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
          </section>

          <section className="app-about__card">
            <h2 className="app__section">Skills</h2>
            {skills.map((group) => (
              <div key={group.category} className="app-about__skill-group">
                <h3>{group.category}</h3>
                <ul className="app__chips app__chips--small">
                  {group.items.slice(0, MAX_ITEMS_PER_GROUP).map((item) => (
                    <li key={item} className="app__chip">
                      {item}
                    </li>
                  ))}
                  {group.items.length > MAX_ITEMS_PER_GROUP && (
                    <li className="app__chip app__chip--ghost">
                      +{group.items.length - MAX_ITEMS_PER_GROUP}
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </section>
        </div>
      </div>
    </article>
  )
}
