import { useClub } from "@/contexts/ClubContext"
import { Button } from "./ui/button"
import { X } from "lucide-react"

export function SubHeader() {
  const { selectedClub, clearClub } = useClub()

  if (!selectedClub) return null

  return (
    <div className="bg-primary-500/10 border-b">
      <div className="container px-8 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Clube selecionado:</span>
          <span className="font-medium">{selectedClub.name}</span>
          <span className="text-sm text-muted-foreground">({selectedClub.city})</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary-500"
          onClick={clearClub}
        >
          <X className="h-4 w-4 mr-2" />
          Limpar seleção
        </Button>
      </div>
    </div>
  )
} 