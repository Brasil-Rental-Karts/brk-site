import { Home } from "@/pages/Home"
import { About } from "@/pages/About"
import { Club } from "@/pages/Club"
import { MainLayout } from "@/components/MainLayout"
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { ClubProvider } from "@/contexts/ClubContext"

// Create specific route components
const ClubCalendario = () => <Club section="calendario" />
const ClubClassificacao = () => <Club section="classificacao" />
const ClubRegulamento = () => <Club section="regulamento" />

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <ClubProvider>
          <MainLayout>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/clube/:alias" element={<Club />} />
                <Route path="/clube/:alias/calendario" element={<ClubCalendario />} />
                <Route path="/clube/:alias/classificacao" element={<ClubClassificacao />} />
                <Route path="/clube/:alias/regulamento" element={<ClubRegulamento />} />
              </Routes>
            </AnimatePresence>
          </MainLayout>
        </ClubProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App
