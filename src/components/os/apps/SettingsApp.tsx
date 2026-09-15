import { useOSSettings } from '../../../hooks/useOSSettings'
import type { ThemeMode } from '../../../hooks/useOSSettings'

const THEME_OPTIONS: { value: ThemeMode; label: string; hint: string }[] = [
  { value: 'light', label: 'Light', hint: 'Always use the light appearance' },
  { value: 'dark', label: 'Dark', hint: 'Always use the dark appearance' },
  { value: 'system', label: 'System', hint: "Match this device's setting" },
]

/**
 * Phase 4/5. Appearance, Widgets, and Windows are real and persisted
 * (useOSSettings → localStorage). Desktop/Dock/Accessibility sections
 * from the plan aren't built yet — deliberately left out rather than
 * shipped as dead controls (Rule 5).
 */
export default function SettingsApp() {
  const {
    theme,
    setTheme,
    showWidgets,
    setShowWidgets,
    rememberWindowPositions,
    setRememberWindowPositions,
  } = useOSSettings()

  return (
    <div className="app app-settings">
      <h1 className="app__title">Settings</h1>
      <p className="app__lede">Changes apply immediately and are remembered next time.</p>

      <h2 className="app__section">Appearance</h2>
      <div className="app-settings__options" role="radiogroup" aria-label="Appearance">
        {THEME_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`app-settings__option${
              theme === opt.value ? ' app-settings__option--active' : ''
            }`}
            role="radio"
            aria-checked={theme === opt.value}
            onClick={() => setTheme(opt.value)}
          >
            <span className="app-settings__radio" aria-hidden="true" />
            <span>
              <span className="app-settings__option-label">{opt.label}</span>
              <span className="app-settings__option-hint">{opt.hint}</span>
            </span>
          </button>
        ))}
      </div>

      <h2 className="app__section">Widgets</h2>
      <label className="app-settings__toggle-row">
        <span>
          Show right-rail widgets
          <span className="app-settings__option-hint app-settings__option-hint--block">
            LinkedIn, Tips, Shortcuts, and Calendar
          </span>
        </span>
        <button
          className={`app-settings__switch${showWidgets ? ' app-settings__switch--on' : ''}`}
          role="switch"
          aria-checked={showWidgets}
          onClick={() => setShowWidgets((v) => !v)}
        >
          <span className="app-settings__switch-knob" />
        </button>
      </label>

      <h2 className="app__section">Windows</h2>
      <label className="app-settings__toggle-row">
        <span>
          Remember window positions
          <span className="app-settings__option-hint app-settings__option-hint--block">
            Reopen an app exactly where you left it, instead of re-centering it
          </span>
        </span>
        <button
          className={`app-settings__switch${
            rememberWindowPositions ? ' app-settings__switch--on' : ''
          }`}
          role="switch"
          aria-checked={rememberWindowPositions}
          onClick={() => setRememberWindowPositions((v) => !v)}
        >
          <span className="app-settings__switch-knob" />
        </button>
      </label>

      <p className="app__muted app-settings__note">
        Desktop, Dock, and Accessibility settings are coming in a later pass.
      </p>
    </div>
  )
}
