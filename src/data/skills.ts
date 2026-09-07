export type SkillGroup = {
  category: string
  items: string[]
}

export const skills: SkillGroup[] = [
  {
    category: 'Languages',
    items: ['Python', 'TypeScript', 'JavaScript', 'SQL'], // TODO
  },
  {
    category: 'AI / ML',
    items: ['LLM apps', 'RAG', 'LangChain', 'Prompt evaluation', 'Vector databases', 'MLOps'], // TODO
  },
  {
    category: 'Backend',
    items: ['Django', 'Django REST Framework', 'FastAPI', 'PostgreSQL', 'Redis'], // TODO
  },
  {
    category: 'Frontend',
    items: ['React', 'Vite', 'CSS', 'Accessibility'], // TODO
  },
  {
    category: 'Tools & Infra',
    items: ['Docker', 'Git', 'GitHub Actions', 'Linux', 'AWS'], // TODO
  },
]
