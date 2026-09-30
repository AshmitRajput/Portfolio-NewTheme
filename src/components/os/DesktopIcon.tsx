type DesktopIconProps = {
  icon: string
  label: string
  isSelected: boolean
  /** On mobile there's no reliable double-tap gesture (unlike a mouse
   *  double-click), so a single tap opens the app directly instead of
   *  just selecting it — otherwise tapping an icon does nothing
   *  visible and looks broken. */
  isMobile?: boolean
  onSelect: () => void
  onOpen: () => void
}

export default function DesktopIcon({
  icon,
  label,
  isSelected,
  isMobile = false,
  onSelect,
  onOpen,
}: DesktopIconProps) {
  return (
    <button
      className={`os-desktop-icon${isSelected ? ' os-desktop-icon--selected' : ''}`}
      onClick={isMobile ? onOpen : onSelect}
      onDoubleClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onOpen()
      }}
    >
      <span className="os-desktop-icon__glyph" aria-hidden="true">
        {icon}
      </span>
      <span className="os-desktop-icon__label">{label}</span>
    </button>
  )
}
