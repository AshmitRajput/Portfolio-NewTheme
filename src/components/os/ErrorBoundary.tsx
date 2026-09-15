import { Component } from 'react'
import type { ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  /** Either a fixed node, or a render function that gets the caught
   *  error and a `reset()` you can wire to a "Try again" button. */
  fallback: ReactNode | ((error: Error, reset: () => void) => ReactNode)
}

type ErrorBoundaryState = { error: Error | null }

/**
 * A crash in ANY app's content, or in the Dock, or anywhere else in
 * the tree, previously took down the entire OS to a blank screen —
 * that's exactly what the Dock ref-callback infinite-loop bug did.
 * Wrapping the risky bits in one of these means a future bug in, say,
 * TerminalApp shows an inline "this app hit a snag" card in its own
 * window instead of killing the menu bar, Dock, and every other open
 * window along with it.
 *
 * This has to be a class component — getDerivedStateFromError and
 * componentDidCatch have no hook equivalent in React as of this
 * writing.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // eslint-disable-next-line no-console
    console.error('[RI/OS] caught a render error:', error, info.componentStack)
  }

  reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    if (error) {
      return typeof this.props.fallback === 'function'
        ? this.props.fallback(error, this.reset)
        : this.props.fallback
    }
    return this.props.children
  }
}