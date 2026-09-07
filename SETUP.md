# Portfolio OS — Phases 1–5 setup

## Full folder (copy into your project's `src/`, overwriting)

```
src/
├── App.tsx                          ← hash routing: Hero ↔ #app
├── data/                            ← ALL your content lives here
│   ├── apps.ts                      ← app registry (icons, sizes, dock/desktop)
│   ├── about.ts                     ← name, bio, education, links, resume path
│   ├── projects.ts
│   ├── experience.ts
│   └── skills.ts
└── components/os/
    ├── PortfolioOS.tsx              ← desktop, menu bar, window manager
    ├── PortfolioOS.css              ← OS chrome styling
    ├── Window.tsx                   ← drag / resize / traffic lights
    ├── Dock.tsx
    ├── DesktopIcon.tsx
    ├── types.ts
    └── apps/
        ├── index.ts                 ← AppId → component map + AppProps
        ├── apps.css                 ← shared styling for all app windows
        ├── AboutApp.tsx
        ├── ProjectsApp.tsx          ← grid → click card → detail view
        ├── ExperienceApp.tsx        ← timeline
        ├── SkillsApp.tsx
        ├── ResumeApp.tsx            ← PDF preview + download
        ├── ContactApp.tsx           ← links + copy email
        └── TerminalApp.tsx          ← static until Phase 6
```

## Install

1. Copy `src/data/` and `src/components/os/` into your project (replace the
   old `os/` folder entirely).
2. Replace `src/App.tsx`. Check the `Hero` import path matches your
   `components/hero.tsx`.
3. Hero CTA: `href="#app"`, label "View Portfolio".
4. Put your resume at `public/resume.pdf` (or change `resumeUrl` in
   `data/about.ts`).
5. `npm run dev`.

## Fill in your content

Search for `TODO` across `src/data/*.ts`. Nothing in the components needs
to change — every app reads from these files.

- `about.ts` — name, role, tagline, bio paragraphs, education, interests,
  email, GitHub, LinkedIn.
- `projects.ts` — the `id` is used by the Terminal later (`open recovery-ai`).
  Leave `demo` empty to hide the demo button.
- `experience.ts` — most recent first.
- `skills.ts` — grouped chips.

## What works now

- Phase 1: desktop, menu bar (shows the focused app's name), icons, Dock
- Phase 2: drag, resize (bottom-right), close / minimize / maximize, focus
- Phase 4: About app (with buttons that open Projects / Contact)
- Phase 5: Projects (grid + detail), Experience, Skills, Resume, Contact
- Bug fix: traffic lights were invisible on the focused window (specificity)

## Adding a new app later

1. Add the id to `AppId` in `types.ts`.
2. Add an entry to `data/apps.ts`.
3. Create `apps/YourApp.tsx` and register it in `apps/index.ts`.

## Next: Phase 6 — interactive Terminal

Real input, command history, `help / about / projects / open <id> / clear`,
with commands calling `openApp` through `AppProps`.
