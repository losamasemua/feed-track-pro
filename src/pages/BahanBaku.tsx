import { useMemo, useState, useEffect } from "react";
import { ingredients, KATEGORI_LIST, type Ingredient } from "@/data/ingredients";
import { useApp } from "@/context/AppContext";
import { StatusBadge } from "@/components/StatusBadge";
import { IngredientDrawer } from "@/components/IngredientDrawer";
import { fmtRp, fmtNum } from "@/lib/format";
import { Search, ArrowUpDown } from "lucide-react";

type SortKey = "nama" | "harga" | "pk";

export default function BahanBaku() {
  const { segment } = useApp();
  const [q, setQ] = useState("");
  const [kategori, setKategori] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("nama");
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc");
  const [active, setActive] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(()=>setLoading(false), 400); return ()=>clearTimeout(t); }, []);

  const rows = useMemo(() => {
    let r = ingredients.filter(i => {
      if (q && !i.nama.toLowerCase().includes(q.toLowerCase())) return false;
      if (kategori !== "All" && i.kategori !== kategori) return false;
      if (segment !== "All" && !i.segmen.includes(segment as any)) return false;
      return true;
    });
    r = [...r].sort((a,b) => {
      const va = a[sortKey] as any, vb = b[sortKey] as any;
      if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? va - vb : vb - va;
    });
    return r;
  }, [q, kategori, segment, sortKey, sortDir]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Database Bahan Baku</h1>
        <p className="text-sm text-muted-foreground mt-1">{rows.length} dari {ingredients.length} bahan baku · klik baris untuk detail</p>
      </div>

      {/* filters */}
      <div className="ft-card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Cari bahan baku…"
            className="w-full bg-surface border border-border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select value={kategori} onChange={e => setKategori(e.target.value)}
          className="bg-surface border border-border rounded-md px-3 py-2 text-sm">
          {KATEGORI_LIST.map(k => <option key={k} value={k}>{k === "All" ? "Semua Kategori" : k}</option>)}
        </select>
        <span className="text-xs text-muted-foreground font-mono">Segmen: {segment}</span>
      </div>

      {/* table */}
      <div className="ft-card overflow-hidden">
        <div className="overflow-x-auto scroll-thin">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-3 text-left">No</th>
                <th className="px-3 py-3 text-left cursor-pointer" onClick={() => toggleSort("nama")}>
                  <span className="inline-flex items-center gap-1">Nama Bahan Baku <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="px-3 py-3 text-left">Kategori</th>
                <th className="px-3 py-3 text-left">Asal</th>
                <th className="px-3 py-3 text-right cursor-pointer" onClick={() => toggleSort("pk")}>
                  <span className="inline-flex items-center gap-1">PK% <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="px-3 py-3 text-right">LK%</th>
                <th className="px-3 py-3 text-right">ME</th>
                <th className="px-3 py-3 text-right cursor-pointer" onClick={() => toggleSort("harga")}>
                  <span className="inline-flex items-center gap-1 justify-end">Harga Apr'26 <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="px-3 py-3 text-left">Ketersediaan</th>
                <th className="px-3 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({length:8}).map((_,i)=>(
                  <tr key={i} className="border-t border-border">
                    {Array.from({length:10}).map((_,j)=>(
                      <td key={j} className="px-3 py-3"><div className="h-3 bg-secondary rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr><td colSpan={10} className="px-3 py-12 text-center text-muted-foreground">Tidak ada bahan baku yang sesuai pencarian</td></tr>
              ) : rows.map((it, i) => (
                <tr key={it.id} onClick={() => setActive(it)}
                    className="border-t border-border hover:bg-card-hover cursor-pointer transition-colors">
                  <td className="px-3 py-3 text-muted-foreground font-mono">{i+1}</td>
                  <td className="px-3 py-3 font-medium">{it.nama}</td>
                  <td className="px-3 py-3 text-muted-foreground">{it.kategori}</td>
                  <td className="px-3 py-3 text-muted-foreground">{it.asal}</td>
                  <td className="px-3 py-3 text-right font-mono">{fmtNum(it.pk,1)}</td>
                  <td className="px-3 py-3 text-right font-mono">{fmtNum(it.lk,1)}</td>
                  <td className="px-3 py-3 text-right font-mono">{fmtNum(it.me)}</td>
                  <td className="px-3 py-3 text-right font-mono text-foreground">{fmtRp(it.harga)}</td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{it.ketersediaan}</td>
                  <td className="px-3 py-3"><StatusBadge status={it.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <IngredientDrawer item={active} onClose={() => setActive(null)} />
    </div>
  );
}
