import type { AppDefinition, AppId, WindowState } from './types'

type DockProps = {
  apps: AppDefinition[]
  windows: WindowState[]
  onAppClick: (id: AppId) => void
}

export default function Dock({ apps, windows, onAppClick }: DockProps) {
  const isOpen = (id: AppId) =>
    windows.some((w) => w.id === id && w.isOpen)

  return (
    <nav className="os-dock" aria-label="Dock">
      <div className="os-dock__tray">
        {apps.map((app) => (
          <button
            key={app.id}
            className="os-dock__item"
            onClick={() => onAppClick(app.id)}
            aria-label={`Open ${app.title}`}
          >
            <span className="os-dock__icon" aria-hidden="true">
              {app.icon}
            </span>
            <span className="os-dock__tooltip">{app.title}</span>
            <span
              className={`os-dock__dot${isOpen(app.id) ? ' os-dock__dot--active' : ''}`}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </nav>
  )
}
