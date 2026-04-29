import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useEffect } from "react";

export function Layout() {
  const loc = useLocation();
  useEffect(() => { localStorage.setItem("ft_last_path", loc.pathname); }, [loc.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 lg:px-6 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-surface/60">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-4 text-xs text-muted-foreground flex flex-wrap items-center gap-2 justify-between">
          <span>FeedTrack Pro · Data: April 2026</span>
          <span className="opacity-80">Sumber: Bapanas, GPMT, Inpres 3/2026, Panel Harga Pangan</span>
        </div>
      </footer>
    </div>
  );
}
