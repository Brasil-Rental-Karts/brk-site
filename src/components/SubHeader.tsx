import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useClub } from "@/contexts/ClubContext"
import { cn } from "@/lib/utils"

export function SubHeader() {
  const { selectedClub } = useClub()
  const location = useLocation()
  const tabsRef = useRef<HTMLDivElement>(null)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)
  
  // Define tabs based on selectedClub
  const tabs = selectedClub ? [
    { name: "Home", path: `/clube/${selectedClub.alias}` },
    { name: "Calendário", path: `/clube/${selectedClub.alias}/calendario` },
    { name: "Classificação", path: `/clube/${selectedClub.alias}/classificacao` },
    { name: "Regulamento", path: `/clube/${selectedClub.alias}/regulamento` },
  ] : [];

  const checkScrollButtons = () => {
    if (!tabsRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current
    setShowLeftButton(scrollLeft > 0)
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scrollLeft = () => {
    if (!tabsRef.current) return
    tabsRef.current.scrollBy({ left: -200, behavior: "smooth" })
  }

  const scrollRight = () => {
    if (!tabsRef.current) return
    tabsRef.current.scrollBy({ left: 200, behavior: "smooth" })
  }

  const isActive = (path: string) => {
    if (!selectedClub) return false
    
    // Exact match for club home
    if (path === `/clube/${selectedClub.alias}` && location.pathname === path) {
      return true
    }
    
    // Check if we're on a subpage
    if (path !== `/clube/${selectedClub.alias}` && location.pathname.includes(path)) {
      return true
    }
    
    return false
  }

  // Always define the effect, but check selectedClub inside
  useEffect(() => {
    if (!selectedClub || !tabsRef.current) return
    
    const tabsElement = tabsRef.current
    checkScrollButtons()

    const handleResize = () => {
      checkScrollButtons()
    }

    const handleScroll = () => {
      checkScrollButtons()
    }

    window.addEventListener("resize", handleResize)
    tabsElement.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (tabsElement) {
        tabsElement.removeEventListener("scroll", handleScroll)
      }
    }
  }, [selectedClub]);

  // Early return if no club selected - after all hooks are defined
  if (!selectedClub) {
    return null
  }

  return (
    <div className="bg-background shadow-sm sticky top-0 z-10 border-b">
      <div className="container relative">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <img
              src={selectedClub.logo}
              alt={selectedClub.name}
              className="h-8 w-8 mr-2"
            />
            <h2 className="text-lg font-bold truncate max-w-[200px] sm:max-w-xs text-foreground">
              {selectedClub.name}
            </h2>
          </div>
        </div>

        <div className="relative">
          {showLeftButton && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-background shadow-md rounded-full p-1"
              aria-label="Scroll left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          <div
            ref={tabsRef}
            className="flex overflow-x-auto scrollbar-hide py-2 space-x-6 pl-0"
          >
            {tabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  "whitespace-nowrap pb-2 border-b-2 font-medium text-sm transition-colors duration-200",
                  isActive(tab.path)
                    ? "border-primary-500 text-primary-500"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.name}
              </Link>
            ))}
          </div>

          {showRightButton && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-background shadow-md rounded-full p-1"
              aria-label="Scroll right"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 