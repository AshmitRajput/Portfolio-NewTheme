import { tips } from '../../../data/tips'
import type { AppId } from '../types'

type TipsWidgetProps = {
  openApp: (id: AppId) => void
}

export default function TipsWidget({ openApp }: TipsWidgetProps) {
  const tip = tips[0]
  if (!tip) return null

  return (
    <section className="os-widget">
      <h2 className="os-widget__title">RI/OS Tips</h2>
      <p className="os-widget__tip-text">{tip.text}</p>
      {tip.action && (
        <button
          className="os-widget__open"
          onClick={() => openApp(tip.action as AppId)}
        >
          Open →
        </button>
      )}
    </section>
  )
}