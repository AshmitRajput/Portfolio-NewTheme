/**
 * Profile content. Everything marked TODO is placeholder — edit freely.
 */

export type Education = {
  degree: string
  institution: string
  period: string
  detail?: string
}

export const profile = {
  name: 'Ashmit',
  role: 'AI & Full-stack Developer', // TODO
  tagline:
    'I build AI-powered products end to end — from LLM pipelines to the React interfaces people actually use.', // TODO
  location: 'India', // TODO

  bio: [
    // TODO: replace with your own words. 2–3 short paragraphs works best.
    'I work at the intersection of machine learning and product engineering. Most of my recent work has been on conversational AI: voice agents, retrieval-augmented generation and the infrastructure needed to run them reliably.',
    'I care about shipping things that hold up in production — clean APIs, sensible data models and interfaces that make complex systems feel simple.',
  ],

  education: [
    {
      degree: 'B.Tech in Computer Science', // TODO
      institution: 'Your University', // TODO
      period: '2021 — 2025', // TODO
      detail: 'Focus on machine learning and distributed systems.', // TODO
    },
  ] satisfies Education[],

  interests: [
    'LLM applications',
    'RAG systems',
    'Voice agents',
    'MLOps',
    'Developer tooling',
  ], // TODO

  // Contact — used by the Contact app and the Resume app
  email: 'you@example.com', // TODO
  github: 'https://github.com/yourhandle', // TODO
  linkedin: 'https://linkedin.com/in/yourhandle', // TODO
  twitter: '', // optional — leave empty to hide

  // Drop resume.pdf into /public and this path just works
  resumeUrl: '/resume.pdf',
}
