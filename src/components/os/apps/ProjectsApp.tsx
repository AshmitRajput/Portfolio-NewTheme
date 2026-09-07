import { useState } from 'react'
import type { AppProps } from './index'
import { projects } from '../../../data/projects'
import type { Project } from '../../../data/projects'

function ProjectDetail({
  project,
  onBack,
}: {
  project: Project
  onBack: () => void
}) {
  return (
    <article className="app app-project">
      <button className="app__back" onClick={onBack}>
        ‹ All projects
      </button>

      <header className="app-project__header">
        <h1 className="app__title">{project.name}</h1>
        {project.year && <span className="app__muted">{project.year}</span>}
      </header>
      <p className="app__lede">{project.tagline}</p>
      <p className="app__body">{project.description}</p>

      {project.highlights && project.highlights.length > 0 && (
        <>
          <h2 className="app__section">Highlights</h2>
          <ul className="app__list">
            {project.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </>
      )}

      <h2 className="app__section">Built with</h2>
      <ul className="app__chips">
        {project.technologies.map((t) => (
          <li key={t} className="app__chip">
            {t}
          </li>
        ))}
      </ul>

      {(project.github || project.demo) && (
        <div className="app__actions">
          {project.github && (
            <a
              className="app__btn app__btn--primary"
              href={project.github}
              target="_blank"
              rel="noreferrer"
            >
              View code
            </a>
          )}
          {project.demo && (
            <a className="app__btn" href={project.demo} target="_blank" rel="noreferrer">
              Open live demo
            </a>
          )}
        </div>
      )}
    </article>
  )
}

export default function ProjectsApp(_props: AppProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = projects.find((p) => p.id === selectedId)

  if (selected) {
    return <ProjectDetail project={selected} onBack={() => setSelectedId(null)} />
  }

  return (
    <article className="app app-projects">
      <header className="app-projects__header">
        <h1 className="app__title">Projects</h1>
        <span className="app__muted">{projects.length} projects</span>
      </header>

      <div className="app-projects__grid">
        {projects.map((project) => (
          <button
            key={project.id}
            className="app-projects__card"
            onClick={() => setSelectedId(project.id)}
          >
            <div className="app-projects__card-top">
              <h2>{project.name}</h2>
              {project.year && <span className="app__muted">{project.year}</span>}
            </div>
            <p>{project.tagline}</p>
            <ul className="app__chips app__chips--small">
              {project.technologies.slice(0, 4).map((t) => (
                <li key={t} className="app__chip">
                  {t}
                </li>
              ))}
              {project.technologies.length > 4 && (
                <li className="app__chip app__chip--ghost">
                  +{project.technologies.length - 4}
                </li>
              )}
            </ul>
          </button>
        ))}
      </div>
    </article>
  )
}
