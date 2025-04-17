import { Home } from "@/pages/Home"
import { About } from "@/pages/About"
import { Club } from "@/pages/Club"
import { MainLayout } from "@/components/MainLayout"
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { ClubProvider } from "@/contexts/ClubContext"

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
              </Routes>
            </AnimatePresence>
          </MainLayout>
        </ClubProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App
