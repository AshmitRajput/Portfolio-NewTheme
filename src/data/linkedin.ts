export type LinkedInPost = {
  id: string
  title: string
  date: string
  url: string
  /** Optional thumbnail — import an image and pass it here (e.g.
   *  `image: linkedinPost1` after `import linkedinPost1 from
   *  '../assets/linkedin/post-1.jpg'`). Posts without one just show
   *  text, matching the reference's card layout either way. */
  image?: string
}

/**
 * TODO: swap these for your real recent posts. Nothing else needs to
 * change — LinkedInWidget.tsx just maps over this array.
 */
export const linkedinPosts: LinkedInPost[] = [
  {
    id: 'post-1',
    title: 'Shipped a voice agent that recovers failed payments end-to-end.',
    date: '2 months ago',
    url: 'https://linkedin.com/in/yourhandle',
  },
  {
    id: 'post-2',
    title: 'Notes on running RAG pipelines reliably in production.',
    date: '2 months ago',
    url: 'https://linkedin.com/in/yourhandle',
  },
  {
    id: 'post-3',
    title: 'Building RI/OS — a desktop-style portfolio in React.',
    date: '3 months ago',
    url: 'https://linkedin.com/in/yourhandle',
  },
]
