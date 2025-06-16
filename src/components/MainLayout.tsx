import { Navbar } from "./Navbar"
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
      
      {/* Main content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted py-4 px-6">
        <div className="w-full text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} BRK. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
} 