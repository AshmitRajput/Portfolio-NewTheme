import type { ComponentType } from 'react'
import type { AppId } from '../types'
import AboutApp from './AboutApp'
import ProjectsApp from './ProjectsApp'
import ExperienceApp from './ExperienceApp'
import SkillsApp from './SkillsApp'
import ResumeApp from './ResumeApp'
import ContactApp from './ContactApp'
import TerminalApp from './TerminalApp'

/** Every app receives these — lets apps open other apps (About → Projects). */
export type AppProps = {
  openApp: (id: AppId) => void
}

export const APP_COMPONENTS: Record<AppId, ComponentType<AppProps>> = {
  about: AboutApp,
  projects: ProjectsApp,
  experience: ExperienceApp,
  skills: SkillsApp,
  resume: ResumeApp,
  contact: ContactApp,
  terminal: TerminalApp,
}
