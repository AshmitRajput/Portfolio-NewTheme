export type Experience = {
  id: string
  role: string
  company: string
  period: string
  location?: string
  summary: string
  highlights: string[]
}

/** Most recent first. */
export const experience: Experience[] = [
  {
    id: 'exp-1',
    role: 'AI Engineer', // TODO
    company: 'Company Name', // TODO
    period: '2025 — Present', // TODO
    location: 'Remote', // TODO
    summary:
      'Own the conversational AI stack: retrieval, prompt orchestration, evaluation and deployment.', // TODO
    highlights: [
      'Shipped a production voice agent handling real user calls', // TODO
      'Cut retrieval latency significantly through index and caching work', // TODO
      'Set up an evaluation pipeline so prompt changes are measured, not guessed', // TODO
    ],
  },
  {
    id: 'exp-2',
    role: 'Software Engineering Intern', // TODO
    company: 'Previous Company', // TODO
    period: '2024', // TODO
    location: 'City, Country', // TODO
    summary: 'Full-stack work across a Django backend and React frontend.', // TODO
    highlights: [
      'Built and documented REST endpoints used by the web and mobile clients',
      'Improved test coverage and CI reliability',
    ],
  },
]
