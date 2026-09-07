type DesktopIconProps = {
  icon: string
  label: string
  isSelected: boolean
  onSelect: () => void
  onOpen: () => void
}

export default function DesktopIcon({
  icon,
  label,
  isSelected,
  onSelect,
  onOpen,
}: DesktopIconProps) {
  return (
    <button
      className={`os-desktop-icon${isSelected ? ' os-desktop-icon--selected' : ''}`}
      onClick={onSelect}
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
