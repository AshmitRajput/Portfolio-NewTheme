import type { AppProps } from './index'

/**
 * Phase 6 will make this interactive (real command input, `open <project>`).
 * For now it's a static preview so the window has something to show.
 */
export default function TerminalApp(_props: AppProps) {
  return (
    <div className="app app-terminal">
      <pre>
        {`ashmit@portfolio ~ % help

Available commands:
  about       who I am
  projects    what I've built
  skills      what I work with
  experience  where I've worked
  contact     get in touch
  resume      open my resume
  clear       clear the screen

(Interactive terminal ships in Phase 6.)

ashmit@portfolio ~ % `}
        <span className="app-terminal__cursor" aria-hidden="true" />
      </pre>
    </div>
  )
}
