import type { AppProps } from './index'
import { experience } from '../../../data/experience'

export default function ExperienceApp(_props: AppProps) {
  return (
    <article className="app app-experience">
      <h1 className="app__title">Experience</h1>

      <ol className="app-experience__timeline">
        {experience.map((item) => (
          <li key={item.id} className="app-experience__item">
            <div className="app-experience__marker" aria-hidden="true" />
            <div className="app-experience__content">
              <div className="app-experience__head">
                <h2>{item.role}</h2>
                <span className="app__muted">{item.period}</span>
              </div>
              <div className="app-experience__company">
                {item.company}
                {item.location && (
                  <span className="app__muted"> · {item.location}</span>
                )}
              </div>
              <p className="app__body">{item.summary}</p>
              <ul className="app__list">
                {item.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </article>
  )
}
