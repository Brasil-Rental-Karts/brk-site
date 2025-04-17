import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Flag } from "lucide-react"
import { useClub, CLUBS } from "@/contexts/ClubContext"

const APP_URL = import.meta.env.VITE_APP_URL

export function Navbar() {
  const { selectClub } = useClub()

  const handleClubSelect = (club: typeof CLUBS[0]) => {
    selectClub(club)
  }

  return (
    <nav className="border-b bg-background">
      <div className="container px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-primary-500 font-bold text-xl hover:text-primary-600 transition-colors">
            BRK
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary-500"
              >
                <Flag className="h-4 w-4" />
                Selecionar Clube
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[280px]">
              {CLUBS.map((club) => (
                <DropdownMenuItem 
                  key={club.id}
                  className="flex flex-col items-start py-3 cursor-pointer"
                  onSelect={() => handleClubSelect(club)}
                >
                  <span className="font-medium">{club.name}</span>
                  <span className="text-sm text-muted-foreground">{club.city}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary-500"
              asChild
            >
              <a href={`${APP_URL}/login`}>
                Login
              </a>
            </Button>
            <Button
              className="bg-primary-500 text-white hover:bg-primary-600"
              asChild
            >
              <a href={`${APP_URL}/signup`}>
                Cadastre-se
              </a>
            </Button>
          </div>
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
} 