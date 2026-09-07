export type Project = {
  id: string
  name: string
  tagline: string
  description: string
  technologies: string[]
  highlights?: string[]
  year?: string
  github?: string
  demo?: string
}

/**
 * Your projects. Order here = display order.
 * The `id` is also what the Terminal will accept later: `open recovery-ai`.
 */
export const projects: Project[] = [
  {
    id: 'recovery-ai',
    name: 'Recovery AI',
    tagline: 'AI voice agent for patient follow-up', // TODO
    description:
      'A voice-first assistant that runs structured recovery check-ins, answers patient questions from a curated knowledge base and escalates to a human when confidence drops. Built around a RAG pipeline with evaluation and monitoring baked in.', // TODO
    technologies: ['Python', 'Django', 'LangChain', 'RAG', 'LLM', 'MLOps', 'React'],
    highlights: [
      'Retrieval-augmented answers grounded in vetted clinical content', // TODO
      'Confidence-based hand-off to human staff', // TODO
      'Evaluation harness for prompt and retrieval regressions', // TODO
    ],
    year: '2025',
    github: 'https://github.com/yourhandle/recovery-ai', // TODO
    demo: '', // TODO — leave empty to hide the button
  },
  {
    id: 'project-two',
    name: 'Project Two', // TODO
    tagline: 'One-line summary of what it does', // TODO
    description:
      'A longer description: the problem, your approach, and what made it interesting to build.', // TODO
    technologies: ['TypeScript', 'React', 'Node.js'],
    highlights: ['Something you are proud of', 'A measurable result'],
    year: '2024',
    github: 'https://github.com/yourhandle/project-two',
  },
  {
    id: 'portfolio-os',
    name: 'Portfolio OS',
    tagline: 'This site — a macOS-inspired desktop in the browser',
    description:
      'A simulated desktop environment built with React and TypeScript: draggable, resizable windows with a central window manager, a glass Dock, desktop icons and a hash-routed entry point from the landing page. No routing or state libraries — just React state and CSS.',
    technologies: ['React', 'TypeScript', 'Vite', 'CSS'],
    highlights: [
      'Central window manager with focus / z-index / minimize / maximize',
      'Pointer-capture based dragging and resizing',
      'Data-driven apps — content lives in src/data',
    ],
    year: '2026',
    github: 'https://github.com/yourhandle/portfolio', // TODO
  },
]
