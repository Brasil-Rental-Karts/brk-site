import { Home } from "@/pages/Home"
import { About } from "@/pages/About"
import { Championship } from "@/pages/Championship"
import { Championships } from "@/pages/Championships"
import { MainFullWidhtLayout } from "@/layouts/MainFullWidhtLayout"
import { MainLayout } from "@/layouts/MainLayout"
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { Privacy } from "./pages/Privacy"
import { Terms } from "./pages/Terms"

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
        <Route path="/" element={<MainFullWidhtLayout><Home /></MainFullWidhtLayout>} />
        <Route path="/privacidade" element={<MainLayout><Privacy /></MainLayout>} />
        <Route path="/termos-de-uso" element={<MainLayout><Terms /></MainLayout>} />
        <Route path="/sobre-brk" element={<MainLayout><About /></MainLayout>} />
        <Route path="/campeonatos" element={<MainLayout><Championships /></MainLayout>} />
        <Route path="/campeonato/:slug" element={<MainFullWidhtLayout><Championship /></MainFullWidhtLayout>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App
