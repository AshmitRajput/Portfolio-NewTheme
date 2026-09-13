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
  featured?: boolean
}

/**
 * Featured projects show on the main Projects screen.
 * The rest live under "More Builds / Archive".
 * The `id` is also what the Terminal will accept: `open recovery-ai`.
 */
export const projects: Project[] = [
  // ---------- Featured ----------
  {
    id: 'recovery-ai',
    name: 'Recover-AI-Agent',
    tagline: 'AI-powered voice recovery and customer interaction platform',
    description:
      'A real-time AI voice platform built with Python and Django for automated customer recovery workflows. Combines RAG, cloud LLMs, multilingual embeddings, Redis session state, intent classification, STT/TTS, REST APIs, and WebSockets to orchestrate conversational outbound calls.',
    technologies: [
      'Python',
      'Django',
      'Redis',
      'RAG',
      'Cloud LLMs',
      'E5 Embeddings',
      'STT/TTS',
      'WebSockets',
      'TypeScript',
    ],
    highlights: [
      'Real-time intent classification and conversational workflows',
      'Redis-based multi-turn session state management',
      'RAG-powered information retrieval',
      'WebSocket-based real-time voice communication',
      'Automated customer recovery actions and outbound call orchestration',
    ],
    year: '2026',
    github: 'https://github.com/AshmitRajput/Voice-bot', // TODO: confirm exact repo name/casing
    demo: '',
    featured: true,
  },
  {
    id: 'devsecops-three-tier',
    name: 'DevSecOps Three-Tier App on AWS EKS',
    tagline: 'Fault-tolerant microservices with automated DevSecOps',
    description:
      'A production-style 3-tier microservices application built with React, Node.js, and MongoDB and deployed on Amazon EKS. Infrastructure is provisioned through Terraform with a complete CI/CD and security pipeline using Jenkins, SonarQube, Trivy, and ArgoCD GitOps.',
    technologies: [
      'React',
      'Node.js',
      'MongoDB',
      'Kubernetes',
      'AWS EKS',
      'Terraform',
      'Jenkins',
      'ArgoCD',
      'SonarQube',
      'Trivy',
      'Prometheus',
      'Grafana',
    ],
    highlights: [
      'Sustained 1K RPS at sub-250ms P95 latency',
      '99.9% uptime across a multi-node distributed cluster',
      'Horizontally autoscaling deployment across 15–30 pods',
      'End-to-end Jenkins → SonarQube → Trivy → ArgoCD pipeline',
      'Infrastructure provisioned entirely through Terraform',
      'Prometheus and Grafana observability',
    ],
    year: '2026',
    github: 'https://github.com/AshmitRajput/DevSecOps-ThreeTierApp', // TODO
    demo: '',
    featured: true,
  },
  {
    id: 'local-rag',
    name: 'Local RAG-Based AI Pipeline',
    tagline: 'Private, local retrieval-augmented generation',
    description:
      'A fully local Retrieval-Augmented Generation system that combines ChromaDB vector search with an Ollama-hosted LLM for context-aware querying without cloud API dependency. FastAPI provides asynchronous REST endpoints for document ingestion, semantic retrieval, and local inference.',
    technologies: [
      'Python',
      'FastAPI',
      'ChromaDB',
      'Ollama',
      'Vector Embeddings',
      'Semantic Search',
      'RAG',
    ],
    highlights: [
      'Fully local LLM inference with no cloud API dependency',
      'Semantic document retrieval using vector embeddings',
      'Async FastAPI REST APIs for ingestion and querying',
      'Sub-second local inference latency',
    ],
    year: '2026',
    github: 'https://github.com/AshmitRajput/Local-RAG-Based-AI',
    demo: '',
    featured: true,
  },
  {
    id: 'jarvis',
    name: 'Jarvis — Python Voice Assistant',
    tagline: 'Voice-controlled assistant for everyday automation',
    description:
      'A Python voice assistant integrating speech recognition, text-to-speech, OpenAI APIs, NLP, and third-party services to automate system and web tasks through natural voice commands.',
    technologies: [
      'Python',
      'Speech Recognition',
      'TTS',
      'OpenAI API',
      'NLP',
      'Third-party APIs',
    ],
    highlights: [
      '90–95% command recognition accuracy',
      'Sub-second response latency',
      'Speech recognition and text-to-speech pipeline',
      'Third-party API integrations',
      'Voice-driven system and web automation',
    ],
    year: '2025',
    github: 'https://github.com/AshmitRajput/PythonBasics-JARVIS', // TODO
    demo: '',
    featured: true,
  },

  // ---------- More Builds / Archive ----------
  {
    id: 'cicd-pipeline',
    name: 'CI/CD Pipeline with Jenkins, SonarQube & Docker',
    tagline: 'Multi-server automated CI/CD on AWS',
    description:
      'A multi-server CI/CD environment deployed across three isolated AWS EC2 instances for Jenkins, SonarQube, and Docker. GitHub webhooks automatically trigger builds, analysis, quality gates, and containerized releases.',
    technologies: ['Jenkins', 'SonarQube', 'Docker', 'AWS EC2', 'GitHub Webhooks', 'VPC'],
    highlights: [
      'Automated builds triggered by GitHub webhooks',
      'Static-analysis quality gates before deployment',
      'Containerized application releases',
      'Three isolated EC2-based services',
      'VPC and security-group controlled communication',
    ],
    year: '2025',
    github: 'https://github.com/AshmitRajput/Jenkins-Sonarqube-Docker', // TODO
    demo: '',
  },
  {
    id: 'netflix-dashboard',
    name: 'Netflix Data Analytics Dashboard',
    tagline: 'Interactive Netflix content analytics with AWS',
    description:
      'An interactive business intelligence dashboard analyzing Netflix’s content catalog. Raw CSV data is stored in Amazon S3 and processed through Amazon QuickSight SPICE for fast querying, visualization, and interactive exploration.',
    technologies: ['AWS S3', 'Amazon QuickSight', 'SPICE', 'Data Visualization'],
    highlights: [
      '5+ interactive visualizations',
      'Release-year and genre trend analysis',
      'Title-addition timeline analysis',
      'Cross-filtering for ad-hoc exploration',
      'Serverless cloud-based data pipeline',
    ],
    year: '2025',
    github: 'https://github.com/AshmitRajput/AWS-Services-Implementation-Docs', // TODO
    demo: '',
  },
  {
    id: 'docker-beanstalk',
    name: 'Docker Containerization & Elastic Beanstalk Deployment',
    tagline: 'Containerized deployment with AWS-managed infrastructure',
    description:
      'Containerized a web application using a custom Dockerfile and deployed it through AWS Elastic Beanstalk, leveraging AWS-managed compute, load balancing, and autoscaling. Diagnosed and resolved a live port-conflict issue during deployment.',
    technologies: ['Docker', 'Dockerfile', 'AWS Elastic Beanstalk', 'Nginx', 'AWS EC2'],
    highlights: [
      'Custom Docker image and deployment configuration',
      'AWS-managed EC2 and load balancing',
      'Autoscaling deployment environment',
      'Diagnosed and resolved deployment port conflicts',
    ],
    year: '2025',
    github: 'https://github.com/AshmitRajput/AWS-Services-Implementation-Docs', // TODO
    demo: '',
  },
  {
    id: 's3-static-site',
    name: 'Static Website Hosting on Amazon S3',
    tagline: 'Serverless static website hosting',
    description:
      'Configured Amazon S3 for serverless static website hosting, serving HTML and image assets directly from object storage without a compute instance. Diagnosed and resolved an S3 403 Forbidden error caused by access configuration.',
    technologies: ['AWS S3', 'Static Website Hosting', 'ACL', 'Bucket Policies'],
    highlights: [
      'Serverless hosting without compute infrastructure',
      'S3-based static content delivery',
      'Configured bucket access policies',
      'Diagnosed and resolved 403 Forbidden access issues',
    ],
    year: '2025',
    github: 'https://github.com/AshmitRajput/AWS-Services-Implementation-Docs', // TODO
    demo: '',
  },
  {
    id: 'aws-iam-security',
    name: 'Cloud Security with AWS IAM',
    tagline: 'Least-privilege access control for AWS resources',
    description:
      'Designed a least-privilege AWS IAM access model using custom JSON policies and tag-based conditions to restrict development users to authorized EC2 resources while preventing privilege escalation through tag manipulation.',
    technologies: ['AWS IAM', 'AWS EC2', 'JSON Policies', 'Least-Privilege Access'],
    highlights: [
      'Tag-based EC2 access control',
      'Least-privilege IAM policy design',
      'Privilege-escalation prevention',
      'Validated access restrictions against development and production resources',
    ],
    year: '2025',
    github: 'https://github.com/AshmitRajput/AWS-Services-Implementation-Docs', // TODO
    demo: '',
  },
  {
    id: 'ec2-remote-java',
    name: 'Web App Deployment via EC2 + Remote SSH',
    tagline: 'Remote development and Java deployment on AWS',
    description:
      'Deployed a Java/JSP web application on AWS EC2 through a remote-development workflow using RSA key-pair authentication and VS Code Remote-SSH. Configured Amazon Corretto and Maven directly on the remote environment.',
    technologies: ['AWS EC2', 'SSH', 'RSA Key Pairs', 'VS Code Remote-SSH', 'Java', 'Maven'],
    highlights: [
      'Remote development directly on EC2',
      'RSA key-based authentication',
      'Java/JSP application deployment',
      'Configured Corretto and Maven remotely',
    ],
    year: '2025',
    github: 'https://github.com/AshmitRajput/AWS-Services-Implementation-Docs', // TODO
    demo: '',
  },
]
