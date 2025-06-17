import { Navbar } from "@/components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

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
      <main className="flex-1 w-full">{children}</main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground dark:bg-secondary dark:text-secondary-foreground border-t border-border">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-12 lg:py-12">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <a href="/" className="flex items-center focus:outline focus:outline-2 focus:outline-primary rounded">
                <img
                  src="/logo-brk-marca-horizontal.svg"
                  alt="BRK Logo"
                  className="h-8"
                />
              </a>
              <p className="mt-2 text-sm text-muted-foreground">
                CNPJ: 61.324.049/0001-94
                <br />
                © {new Date().getFullYear()} BRK Soluções em Tecnologia™
                <br />
                Todos os direitos reservados.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12 sm:gap-12 sm:grid-cols-3">
              <div>
                <h2 className="text-sm font-semibold uppercase">A BRK</h2>
                <ul className="text-muted-foreground">
                  <li className="my-2">
                    <a href="/terms" className="hover:underline focus:outline focus:outline-2 focus:outline-primary rounded">
                      Termos de Uso
                    </a>
                  </li>
                  <li>
                    <a href="/privacy" className="hover:underline focus:outline focus:outline-2 focus:outline-primary rounded">
                      Política de Privacidade
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase">Contato</h2>
                <ul className="text-muted-foreground">
                  <li className="my-2">
                    <a
                      href="mailto:falecom@brasilrentalkarts.com.br"
                      className="hover:underline focus:outline focus:outline-2 focus:outline-primary rounded"
                    >
                      falecom@brasilrentalkarts.com.br
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.brasilrentalkarts.com.br"
                      className="hover:underline focus:outline focus:outline-2 focus:outline-primary rounded"
                    >
                      www.brasilrentalkarts.com.br
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase">Siga-nos</h2>
                <ul className="text-muted-foreground">
                  <li>
                    <a
                      href="https://www.instagram.com/brasilrentalkarts/"
                      className="hover:underline focus:outline focus:outline-2 focus:outline-primary rounded"
                    >
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
