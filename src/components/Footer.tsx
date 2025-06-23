import * as React from "react"
import { cn } from "@/lib/utils"

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
}

export function Footer({ className, ...props }: FooterProps) {
  return (
    <footer
      className={cn(
        "bg-secondary text-secondary-foreground dark:bg-secondary dark:text-secondary-foreground border-t border-border",
        className
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-screen-xl p-4 py-12 lg:py-12">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a
              href="/"
              className="flex items-center focus:outline focus:outline-2 focus:outline-primary rounded"
            >
              <img
                src="/logo-brk-marca-horizontal.svg"
                alt="BRK Logo"
                className="h-8"
              />
            </a>
            <p className="mt-2 text-sm text-muted-foreground">
              CNPJ: 61.324.049/0001-94
              <br />© {new Date().getFullYear()} BRK Soluções em Tecnologia™
              <br />
              Todos os direitos reservados.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12 md:grid-cols-3">
            <div>
              <h2 className="text-sm font-semibold uppercase mb-2">A BRK</h2>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <a
                    href="/sobre-brk"
                    className="hover:underline focus:outline focus:outline-2 focus:outline-primary rounded"
                  >
                    Sobre a BRK
                  </a>
                </li>
                <li>
                  <a
                    href="/termos-de-uso"
                    className="hover:underline focus:outline focus:outline-2 focus:outline-primary rounded"
                  >
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a
                    href="/privacidade"
                    className="hover:underline focus:outline focus:outline-2 focus:outline-primary rounded"
                  >
                    Política de Privacidade
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase mb-2">Contato</h2>
              <ul className="text-muted-foreground space-y-2">
                <li>
                  <a
                    href="mailto:falecom@brasilrentalkarts.com.br"
                    className="hover:underline focus:outline focus:outline-2 focus:outline-primary rounded break-all"
                  >
                    falecom@brasilrentalkarts.com.br
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.brasilrentalkarts.com.br"
                    className="hover:underline focus:outline focus:outline-2 focus:outline-primary rounded break-all"
                  >
                    www.brasilrentalkarts.com.br
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase mb-2">Siga-nos</h2>
              <ul className="text-muted-foreground space-y-2">
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
  )
} 