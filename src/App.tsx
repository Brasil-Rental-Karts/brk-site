import { Home } from "@/pages/Home"
import { PreLaunch } from "@/pages/PreLaunch"
import { About } from "@/pages/About"
import { Club } from "@/pages/Club"
import { Pilot } from "@/pages/Pilot"
import { Clubs } from "@/pages/Clubs"
import { MainLayout } from "@/components/MainLayout"
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { ClubProvider } from "@/contexts/ClubContext"
import { useEffect } from "react"

// Create specific route components
const ClubCalendario = () => <Club section="calendario" />
const ClubClassificacao = () => <Club section="classificacao" />
const ClubRegulamento = () => <Club section="regulamento" />

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <ClubProvider>
          <AppContent />
        </ClubProvider>
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
        <Route path="/" element={<PreLaunch />} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/clubes" element={<MainLayout><Clubs /></MainLayout>} />
        <Route path="/clube/:alias" element={<MainLayout><Club /></MainLayout>} />
        <Route path="/clube/:alias/calendario" element={<MainLayout><ClubCalendario /></MainLayout>} />
        <Route path="/clube/:alias/classificacao" element={<MainLayout><ClubClassificacao /></MainLayout>} />
        <Route path="/clube/:alias/regulamento" element={<MainLayout><ClubRegulamento /></MainLayout>} />
        <Route path="/pilotos/:pilotSlug" element={<MainLayout><Pilot /></MainLayout>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App
