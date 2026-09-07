import type { AppProps } from './index'
import { profile } from '../../../data/about'

export default function ResumeApp(_props: AppProps) {
  return (
    <article className="app app-resume">
      <header className="app-resume__bar">
        <div>
          <h1 className="app__title">Resume</h1>
          <span className="app__muted">PDF preview</span>
        </div>
        <a
          className="app__btn app__btn--primary"
          href={profile.resumeUrl}
          download
        >
          Download PDF
        </a>
      </header>

      {/* Browsers render PDFs natively inside an iframe. Put resume.pdf in /public. */}
      <iframe
        className="app-resume__frame"
        src={`${profile.resumeUrl}#toolbar=0&navpanes=0`}
        title={`${profile.name} — resume`}
      />

      <p className="app__muted app-resume__fallback">
        Can't see the preview?{' '}
        <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
          Open it in a new tab
        </a>
        .
      </p>
    </article>
  )
}
