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
              {post.image && (
                <img
                  className="os-widget__linkedin-thumb"
                  src={post.image}
                  alt=""
                  aria-hidden="true"
                />
              )}
              <span className="os-widget__linkedin-body">
                <span className="os-widget__linkedin-text">{post.title}</span>
                <span className="os-widget__linkedin-date">{post.date}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
