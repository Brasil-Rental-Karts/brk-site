import { Navbar } from "@/components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Footer } from "@/components/Footer";

interface MainFullWidhtLayoutProps {
  children: React.ReactNode;
}

export function MainFullWidhtLayout({ children }: MainFullWidhtLayoutProps) {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main content */}
      <main className="flex-1 w-full">{children}</main>

      <Footer />
    </div>
  );
}
