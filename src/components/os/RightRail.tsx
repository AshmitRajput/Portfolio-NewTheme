import LinkedInWidget from './widgets/LinkedInWidget'
import TipsWidget from './widgets/TipsWidget'
import ShortcutsWidget from './widgets/ShortcutsWidget'
import CalendarWidget from './widgets/CalendarWidget'
import type { AppId } from './types'

type RightRailProps = {
  openApp: (id: AppId) => void
  visible: boolean
}

export default function RightRail({ openApp, visible }: RightRailProps) {
  if (!visible) return null

  return (
    <aside className="os-rail" aria-label="Widgets">
      <LinkedInWidget />
      <TipsWidget openApp={openApp} />
      <ShortcutsWidget openApp={openApp} />
      <CalendarWidget />
    </aside>
  )
}
