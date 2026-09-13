import { linkedinPosts } from '../../../data/linkedin'

export default function LinkedInWidget() {
  return (
    <section className="os-widget">
      <h2 className="os-widget__title">On LinkedIn</h2>
      <ul className="os-widget__linkedin-list">
        {linkedinPosts.map((post) => (
          <li key={post.id}>
            <a
              className="os-widget__linkedin-post"
              href={post.url}
              target="_blank"
              rel="noreferrer"
            >
              <span className="os-widget__linkedin-text">{post.title}</span>
              <span className="os-widget__linkedin-date">{post.date}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}