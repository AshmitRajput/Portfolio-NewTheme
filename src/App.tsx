import { useEffect, useState } from 'react'
// Adjust this import if your hero file/export is named differently
import Hero from './components/hero'
import PortfolioOS from './components/os/PortfolioOS'
import './App.css'

function App() {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // #app, #app/about, #app/projects... all land in the OS
  if (hash.startsWith('#app')) {
    return <PortfolioOS />
  }

  return (
    <main className="page">
      <Hero />
    </main>
  )
}

export default App
