import { useMemo, useState } from "react";
import { forecastRows, MONTHS } from "@/data/forecast";
import { useApp } from "@/context/AppContext";
import { Download } from "lucide-react";
import { toast } from "sonner";

const PERIODS = [
  { label: "Apr–Jun 2026", idx: [0,1,2] },
  { label: "Jul–Sep 2026", idx: [3,4,5] },
  { label: "Okt–Des 2026", idx: [6,7,8] },
  { label: "Jan–Mar 2027", idx: [9,10,11] },
];

const idxColor = (v: number) => {
  if (v <= 1) return { bg: "bg-danger/15",  text: "text-danger",  label: "Sangat Terbatas" };
  if (v === 2) return { bg: "bg-orange-500/15", text: "text-orange-400", label: "Terbatas" };
  if (v === 3) return { bg: "bg-warning/15", text: "text-warning", label: "Normal" };
  if (v === 4) return { bg: "bg-success/15", text: "text-success", label: "Tersedia" };
  return { bg: "bg-primary/15", text: "text-primary", label: "Surplus" };
};

export default function Forecasting() {
  const { segment } = useApp();
  const [period, setPeriod] = useState(0);

  const rows = useMemo(() =>
    forecastRows.filter(r => segment === "All" || r.segmen.includes(segment as any))
  , [segment]);

  const exportCsv = () => {
    const header = ["No","Bahan Baku","Segmen", ...MONTHS, "Trend","Rekomendasi"];
    const lines = [header.join(",")];
    rows.forEach((r,i) => {
      const cells = [i+1, `"${r.nama}"`, `"${r.segmen.join('|')}"`, ...r.values, `"${r.trend}"`, `"${r.rek.replace(/"/g,'""')}"`];
      lines.push(cells.join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "feedtrack-forecast.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Forecast diunduh sebagai CSV");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Forecasting Ketersediaan</h1>
          <p className="text-sm text-muted-foreground mt-1">Proyeksi indeks 12 bulan ke depan · 1 = Kritis · 5 = Surplus</p>
        </div>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium">
          <Download className="h-4 w-4" /> Export ke Excel
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {PERIODS.map((p, i) => (
          <button key={p.label}
            onClick={() => setPeriod(i)}
            className={`px-4 py-2 rounded-md text-sm border transition-colors ${
              period === i
                ? "bg-primary/15 border-primary/40 text-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="ft-card overflow-hidden">
        <div className="overflow-x-auto scroll-thin">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-2 py-3 text-left">No</th>
                <th className="px-3 py-3 text-left">Bahan Baku</th>
                <th className="px-3 py-3 text-left">Segmen</th>
                {MONTHS.map((m,i) => (
                  <th key={m} className={`px-2 py-3 text-center ${PERIODS[period].idx.includes(i) ? "bg-primary/10 text-primary" : ""}`}>{m}</th>
                ))}
                <th className="px-3 py-3 text-left">Trend</th>
                <th className="px-3 py-3 text-left min-w-[260px]">Rekomendasi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i) => (
                <tr key={r.id} className="border-t border-border hover:bg-card-hover">
                  <td className="px-2 py-2 text-muted-foreground font-mono">{i+1}</td>
                  <td className="px-3 py-2 font-medium whitespace-nowrap">{r.nama}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{r.segmen.join(", ")}</td>
                  {r.values.map((v, j) => {
                    const c = idxColor(v);
                    return (
                      <td key={j} className={`px-1 py-2 text-center font-mono ${c.bg} ${c.text} ${PERIODS[period].idx.includes(j) ? "ring-1 ring-inset ring-primary/30" : ""}`}>
                        {v}
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 text-xs whitespace-nowrap">{r.trend}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{r.rek}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap */}
      <div className="ft-card p-5">
        <h2 className="font-semibold mb-1">Heat Map Ketersediaan</h2>
        <p className="text-xs text-muted-foreground mb-4">Visualisasi cepat 20 bahan × 12 bulan</p>
        <div className="overflow-x-auto scroll-thin">
          <div className="inline-block min-w-full">
            <div className="grid" style={{ gridTemplateColumns: `200px repeat(12, minmax(36px, 1fr))` }}>
              <div className="text-xs text-muted-foreground" />
              {MONTHS.map(m => <div key={m} className="text-xs text-center text-muted-foreground py-1">{m}</div>)}
              {rows.map(r => (
                <>
                  <div key={r.id+"-l"} className="text-xs py-1 pr-2 truncate">{r.nama}</div>
                  {r.values.map((v, j) => {
                    const c = idxColor(v);
                    return (
                      <div key={r.id + "-" + j}
                        title={`${r.nama} · ${MONTHS[j]}: ${v} (${c.label})`}
                        className={`m-0.5 rounded-sm h-7 flex items-center justify-center font-mono text-xs ${c.bg} ${c.text}`}>
                        {v}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 text-xs">
          {[1,2,3,4,5].map(v => {
            const c = idxColor(v);
            return <span key={v} className={`ft-badge ${c.bg} ${c.text} border-transparent`}>{v} · {c.label}</span>;
          })}
        </div>
      </div>
    </div>
  );
}
