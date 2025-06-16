import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { useLocation } from "react-router-dom"
import { useEffect, useRef } from "react"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()
  const prevPathRef = useRef(location.pathname)

  useEffect(() => {
    prevPathRef.current = location.pathname
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container">
        <div className="max-w-[1920px] w-full mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
} 