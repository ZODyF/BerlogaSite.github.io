import { Moon, Sun, Lock, Unlock, Menu, X, CalendarDays } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export function Header() {
  const { theme, toggleTheme, isAdmin } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight text-xl">
          <span className="text-primary">BEERLOGA</span>
          <span className="text-muted-foreground font-normal">Смены</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5 ${
              location.pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Календарь
          </Link>
          <Link
            to="/admin"
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
              location.pathname === "/admin" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {isAdmin ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            Админ
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-secondary transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t overflow-hidden bg-background"
          >
            <div className="flex flex-col px-4 py-4 space-y-4">
              <Link
                to="/"
                onClick={closeMenu}
                className={`text-lg font-medium py-2 flex items-center gap-2 ${
                  location.pathname === "/" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <CalendarDays className="w-5 h-5" />
                Календарь
              </Link>
              <Link
                to="/admin"
                onClick={closeMenu}
                className={`text-lg font-medium py-2 flex items-center gap-2 ${
                  location.pathname === "/admin" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {isAdmin ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                Админ Панель
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
