import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { initialOffers, Offer } from "@/data/forecast";

type SegmentFilter = "All" | "Poultry" | "Ruminansia" | "Aquaculture";

interface AppCtx {
  segment: SegmentFilter;
  setSegment: (s: SegmentFilter) => void;
  offers: Offer[];
  addOffer: (o: Omit<Offer, "id">) => void;
  updateOffer: (id: number, patch: Partial<Offer>) => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [segment, setSegmentState] = useState<SegmentFilter>(() => {
    return (localStorage.getItem("ft_segment") as SegmentFilter) || "All";
  });
  const [offers, setOffers] = useState<Offer[]>(() => {
    try {
      const raw = localStorage.getItem("ft_offers");
      if (raw) return JSON.parse(raw);
    } catch {}
    return initialOffers as Offer[];
  });

  useEffect(() => { localStorage.setItem("ft_segment", segment); }, [segment]);
  useEffect(() => { localStorage.setItem("ft_offers", JSON.stringify(offers)); }, [offers]);

  const setSegment = (s: SegmentFilter) => setSegmentState(s);
  const addOffer = (o: Omit<Offer,"id">) =>
    setOffers(prev => [{ ...o, id: Math.max(0, ...prev.map(p=>p.id)) + 1 }, ...prev]);
  const updateOffer = (id: number, patch: Partial<Offer>) =>
    setOffers(prev => prev.map(o => o.id === id ? { ...o, ...patch } : o));

  return <Ctx.Provider value={{ segment, setSegment, offers, addOffer, updateOffer }}>{children}</Ctx.Provider>;
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
}
