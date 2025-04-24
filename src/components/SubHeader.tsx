import { useClub } from "@/contexts/ClubContext"
import { Link, useLocation } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useEffect, useState } from "react"

export function SubHeader() {
  const { selectedClub } = useClub()
  const location = useLocation()
  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  
  // Check if we need scroll buttons and update scroll state
  useEffect(() => {
    // Only run effect if selectedClub exists
    if (!selectedClub) return
    
    const checkScroll = () => {
      if (!tabsContainerRef.current) return

      const { scrollWidth, clientWidth, scrollLeft } = tabsContainerRef.current
      const needsScrollButtons = scrollWidth > clientWidth
      
      setShowScrollButtons(needsScrollButtons)
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth)
    }

    // Perform initial check
    checkScroll()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScroll)
    
    // Add event listener for scroll
    if (tabsContainerRef.current) {
      tabsContainerRef.current.addEventListener('scroll', checkScroll)
    }
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('resize', checkScroll)
      if (tabsContainerRef.current) {
        tabsContainerRef.current.removeEventListener('scroll', checkScroll)
      }
    }
  }, [selectedClub]) // Add selectedClub as a dependency

  // Scroll the tab container left or right
  const scrollTabs = (direction: 'left' | 'right') => {
    if (!tabsContainerRef.current) return
    
    const scrollAmount = 200 // pixels to scroll
    const currentScroll = tabsContainerRef.current.scrollLeft
    
    if (direction === 'left') {
      tabsContainerRef.current.scrollTo({
        left: currentScroll - scrollAmount,
        behavior: 'smooth'
      })
    } else {
      tabsContainerRef.current.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth'
      })
    }
  }
  
  // Early return if no club is selected
  if (!selectedClub) return null
  
  // Define the navigation tabs - this is fine after all hooks are called
  const tabs = [
    { name: "Home", path: `/clube/${selectedClub.alias}` },
    { name: "Calendário", path: `/clube/${selectedClub.alias}/calendario` },
    { name: "Classificação", path: `/clube/${selectedClub.alias}/classificacao` },
    { name: "Regulamento", path: `/clube/${selectedClub.alias}/regulamento` }
  ]
  
  const isActive = (path: string) => {
    // Handle the root club path as "Home"
    if (path === `/clube/${selectedClub.alias}` && location.pathname === `/clube/${selectedClub.alias}`) {
      return true
    }
    return location.pathname === path
  }

  return (
    <div className="bg-primary-500/10 border-b relative">
      {/* Left scroll button */}
      {showScrollButtons && (
        <button 
          onClick={() => scrollTabs('left')}
          className={`absolute left-0 top-0 bottom-0 z-10 px-1 flex items-center justify-center bg-gradient-to-r from-background to-transparent ${
            canScrollLeft ? 'text-foreground' : 'text-muted-foreground pointer-events-none opacity-0'
          } transition-opacity md:hidden`}
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      
      <div className="container px-0 md:px-8 relative">
        <div 
          ref={tabsContainerRef}
          className="flex h-10 overflow-x-auto scrollbar-hide snap-x md:overflow-visible"
        >
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              to={tab.path}
              className={`flex items-center px-4 transition-colors whitespace-nowrap snap-start ${
                isActive(tab.path)
                  ? "text-primary-500 border-b-2 border-primary-500 font-medium"
                  : "text-muted-foreground hover:text-primary-500 hover:bg-primary-500/5"
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Right scroll button */}
      {showScrollButtons && (
        <button 
          onClick={() => scrollTabs('right')}
          className={`absolute right-0 top-0 bottom-0 z-10 px-1 flex items-center justify-center bg-gradient-to-l from-background to-transparent ${
            canScrollRight ? 'text-foreground' : 'text-muted-foreground pointer-events-none opacity-0'
          } transition-opacity md:hidden`}
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  )
} 