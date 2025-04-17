import { createContext, useContext, useState, ReactNode } from "react"
import { useNavigate } from "react-router-dom"

interface Club {
  id: number
  name: string
  city: string
  alias: string
}

export const CLUBS: Club[] = [
  { id: 1, name: "Start Racing Livens", city: "Penha-SC", alias: "start-racing-livens" },
]

interface ClubContextType {
  selectedClub: Club | null
  selectClub: (club: Club) => void
  clearClub: () => void
}

const ClubContext = createContext<ClubContextType | undefined>(undefined)

export function ClubProvider({ children }: { children: ReactNode }) {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const navigate = useNavigate()

  const selectClub = (club: Club) => {
    setSelectedClub(club)
    navigate(`/clube/${club.alias}`)
  }

  const clearClub = () => {
    setSelectedClub(null)
    navigate('/')
  }

  return (
    <ClubContext.Provider value={{ selectedClub, selectClub, clearClub }}>
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