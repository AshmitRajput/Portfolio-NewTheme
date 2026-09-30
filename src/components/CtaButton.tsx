import './CtaButton.css'

type CtaButtonProps = {
  href: string
  label: string
  className?: string
  /** Set this to make the browser download the linked file instead of
   *  navigating to it — pass a string to suggest a filename (e.g. for
   *  a resume link), or `true` to just use the file's own name. */
  download?: boolean | string
}

function CtaButton({ href, label, className = '', download }: CtaButtonProps) {
  const classes = ['cta-button', className].filter(Boolean).join(' ')

  return (
    <a className={classes} href={href} download={download}>
      <span className="cta-button__fill" aria-hidden="true" />
      <span className="cta-button__text">{label}</span>
      <span className="cta-button__icon" aria-hidden="true">
        <svg viewBox="0 0 20 20" focusable="false" role="presentation">
          <path
            d="M4.5 10h9.2M10.8 4.8 16 10l-5.2 5.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  )
}

export default CtaButton
