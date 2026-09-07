import type { AppProps } from './index'
import { skills } from '../../../data/skills'

export default function SkillsApp(_props: AppProps) {
  return (
    <article className="app app-skills">
      <h1 className="app__title">Skills</h1>
      <p className="app__lede">What I reach for, grouped by where it fits.</p>

      <div className="app-skills__groups">
        {skills.map((group) => (
          <section key={group.category} className="app-skills__group">
            <h2>{group.category}</h2>
            <ul className="app__chips">
              {group.items.map((item) => (
                <li key={item} className="app__chip">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  )
}
