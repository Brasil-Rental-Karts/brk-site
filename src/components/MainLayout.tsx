import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { SubHeader } from "./SubHeader"
import { useLocation } from "react-router-dom"
import { useClub } from "@/contexts/ClubContext"
import { useEffect, useRef } from "react"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()
  const { clearClub } = useClub()
  const prevPathRef = useRef(location.pathname)
  
  // Verificar se está na página de piloto ou campeonato
  const isPilotPage = location.pathname.startsWith('/pilotos/')
  const isChampionshipPage = location.pathname === '/campeonato'

  useEffect(() => {
    // Only clear if we're navigating TO home FROM another page
    if (location.pathname === '/' && prevPathRef.current !== '/') {
      clearClub()
    }
    prevPathRef.current = location.pathname
  }, [location.pathname, clearClub])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {!isPilotPage && !isChampionshipPage && <SubHeader />}
      <main className="flex-1 container">
        <div className="max-w-[1920px] w-full mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
} 