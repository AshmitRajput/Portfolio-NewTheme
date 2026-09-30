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
    role: 'Full Stack Developer Intern',
    company: 'Triosoft Technologies Pvt. Ltd.',
    period: 'June 2026 — September 2026',
    location: 'India',
    summary:
      'Worked across backend engineering, AI/LLM systems, full-stack development, MLOps, cloud infrastructure, and third-party integrations.',
    highlights: [
      'Architected a production Django/Redis backend for an AI voice-calling assistant, implementing distributed session and multi-turn conversation-state management.',
      'Built conversational AI workflows using RAG, information lookup, Hindi multi-turn conversations, and prompt guardrails for real customer interactions.',
      'Implemented an end-to-end Llama 3.1 8B fine-tuning pipeline using LoRA/QLoRA, HuggingFace, PyTorch, synthetic data generation, and automated evaluation.',
      'Worked on deploying and integrating fine-tuned models into usable production AI workflows and optimized voice-bot latency using improved model/API routing.',
      'Designed AWS S3 image-processing and caching pipelines and optimized EC2/EBS resource utilization, contributing to a 10% reduction in monthly AWS infrastructure costs.',
      'Worked across React/Vite frontend development while communicating with external companies and technology providers for third-party integrations and partnerships.',
    ],
  },
  {
    id: 'exp-2',
    role: 'Coordinator',
    company: 'Axios Development Club, IIIT Bhopal',
    period: 'October 2024 — September 2026',
    location: 'Bhopal, India',
    summary:
      'Led technical initiatives, developer programs, workshops, hackathons, and community growth across a 700+ developer ecosystem.',
    highlights: [
      'Led a 30-member technical team and helped scale the developer community to 700+ members.',
      'Directed an AWS-backed hackathon with 2,300+ participants and 187+ submissions, coordinating cross-institution logistics.',
      'Designed and delivered AWS, GCP, and DevOps workshops to 500+ students using hands-on EC2, Docker, and Jenkins deployments.',
      'Drove 20–25% project continuation across 36–45 projects through technical guidance and community initiatives.',
      'Secured ₹75K+ in sponsorships supporting student startups, technical initiatives, and open-source contributions.',
    ],
  },
]
