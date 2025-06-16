import { Home } from "@/pages/Home"
import { About } from "@/pages/About"
import { Club } from "@/pages/Club"
import { Pilot } from "@/pages/Pilot"
import { Championship } from "@/pages/Championship"
import { MainLayout } from "@/components/MainLayout"
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { ClubProvider } from "@/contexts/ClubContext"
import { useEffect } from "react"
import { Privacy } from "./pages/Privacy"

// Create specific route components
const ClubCalendario = () => <Club section="calendario" />
const ClubClassificacao = () => <Club section="classificacao" />
const ClubRegulamento = () => <Club section="regulamento" />

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  )
}

// Componente intermediário que usa o useLocation dentro do contexto do Router
function AppContent() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<ClubProvider><MainLayout><Home /></MainLayout></ClubProvider>} />
        <Route path="/privacidade" element={<Privacy />} />
        <Route path="/about" element={<ClubProvider><MainLayout><About /></MainLayout></ClubProvider>} />
        <Route path="/campeonato" element={<ClubProvider><MainLayout><Championship /></MainLayout></ClubProvider>} />
        <Route path="/clube/:alias" element={<ClubProvider><MainLayout><Club /></MainLayout></ClubProvider>} />
        <Route path="/clube/:alias/calendario" element={<ClubProvider><MainLayout><ClubCalendario /></MainLayout></ClubProvider>} />
        <Route path="/clube/:alias/classificacao" element={<ClubProvider><MainLayout><ClubClassificacao /></MainLayout></ClubProvider>} />
        <Route path="/clube/:alias/regulamento" element={<ClubProvider><MainLayout><ClubRegulamento /></MainLayout></ClubProvider>} />
        <Route path="/pilotos/:pilotSlug" element={<ClubProvider><MainLayout><Pilot /></MainLayout></ClubProvider>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App
