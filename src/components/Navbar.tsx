import { ModeToggle } from "./mode-toggle";
import { Button } from "brk-design-system";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "brk-design-system";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "brk-design-system";
import { ChevronDown, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "brk-design-system";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

// Use the environment variable or default to the production URL if not set
const APP_URL = import.meta.env.VITE_APP_URL;
const API_URL = import.meta.env.VITE_API_URL;

export function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Auth state for brk-site
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      try {
        const res = await fetchWithAuth(`${API_URL}/auth/me`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    setUser(null);
    navigate("/");
  };

  return (
    <header className="bg-primary text-navbar-foreground py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img
              src="/logo-brk-marca-horizontal-black.svg"
              alt="BRK Logo"
              className="h-6 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/logo-brk.svg";
              }}
            />
          </Link>

          {/* Menu para Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="inline-flex h-9 w-max items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/30 hover:text-accent-foreground focus:bg-accent/30 focus:text-accent-foreground focus:outline-none"
            >
              Início
            </Link>

            <Link
              to="/campeonatos"
              className="inline-flex h-9 w-max items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/30 hover:text-accent-foreground focus:bg-accent/30 focus:text-accent-foreground focus:outline-none"
            >
              Campeonatos
            </Link>
          </nav>
        </div>

        {/* Menu para Mobile */}
        <div className="flex items-center gap-4">
          {authLoading ? (
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none hidden md:flex">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback className="text-foreground">
                      {user?.name
                        ? user.name
                            .split(" ")
                            .filter(Boolean)
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)
                        : user?.email
                        ? user.email[0].toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user?.name}</span>
                  <ChevronDown
                    className="h-4 w-4 transition duration-300 group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a
                    href={`${APP_URL}/dashboard`}
                  >
                    Dashboard
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href={`${APP_URL}/financial`}
                  >
                    Financeiro
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href={`${APP_URL}/profile/edit`}
                  >
                    Perfil
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="default"
              variant="ghost"
              className="hidden md:flex text-navbar-foreground hover:bg-accent/30"
              asChild
            >
              <a href={`${APP_URL}/login`}>Entrar</a>
            </Button>
          )}

          {/* Theme Toggle - Temporariamente escondido */}
          <div className="hidden">
            <ModeToggle />
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">
                {user && (
                  <div className="flex items-center gap-2 p-2">
                    <Avatar>
                      <AvatarFallback className="text-foreground">
                        {user?.name
                          ? user.name
                              .split(" ")
                              .filter(Boolean)
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                          : user?.email
                          ? user.email[0].toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </div>
                )}
                <nav className="flex flex-col gap-2">
                  <Link
                    to="/"
                    className="px-2 py-1 rounded-2xl hover:bg-accent/50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Início
                  </Link>
                  <Link
                    to="/campeonatos"
                    className="px-2 py-1 rounded-2xl hover:bg-accent/50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Campeonatos
                  </Link>

                  {user && (
                    <>
                      <div className="h-px bg-border my-2" />
                      <a
                        href={`${APP_URL}/dashboard`}
                        className="px-2 py-1 rounded-2xl hover:bg-accent/50 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </a>
                      <a
                        href={`${APP_URL}/financial`}
                        className="px-2 py-1 rounded-2xl hover:bg-accent/50 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Financeiro
                      </a>
                      <a
                        href={`${APP_URL}/profile/edit`}
                        className="px-2 py-1 rounded-2xl hover:bg-accent/50 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Perfil
                      </a>
                      <div className="h-px bg-border my-2" />
                      <button
                        className="px-2 py-1 rounded-2xl hover:bg-accent/50 transition-colors text-destructive text-left"
                        onClick={() => {
                          setIsOpen(false);
                          handleLogout();
                        }}
                        type="button"
                      >
                        Sair
                      </button>
                    </>
                  )}

                  {!user && (
                    <>
                      <div className="h-px bg-border my-2" />
                      <a
                        href={`${APP_URL}/login`}
                        className="px-2 py-1 rounded-2xl hover:bg-accent/50 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Entrar
                      </a>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
