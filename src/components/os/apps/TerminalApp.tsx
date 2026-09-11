import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { AppProps } from './index'
import { APPS } from '../../../data/apps'
import type { AppId } from '../types'

/* ------------------------------------------------------------------
   Terminal — Phase 3

   A real interactive shell: typed input, command history (↑/↓),
   Cmd/Ctrl+L and Cmd/Ctrl+K to clear, and a small command table that
   actually drives the OS (e.g. `open projects` calls openApp()).
   Commands are data (see `commands` below), not an if/else chain, so
   adding a new one is a one-line addition.
   ------------------------------------------------------------------ */

type Line = { type: 'input' | 'output' | 'error'; text: string }

const PROMPT = 'ashmit@portfolio ~ %'

const APP_IDS = APPS.map((a) => a.id) as string[]

function isAppId(value: string): value is AppId {
  return APP_IDS.includes(value)
}

const WELCOME = "Welcome to RI/OS Terminal. Type 'help' to get started."

export default function TerminalApp({ openApp }: AppProps) {
  const [lines, setLines] = useState<Line[]>([{ type: 'output', text: WELCOME }])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines])

  const print = (text: string, type: Line['type'] = 'output') =>
    setLines((prev) => [...prev, { type, text }])

  const openAndReport = (id: AppId, label: string) => {
    openApp(id)
    print(`Opening ${label}…`)
  }

  /* ---------------- Command table ---------------- */

  const commands: Record<string, (args: string[]) => void> = {
    help: () =>
      print(
        [
          'Available commands:',
          '',
          '  about        who I am',
          "  projects     what I've built",
          '  experience   where I\u2019ve worked',
          '  skills       what I work with',
          '  resume       open my resume',
          '  contact      get in touch',
          '  open <app>   open any app by id',
          '  whoami       current user',
          '  date         current date & time',
          '  clear        clear the screen',
        ].join('\n')
      ),
    about: () => openAndReport('about', 'About'),
    projects: () => openAndReport('projects', 'Projects'),
    experience: () => openAndReport('experience', 'Experience'),
    skills: () => openAndReport('skills', 'Skills'),
    resume: () => openAndReport('resume', 'Resume'),
    contact: () => openAndReport('contact', 'Contact'),
    whoami: () => print('ashmit'),
    date: () => print(new Date().toString()),
    clear: () => setLines([]),
    open: (args) => {
      const target = args[0]?.toLowerCase()
      if (!target) {
        print('usage: open <app>', 'error')
        return
      }
      if (isAppId(target)) {
        openAndReport(target, target)
      } else {
        print(
          `open: app not found: "${target}" (try: ${APP_IDS.join(', ')})`,
          'error'
        )
      }
    },
  }

  const runCommand = (raw: string) => {
    const trimmed = raw.trim()
    print(`${PROMPT} ${raw}`, 'input')
    if (!trimmed) return

    setCmdHistory((prev) => [...prev, trimmed])
    setHistoryIndex(null)

    const [cmd, ...args] = trimmed.split(/\s+/)
    const handler = commands[cmd.toLowerCase()]
    if (handler) {
      handler(args)
    } else {
      print(`command not found: ${cmd}. Type 'help' for a list.`, 'error')
    }
  }

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    const meta = e.metaKey || e.ctrlKey

    if (meta && (e.key.toLowerCase() === 'l' || e.key.toLowerCase() === 'k')) {
      e.preventDefault()
      setLines([])
      return
    }
    if (e.key === 'Enter') {
      runCommand(input)
      setInput('')
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length === 0) return
      setHistoryIndex((prev) => {
        const next = prev === null ? cmdHistory.length - 1 : Math.max(0, prev - 1)
        setInput(cmdHistory[next])
        return next
      })
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === null) return
      const next = historyIndex + 1
      if (next >= cmdHistory.length) {
        setHistoryIndex(null)
        setInput('')
      } else {
        setHistoryIndex(next)
        setInput(cmdHistory[next])
      }
    }
  }

  return (
    <div
      className="app app-terminal"
      onPointerDown={(e) => {
        // Clicking anywhere in the terminal (not just the input line)
        // should feel like clicking into a real shell.
        if (e.target !== inputRef.current) inputRef.current?.focus()
      }}
    >
      <div className="app-terminal__scroll" ref={scrollRef}>
        <pre>
          {lines.map((line, i) => (
            <div
              key={i}
              className={
                'app-terminal__line' +
                (line.type === 'error' ? ' app-terminal__line--error' : '')
              }
            >
              {line.text}
            </div>
          ))}
        </pre>
        <div className="app-terminal__prompt-row">
          <span className="app-terminal__prompt">{PROMPT}</span>
          <input
            ref={inputRef}
            className="app-terminal__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
          />
          <span className="app-terminal__cursor" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
