import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useNavigate } from "react-router-dom"

export interface Club {
  id: string
  name: string
  alias: string
  logo: string
  description: string
  location: {
    city: string
    state: string
    region: string
  }
  contact: {
    phone: string
    email: string
    website: string
  }
  categories: string[]
  history: {
    founded: number
    totalEvents: number
    totalPilots: number
  }
  championships: {
    current: number
    total: number
    averageParticipants: number
    categories?: string[]
  }
  sponsors: Array<{
    id: string
    name: string
    logo: string
    website: string
    type: string
  }>
  events: Array<{
    id: string
    title: string
    date: string
    time: string
    type: string
    status: string
    participants: number
    maxParticipants: number
  }>
}

interface ClubContextType {
  selectedClub: Club | null
  selectClub: (club: Club) => void
  clearClub: () => void
  allClubs: Club[]
}

const ClubContext = createContext<ClubContextType | undefined>(undefined)

export function ClubProvider({ children }: { children: ReactNode }) {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [allClubs, setAllClubs] = useState<Club[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_CACHE_API_URL}/cache/club`)
      .then(res => res.json())
      .then(data => setAllClubs(data.data || []))
      .catch(() => setAllClubs([]))
  }, [])

  const selectClub = (club: Club) => {
    setSelectedClub(club)
    navigate(`/clube/${club.alias}`)
  }

  const clearClub = () => {
    setSelectedClub(null)
    navigate('/')
  }

  return (
    <ClubContext.Provider value={{ selectedClub, selectClub, clearClub, allClubs }}>
      {children}
    </ClubContext.Provider>
  )
}

export function useClub() {
  const context = useContext(ClubContext)
  if (context === undefined) {
    throw new Error('useClub must be used within a ClubProvider')
  }
  return context
} 