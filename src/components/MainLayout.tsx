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
  
  // Verificar se está na página de piloto
  const isPilotPage = location.pathname.startsWith('/pilotos/')

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
      {!isPilotPage && <SubHeader />}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
} 