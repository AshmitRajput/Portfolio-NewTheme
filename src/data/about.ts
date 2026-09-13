/**
 * Profile content.
 */

export type Education = {
  degree: string
  institution: string
  period: string
  detail?: string
}

export const profile = {
  name: 'Ashmit Rajput',
  role: 'Software Engineer | Backend & AI',
  tagline:
    'I build production-ready software across backend systems, AI, cloud infrastructure, and everything in between.',
  location: 'India',

  bio: [
    'I’m a B.Tech Information Technology student at IIIT Bhopal who enjoys turning difficult problems into reliable, usable software. My work spans backend engineering, AI/LLM applications, cloud infrastructure, and distributed systems.',
    'I’ve built production Django and Redis systems, conversational AI and RAG pipelines, fine-tuned Llama 3.1 8B with LoRA/QLoRA, and deployed applications across AWS, Kubernetes, and CI/CD environments.',
    'Beyond engineering, I’ve led a 30-member developer community, organized technical events for 2,300+ participants, taught AWS/GCP/DevOps to 500+ students, and worked with external companies on technology integrations and partnerships. I enjoy learning quickly, communicating clearly, and taking ownership from idea to production.',
  ],

  education: [
    {
      degree: 'B.Tech in Information Technology',
      institution: 'Indian Institute of Information Technology, Bhopal',
      period: '2023 — 2027',
      detail:
        'CGPA: 7.67 · Coursework: DSA, Computer Networks, DBMS, Operating Systems, OOP, Distributed Systems, Software Engineering',
    },
  ] satisfies Education[],

  interests: [
    'Backend Engineering',
    'Distributed Systems',
    'AI Engineering',
    'LLM Applications',
    'RAG Systems',
    'Voice Agents',
    'MLOps',
    'Cloud Infrastructure',
    'DevSecOps',
    'Scalable Computing',
  ],

  // Contact — used by the Contact app and the Resume app
  email: 'ashmitrajput1007@gmail.com',
  github: 'https://github.com/AshmitRajput',
  linkedin: 'https://www.linkedin.com/in/ashmit-rajput-10b817299/', // TODO: replace with your real LinkedIn URL
  twitter: '', // optional — leave empty to hide

  // Drop resume.pdf into /public and this path just works
  resumeUrl: '/resume.pdf',
}