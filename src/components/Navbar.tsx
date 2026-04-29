import { NavLink } from "react-router-dom";
import { Wheat, Menu, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";

const links = [
  { to: "/",              label: "Dashboard" },
  { to: "/bahan-baku",    label: "Bahan Baku" },
  { to: "/forecasting",   label: "Forecasting" },
  { to: "/penawaran",     label: "Penawaran" },
  { to: "/analisis-harga",label: "Analisis Harga" },
];

export function Navbar() {
  const { segment, setSegment } = useApp();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-16 flex items-center gap-6">
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <span className="h-9 w-9 rounded-lg bg-success/15 border border-success/30 flex items-center justify-center">
            <Wheat className="h-5 w-5 text-success" />
          </span>
          <span className="font-semibold tracking-tight text-lg">FeedTrack <span className="text-primary">Pro</span></span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-1 flex-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden md:flex items-center gap-3">
          <span className="ft-badge bg-card border-border text-muted-foreground font-mono text-[11px]">
            Data: April 2026
          </span>
          <select
            value={segment}
            onChange={(e) => setSegment(e.target.value as any)}
            className="bg-card border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">Semua Segmen</option>
            <option value="Poultry">Poultry</option>
            <option value="Ruminansia">Ruminansia</option>
            <option value="Aquaculture">Aquaculture</option>
          </select>
        </div>

        <button
          className="md:hidden ml-auto p-2 rounded-md hover:bg-card"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-3 space-y-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm ${
                  isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-card"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <div className="pt-2 flex items-center gap-2">
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value as any)}
              className="bg-card border border-border rounded-md px-3 py-2 text-sm flex-1"
            >
              <option value="All">Semua Segmen</option>
              <option value="Poultry">Poultry</option>
              <option value="Ruminansia">Ruminansia</option>
              <option value="Aquaculture">Aquaculture</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
}
