import { useMemo, useState } from "react";
import {
  AlertTriangle, TrendingUp, TrendingDown, ArrowRight, Lightbulb,
  Flame, CloudRain, Globe2, Landmark, LineChart as LineIcon, Layers,
  ChevronRight, Info,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { coreIngredients, macroSignals, PRICE_RISE_THRESHOLD, type CoreIngredient } from "@/data/context";
import { PRICE_TREND } from "@/data/forecast";
import { fmtRp, fmtPct } from "@/lib/format";
import TradingViewChart from "@/components/TradingViewChart";

// Pemetaan bahan utama -> simbol futures global di TradingView (acuan harga dunia)
const tvSymbolByKey: Record<string, { symbol: string; label: string } | undefined> = {
  sbm:           { symbol: "CBOT:ZM1!",  label: "CBOT Soybean Meal Futures (acuan global SBM)" },
  jagung:        { symbol: "CBOT:ZC1!",  label: "CBOT Corn Futures (acuan global Jagung)" },
  pkm:           { symbol: "FX_IDC:CPOUSD", label: "CPO (acuan turunan Bungkil Sawit)" },
  "minyak-ikan": { symbol: "NYMEX:CL1!", label: "Crude Oil (proxy biaya logistik & substitusi minyak)" },
};

const kategoriIcon: Record<string, typeof Globe2> = {
  Iklim: CloudRain,
  "Ekspor-Impor": Globe2,
  Kebijakan: Landmark,
  "Pasar Global": LineIcon,
};

const macroToneClass: Record<string, string> = {
  positif: "border-l-success bg-success/5",
  netral:  "border-l-muted-foreground bg-card",
  negatif: "border-l-warning bg-warning/5",
  kritis:  "border-l-danger bg-danger/5",
};
const macroDotClass: Record<string, string> = {
  positif: "bg-success", netral: "bg-muted-foreground",
  negatif: "bg-warning", kritis: "bg-danger",
};

function delta(c: CoreIngredient) {
  return (c.hargaSekarang - c.hargaSebelum) / c.hargaSebelum;
}

// Map core key -> price-trend series name (jika ada)
const trendSeriesByKey: Record<string, string | undefined> = {
  jagung: "Jagung",
  sbm: "Bungkil Kedelai",
  "tepung-ikan": "Tepung Ikan Imp",
  "minyak-ikan": "Minyak Ikan",
  pkm: "Bungkil Sawit",
};

export default function Dashboard() {
  const [activeKey, setActiveKey] = useState<string>("sbm");

  const ranked = useMemo(
    () => [...coreIngredients].sort((a, b) => delta(b) - delta(a)),
    []
  );

  const active = coreIngredients.find(c => c.key === activeKey)!;
  const activeDelta = delta(active);
  const triggerSubs = activeDelta >= PRICE_RISE_THRESHOLD;

  // KPI summary
  const naik = ranked.filter(c => delta(c) > 0).length;
  const kritis = ranked.filter(c => delta(c) >= 0.10).length;
  const avgKenaikan = ranked.reduce((s, c) => s + delta(c), 0) / ranked.length;

  const trendName = trendSeriesByKey[activeKey];
  const trendData = trendName
    ? PRICE_TREND.months.map((m, i) => ({
        bulan: m,
        harga: PRICE_TREND.series.find(s => s.name === trendName)!.data[i],
      }))
    : null;

  const relevantMacros = macroSignals.filter(m => m.dampak.includes(activeKey));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard Bahan Utama</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pantauan harga, substitusi otomatis & konteks musim · April 2026
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="ft-badge bg-card border-border text-muted-foreground">
            {ranked.length} bahan utama dipantau
          </span>
          <span className="ft-badge bg-warning/15 border-warning/30 text-warning">
            {naik} bahan naik
          </span>
          {kritis > 0 && (
            <span className="ft-badge bg-danger/15 border-danger/30 text-danger">
              {kritis} kenaikan ≥10%
            </span>
          )}
          <span className="ft-badge bg-card border-border text-muted-foreground">
            Rata-rata: {fmtPct(avgKenaikan * 100)}
          </span>
        </div>
      </div>

      {/* Index Bahan Utama — kartu klik */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Indeks Bahan Utama</h2>
          <span className="text-xs text-muted-foreground">
            · klik untuk lihat substitusi & konteks pasar
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ranked.map(c => {
            const d = delta(c);
            const isUp = d > 0;
            const isCrit = d >= PRICE_RISE_THRESHOLD;
            const isActive = c.key === activeKey;
            return (
              <button
                key={c.key}
                onClick={() => setActiveKey(c.key)}
                className={`text-left ft-card p-4 transition-all ${
                  isActive
                    ? "ring-2 ring-primary border-primary/40 bg-primary/5"
                    : "hover:border-primary/30 hover:bg-card-hover"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground truncate">
                    {c.kategori}
                  </span>
                  {isCrit && <AlertTriangle className="h-3.5 w-3.5 text-danger shrink-0" />}
                </div>
                <div className="font-semibold text-sm mt-1 truncate">{c.nama}</div>
                <div className="font-mono text-lg mt-1">{fmtRp(c.hargaSekarang)}</div>
                <div className={`text-xs mt-1 flex items-center gap-1 ${
                  isUp ? (isCrit ? "text-danger" : "text-warning") : "text-success"
                }`}>
                  {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {fmtPct(d * 100)} sejak Okt
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Detail bahan terpilih */}
      <section className="grid lg:grid-cols-3 gap-4">
        {/* Kiri: detail + trend */}
        <div className="lg:col-span-2 ft-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {active.kategori} · {active.asal}
                {active.importShare > 0 && ` · ${active.importShare}% impor`}
              </div>
              <h3 className="text-xl font-semibold mt-0.5">{active.nama}</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{active.ringkas}</p>
            </div>
            <div className="text-right">
              <div className="font-mono text-2xl text-primary">{fmtRp(active.hargaSekarang)}/{active.satuan}</div>
              <div className={`text-sm mt-0.5 ${activeDelta > 0 ? "text-warning" : "text-success"}`}>
                {fmtPct(activeDelta * 100)} vs Okt 2025
              </div>
              <div className="text-xs text-muted-foreground mt-1">{active.porsiPakan}</div>
            </div>
          </div>

          {trendData ? (
            <div className="h-44 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 16, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="bulan" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))" fontSize={11}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number) => [fmtRp(v), "Harga"]}
                  />
                  <ReferenceLine y={active.hargaSebelum} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" label={{ value: "Okt'25", fontSize: 10, fill: "hsl(var(--muted-foreground))", position: "insideLeft" }} />
                  <Line type="monotone" dataKey="harga" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground italic py-4">Trend bulanan tidak tersedia untuk bahan ini.</div>
          )}

          {tvSymbolByKey[activeKey] && (
            <div className="mt-5 pt-5 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <LineIcon className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-sm">Acuan Global Real-Time · TradingView</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {tvSymbolByKey[activeKey]!.label} — fluktuasi futures global biasanya memimpin harga lokal 2–6 minggu.
              </p>
              <TradingViewChart symbol={tvSymbolByKey[activeKey]!.symbol} height={380} />
            </div>
          )}
        </div>

        {/* Kanan: konteks makro relevan */}
        <div className="ft-card p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-primary" /> Konteks Pasar
          </h3>
          {relevantMacros.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada sinyal makro spesifik untuk bahan ini saat ini.</p>
          ) : (
            <div className="space-y-3">
              {relevantMacros.map(m => {
                const Icon = kategoriIcon[m.kategori] ?? Globe2;
                return (
                  <div key={m.judul} className={`border-l-2 pl-3 py-1 ${macroToneClass[m.status]}`}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">{m.kategori}</span>
                      <span className={`h-1.5 w-1.5 rounded-full ${macroDotClass[m.status]}`} />
                    </div>
                    <div className="font-medium text-sm mt-0.5">{m.judul}</div>
                    <p className="text-xs text-muted-foreground mt-1">{m.detail}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* SUBSTITUSI — muncul kalau harga naik signifikan */}
      <section className="ft-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            {triggerSubs ? (
              <Flame className="h-5 w-5 text-danger" />
            ) : (
              <Lightbulb className="h-5 w-5 text-warning" />
            )}
            <h3 className="font-semibold">
              {triggerSubs ? "Substitusi Direkomendasikan" : "Opsi Substitusi"}
            </h3>
          </div>
          {triggerSubs && (
            <span className="ft-badge bg-danger/15 border-danger/30 text-danger text-xs">
              ⚠ {active.nama} naik {fmtPct(activeDelta * 100)} — pertimbangkan substitusi sekarang
            </span>
          )}
          {!triggerSubs && (
            <span className="ft-badge bg-card border-border text-muted-foreground text-xs">
              Harga masih dalam ambang aman (&lt; {(PRICE_RISE_THRESHOLD * 100).toFixed(0)}% kenaikan)
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {active.substitusi.map(s => {
            const positifHemat = s.hematPerKg > 0;
            return (
              <div key={s.nama} className="ft-card ft-card-hover p-4 border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{active.nama.split("(")[0].trim()}</span>
                  <ArrowRight className="h-3 w-3 shrink-0" />
                </div>
                <div className="font-semibold mt-1">{s.nama}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Rasio: {s.rasio}</div>

                <div className={`mt-3 font-mono text-sm ${positifHemat ? "text-success" : "text-muted-foreground"}`}>
                  {positifHemat ? "Hemat" : s.hematPerKg < 0 ? "Premium" : "Setara"}: {fmtRp(Math.abs(s.hematPerKg))}/kg pakan
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{s.catatanNutrisi}</p>
                {s.kompensasi && (
                  <div className="mt-2 text-xs flex items-start gap-1 text-warning">
                    <ChevronRight className="h-3 w-3 mt-0.5 shrink-0" />
                    <span>{s.kompensasi}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Sinyal Makro Global */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Globe2 className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Sinyal Pasar & Iklim</h2>
          <span className="text-xs text-muted-foreground">· El Niño/La Niña, ekspor-impor, kebijakan</span>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {macroSignals.map(m => {
            const Icon = kategoriIcon[m.kategori] ?? Globe2;
            return (
              <div key={m.judul} className={`ft-card p-4 border-l-4 ${macroToneClass[m.status]}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{m.kategori}</span>
                  <span className={`ml-auto h-2 w-2 rounded-full ${macroDotClass[m.status]} animate-pulse`} />
                </div>
                <div className="font-semibold text-sm">{m.judul}</div>
                <p className="text-sm text-muted-foreground mt-1">{m.ringkas}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {m.dampak.map(k => {
                    const c = coreIngredients.find(i => i.key === k);
                    if (!c) return null;
                    return (
                      <button
                        key={k}
                        onClick={() => setActiveKey(k)}
                        className="ft-badge text-[10px] bg-card border-border text-muted-foreground hover:text-primary hover:border-primary/40"
                      >
                        {c.nama.split("(")[0].trim()}
                      </button>
                    );
                  })}
                </div>
                {m.sumber && (
                  <div className="text-[10px] text-muted-foreground mt-2 italic">{m.sumber}</div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
