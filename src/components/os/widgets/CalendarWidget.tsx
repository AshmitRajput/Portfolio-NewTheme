import { useState } from 'react'

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

// Monday-first offset for the 1st of the month (0 = Monday ... 6 = Sunday)
function firstWeekdayOffset(year: number, month: number) {
  const day = new Date(year, month, 1).getDay() // 0 = Sunday
  return (day + 6) % 7
}

/**
 * Phase 4 MVP: current month, prev/next nav, today highlighted.
 * Intentionally not wired to a real calendar service (per the plan —
 * "don't connect a real calendar service unless you actually need
 * one"). Click-a-date-to-see-events is a later pass.
 */
export default function CalendarWidget() {
  const today = new Date()
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const total = daysInMonth(year, month)
  const offset = firstWeekdayOffset(year, month)
  const cells: Array<number | null> = [
    ...Array(offset).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ]

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const monthLabel = cursor.toLocaleString(undefined, { month: 'long', year: 'numeric' })

  return (
    <section className="os-widget">
      <div className="os-widget__cal-header">
        <button
          className="os-widget__cal-nav"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          aria-label="Previous month"
        >
          ‹
        </button>
        <h2 className="os-widget__title os-widget__title--cal">{monthLabel}</h2>
        <button
          className="os-widget__cal-nav"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className="os-widget__cal-grid">
        {WEEKDAYS.map((d, i) => (
          <span key={`h${i}`} className="os-widget__cal-weekday">
            {d}
          </span>
        ))}
        {cells.map((d, i) =>
          d === null ? (
            <span key={i} />
          ) : (
            <span
              key={i}
              className={`os-widget__cal-day${isToday(d) ? ' os-widget__cal-day--today' : ''}`}
            >
              {d}
            </span>
          )
        )}
      </div>
    </section>
  )
}