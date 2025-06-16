import { Home } from "@/pages/Home"
import { About } from "@/pages/About"
import { Pilot } from "@/pages/Pilot"
import { Championship } from "@/pages/Championship"
import { MainLayout } from "@/components/MainLayout"
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { Privacy } from "./pages/Privacy"

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
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/privacidade" element={<Privacy />} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/campeonato" element={<MainLayout><Championship /></MainLayout>} />
        <Route path="/pilotos/:pilotSlug" element={<MainLayout><Pilot /></MainLayout>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App
