import type { Ingredient } from "@/data/ingredients";
import { StatusBadge } from "./StatusBadge";
import { fmtRp } from "@/lib/format";
import { X, MapPin, Calendar, Replace } from "lucide-react";
import { useEffect, useState } from "react";

const SUBS: Record<string, string[]> = {
  "Protein Nabati": ["PKM + Bungkil Kopra (50:50)", "DDGS Jagung 10-15%", "Bungkil Canola 8-12%"],
  "Protein Hewani": ["Tepung Maggot BSF 5-10%", "MBM + Tepung Bulu (kombinasi)", "Silase Ikan lokal"],
  "Energi":         ["Sorghum + Ubi Kayu", "Onggok Singkong 15-25%", "Dedak Padi + Fitase"],
  "Lemak/Minyak":   ["CPO + Flaxseed Oil", "Minyak Kelapa (broiler starter)", "Crude Palm Olein"],
  "Mineral":        ["Tepung Tulang + Fitase", "Kapur Pertanian (Ca)", "Zeolite (mycotoxin binder)"],
  "Vitamin/Additive":["Premix kombinasi multi-supplier","DL-Met + L-Lys low-protein formula","Enzim NSP kombinasi"],
  "Hijauan":        ["Indigofera + Gamal", "Silase Jagung","Pucuk Tebu + urea treatment"],
  "Limbah/By-Product":["Ampas Tahu kering","Ampok Jagung","Ampas Bir/Brewer's"],
};

export function IngredientDrawer({ item, onClose }: { item: Ingredient | null; onClose: () => void }) {
  const [showSubs, setShowSubs] = useState(false);
  const open = !!item;

  useEffect(() => {
    if (open) setShowSubs(false);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-background/70 backdrop-blur-sm z-40 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-card border-l border-border z-50 shadow-2xl
          transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {item && (
          <div className="h-full flex flex-col">
            <div className="p-5 border-b border-border flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.kategori}</div>
                <h3 className="text-lg font-semibold mt-0.5 leading-tight">{item.nama}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={item.status} />
                  <span className="ft-badge bg-secondary border-border text-muted-foreground">{item.asal}</span>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded hover:bg-card-hover">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 scroll-thin">
              <div className="ft-card p-4 bg-surface">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Harga Apr 2026</div>
                <div className="text-3xl font-mono font-semibold text-primary mt-1">{fmtRp(item.harga)}<span className="text-sm text-muted-foreground">/kg</span></div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Komposisi Nutrisi</div>
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {[
                    ["PK", item.pk, "%"],["LK", item.lk, "%"],["SK", item.sk, "%"],["Abu", item.abu, "%"],
                    ["ME", item.me, "kkal"],["Lisin", item.lisin, "%"],["Met", item.met, "%"],
                    ["Ca", item.ca, "%"],["P", item.p, "%"],
                  ].map(([k,v,u]) => (
                    <div key={k as string} className="flex justify-between bg-secondary/50 px-3 py-2 rounded">
                      <span className="text-muted-foreground">{k}</span>
                      <span>{v as number}<span className="text-muted-foreground ml-1 text-xs">{u as string}</span></span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="ft-card p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Ketersediaan</div>
                  <div className="text-sm font-medium mt-1">{item.ketersediaan}</div>
                </div>
                <div className="ft-card p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Musim</div>
                  <div className="text-sm font-medium mt-1">{item.season}</div>
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Catatan</div>
                <p className="text-sm leading-relaxed text-foreground/90">{item.catatan}</p>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Cocok untuk Segmen</div>
                <div className="flex flex-wrap gap-2">
                  {item.segmen.map(s => (
                    <span key={s} className="ft-badge bg-primary/10 border-primary/30 text-primary">{s}</span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowSubs(s => !s)}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 rounded-md py-2.5 text-sm font-medium transition-colors"
              >
                <Replace className="h-4 w-4" /> Lihat Substitusi
              </button>

              {showSubs && (
                <div className="ft-card p-4 animate-fade-in">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Opsi Substitusi</div>
                  <ul className="space-y-2">
                    {(SUBS[item.kategori] || ["Konsultasikan formulator pakan"]).map((s,i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-0.5">→</span><span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
