import { shortcuts } from '../../../data/shortcuts'
import type { AppId } from '../types'

type ShortcutsWidgetProps = {
  openApp: (id: AppId) => void
}

export default function ShortcutsWidget({ openApp }: ShortcutsWidgetProps) {
  return (
    <section className="os-widget">
      <h2 className="os-widget__title">Shortcuts</h2>
      <div className="os-widget__shortcuts-grid">
        {shortcuts.map((s) => (
          <button
            key={s.id}
            className="os-widget__shortcut"
            onClick={() => openApp(s.action)}
          >
            <span className="os-widget__shortcut-icon" aria-hidden="true">
              {s.icon}
            </span>
            <span className="os-widget__shortcut-label">{s.title}</span>
          </button>
        ))}
      </div>
    </section>
  )
}