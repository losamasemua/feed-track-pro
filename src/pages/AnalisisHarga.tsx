import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PRICE_TREND, volatility, subPairs } from "@/data/forecast";
import { fmtRp, fmtNum } from "@/lib/format";
import { Calculator, TrendingUp } from "lucide-react";

const chartData = PRICE_TREND.months.map((m, i) => {
  const row: any = { bulan: m };
  PRICE_TREND.series.forEach(s => { row[s.name] = s.data[i]; });
  return row;
});

const volColor = (v: string) =>
  v === "RENDAH"        ? "ft-status-aman" :
  v === "SEDANG"        ? "ft-status-monitor" :
  v === "TINGGI"        ? "ft-status-kritis" :
  "ft-status-kritis";

export default function AnalisisHarga() {
  const [vol, setVol] = useState(1000);
  const [pairIdx, setPairIdx] = useState(0);
  const pair = subPairs[pairIdx];

  const calc = useMemo(() => {
    const totalKg = vol * 1000; // ton → kg
    const biayaSekarang = totalKg * pair.refHarga;
    const biayaSetelah = totalKg * pair.subHarga;
    const hematBulan = biayaSekarang - biayaSetelah;
    return { biayaSekarang, biayaSetelah, hematBulan, hematTahun: hematBulan * 12 };
  }, [vol, pair]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analisis Harga & Substitusi</h1>
        <p className="text-sm text-muted-foreground mt-1">Tren historis, volatilitas pasar & kalkulator penghematan</p>
      </div>

      {/* Trend chart */}
      <div className="ft-card p-5">
        <div className="flex items-baseline justify-between mb-4 gap-2 flex-wrap">
          <div>
            <h2 className="font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Tren Harga Bahan Baku</h2>
            <p className="text-xs text-muted-foreground">Okt 2025 — Apr 2026 · Rp/kg</p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="bulan" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => fmtNum(v/1000) + "k"} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                formatter={(v: any) => fmtRp(Number(v))}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              {PRICE_TREND.series.map(s => (
                <Line key={s.name} type="monotone" dataKey={s.name} stroke={s.color} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Volatility table */}
      <div className="ft-card overflow-hidden">
        <div className="p-5 pb-3">
          <h2 className="font-semibold">Volatilitas & Strategi Pengadaan</h2>
          <p className="text-xs text-muted-foreground">15 bahan baku utama · perbandingan Okt 2025 vs Apr 2026</p>
        </div>
        <div className="overflow-x-auto scroll-thin">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-3 text-left">Bahan Baku</th>
                <th className="px-3 py-3 text-right">Okt'25</th>
                <th className="px-3 py-3 text-right">Apr'26</th>
                <th className="px-3 py-3 text-left">Perubahan</th>
                <th className="px-3 py-3 text-left">Volatilitas</th>
                <th className="px-3 py-3 text-left">Risiko Supply</th>
                <th className="px-3 py-3 text-left">Waktu Beli</th>
                <th className="px-3 py-3 text-right">Buffer Stok</th>
              </tr>
            </thead>
            <tbody>
              {volatility.map((r,i) => (
                <tr key={i} className="border-t border-border hover:bg-card-hover">
                  <td className="px-3 py-2.5 font-medium">{r.nama}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">{fmtRp(r.okt)}</td>
                  <td className="px-3 py-2.5 text-right font-mono">{fmtRp(r.apr)}</td>
                  <td className="px-3 py-2.5 text-xs font-mono">{r.perubahan}</td>
                  <td className="px-3 py-2.5"><span className={`ft-badge ${volColor(r.volatilitas)}`}>{r.volatilitas}</span></td>
                  <td className="px-3 py-2.5 text-xs">{r.risiko}</td>
                  <td className="px-3 py-2.5 text-xs">{r.waktu}</td>
                  <td className="px-3 py-2.5 text-right text-xs font-mono">{r.buffer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculator */}
      <div className="ft-card p-5">
        <h2 className="font-semibold flex items-center gap-2 mb-1"><Calculator className="h-4 w-4 text-success" /> Kalkulator Penghematan Substitusi</h2>
        <p className="text-xs text-muted-foreground mb-5">Estimasi penghematan biaya berdasarkan volume produksi pakan bulanan</p>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm">Volume ransum per bulan</label>
                <span className="font-mono text-primary">{fmtNum(vol)} ton</span>
              </div>
              <input
                type="range" min={100} max={10000} step={100}
                value={vol}
                onChange={e => setVol(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1 font-mono">
                <span>100</span><span>10.000</span>
              </div>
            </div>

            <div>
              <label className="text-sm">Pilih substitusi</label>
              <select
                value={pairIdx}
                onChange={e => setPairIdx(Number(e.target.value))}
                className="w-full mt-2 bg-surface border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {subPairs.map((s,i) => <option key={i} value={i}>{s.label} (hemat {s.hematPct}%)</option>)}
              </select>
            </div>

            <div className="ft-card p-4 bg-surface space-y-2 text-sm">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Detail Substitusi</div>
              <div className="flex justify-between"><span className="text-muted-foreground">Dari</span><span>{pair.from}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Ke</span><span className="text-primary">{pair.to}</span></div>
              <div className="flex justify-between font-mono"><span className="text-muted-foreground">Harga ref</span><span>{fmtRp(pair.refHarga)}/kg</span></div>
              <div className="flex justify-between font-mono"><span className="text-muted-foreground">Harga substitusi</span><span>{fmtRp(pair.subHarga)}/kg</span></div>
            </div>
          </div>

          <div className="space-y-3">
            <Row label="Biaya saat ini (per bulan)" value={fmtRp(calc.biayaSekarang)} />
            <Row label="Biaya setelah substitusi"  value={fmtRp(calc.biayaSetelah)} accent="text-foreground" />

            <div className="ft-card p-5 border-success/40 bg-success/5">
              <div className="text-xs uppercase tracking-wider text-success">Penghematan / bulan</div>
              <div className="text-3xl font-mono font-semibold text-success mt-1">{fmtRp(calc.hematBulan)}</div>
            </div>

            <div className="ft-card p-6 border-success/60 bg-gradient-to-br from-success/15 to-primary/5">
              <div className="text-xs uppercase tracking-wider text-success">Penghematan / tahun</div>
              <div className="text-4xl font-mono font-bold text-success mt-1">{fmtRp(calc.hematTahun)}</div>
              <div className="text-xs text-muted-foreground mt-2">Asumsi volume & harga konstan 12 bulan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="ft-card p-4 flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-mono text-lg ${accent ?? "text-foreground"}`}>{value}</span>
    </div>
  );
}
