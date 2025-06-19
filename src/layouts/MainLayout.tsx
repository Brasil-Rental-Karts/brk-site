import { Navbar } from "@/components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Footer } from "@/components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main content */}
      <main className="container flex-1 py-16">{children}</main>
      
      <Footer />
    </div>
  );
}
