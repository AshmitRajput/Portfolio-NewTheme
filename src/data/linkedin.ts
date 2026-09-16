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

export const linkedinPosts: LinkedInPost[] = [
  {
    id: 'post-1',
    title: 'Wrapping up an incredible internship at Triosoft Technologies',
    date: 'Sep 14, 2026',
    url: 'https://www.linkedin.com/posts/ashmit-rajput-10b817299_internship-softwareengineering-fullstackdevelopment-activity-7504776251170254848-8zHl',
  },
  {
    id: 'post-2',
    title: 'Team Rain404 — Champion of Strategy Blitz 2025, among 100+ teams',
    date: '2025',
    url: 'https://www.linkedin.com/posts/ashmit-rajput-10b817299_innovation-cloudtechnology-strategyblitz-activity-7303333784668528640-x7l8',
  },
]
