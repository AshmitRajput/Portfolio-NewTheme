export type SkillGroup = {
  category: string
  items: string[]
}

export const skills: SkillGroup[] = [
  {
    category: 'Languages',
    items: ['C++', 'Python', 'Java', 'JavaScript', 'TypeScript', 'SQL', 'Go'],
  },
  {
    category: 'AI / ML',
    items: [
      'LLM Applications',
      'RAG',
      'LLM Fine-Tuning',
      'LoRA / QLoRA',
      'HuggingFace',
      'PyTorch',
      'Prompt Engineering',
      'AI Agents',
      'Vector Embeddings',
      'MLOps',
      'STT / TTS',
    ],
  },
  {
    category: 'Backend',
    items: [
      'Django',
      'Django REST Framework',
      'FastAPI',
      'Flask',
      'Node.js',
      'REST APIs',
      'WebSockets',
      'PostgreSQL',
      'MySQL',
      'Redis',
      'MongoDB',
      'ChromaDB',
    ],
  },
  {
    category: 'Frontend',
    items: ['React', 'TypeScript', 'JavaScript', 'Vite', 'Tailwind CSS', 'CSS'],
  },
  {
    category: 'Cloud & DevOps',
    items: [
      'AWS',
      'EC2',
      'EKS',
      'S3',
      'IAM',
      'EBS',
      'GCP',
      'Docker',
      'Kubernetes',
      'Terraform',
      'Jenkins',
      'GitHub Actions',
      'ArgoCD',
      'Nginx',
      'Linux',
    ],
  },
  {
    category: 'Engineering',
    items: [
      'Data Structures & Algorithms',
      'System Design',
      'Distributed Systems',
      'Microservices',
      'CI/CD',
      'Load Balancing',
      'Horizontal Scaling',
      'Fault Tolerance',
      'Caching',
      'Error Handling',
      'Testing',
      'Pytest',
      'Jest',
    ],
  },
  {
    category: 'Observability & Security',
    items: ['Prometheus', 'Grafana', 'SonarQube', 'Trivy', 'AWS IAM', 'DevSecOps'],
  },
]
