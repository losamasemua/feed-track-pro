import { Database, AlertTriangle, TrendingUp, CheckCircle2, Lightbulb, Flame, Leaf } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { MONTHS } from "@/data/forecast";

const supplyData = MONTHS.map((m, i) => ({
  bulan: m,
  Jagung:          [4,5,4,3,3,3,3,3,3,3,3,5][i],
  "Bungkil Kedelai":[4,4,4,4,3,3,4,4,3,4,4,4][i],
  "Tepung Ikan":   [3,3,4,5,5,4,3,3,2,2,2,3][i],
  "Bungkil Sawit": [5,5,5,5,5,5,5,5,5,5,5,5][i],
}));

const kpis = [
  { label: "Total Bahan Baku",       value: "80",     unit: "Item", Icon: Database,       color: "primary" },
  { label: "Bahan Baku Kritis",      value: "3",      unit: "Item", Icon: AlertTriangle,  color: "danger"  },
  { label: "Harga Rata-rata Naik",   value: "+8.4%",  unit: "vs 6 bln lalu", Icon: TrendingUp, color: "warning" },
  { label: "Surplus Lokal",          value: "5",      unit: "Item", Icon: CheckCircle2,   color: "success" },
];

const colorMap: Record<string, string> = {
  primary: "bg-primary/15 text-primary border-primary/30",
  danger:  "bg-danger/15  text-danger  border-danger/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  success: "bg-success/15 text-success border-success/30",
};

const valueColor: Record<string,string> = {
  primary: "text-primary", danger: "text-danger", warning: "text-warning", success: "text-success",
};

const alerts = [
  { tone: "danger",  title: "Tepung Ikan Impor", body: "Rp 15.500/kg · Naik 10.7% · Stok 60 hari", action: "Window beli: Jun–Agt 2026" },
  { tone: "warning", title: "Jagung (spot market)", body: "Rp 5.800/kg · HPP Bulog Rp 5.500 · Inpres 3/2026", action: "Manfaatkan SPHP sekarang" },
  { tone: "danger",  title: "Minyak Ikan", body: "Rp 38.000/kg · Naik 18.8% YoY · Kritis Aqua", action: "Substitusi CPO+Flaxseed 60-70%" },
];

const recs = [
  "Substitusi PKM 10-15%: hemat Rp 400-800/kg pakan",
  "Gunakan SPHP Bulog jagung Rp 5.500 (vs pasar Rp 5.800)",
  "Maggot BSF trial Q3 2026: substitusi FM 5-10%",
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard Operasional</h1>
        <p className="text-sm text-muted-foreground mt-1">Ringkasan ketersediaan, harga & rekomendasi pengadaan — April 2026</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="ft-card p-5 flex items-start gap-4">
            <div className={`ft-kpi-icon border ${colorMap[k.color]}`}>
              <k.Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</div>
              <div className={`text-2xl font-mono font-semibold mt-1 ${valueColor[k.color]}`}>{k.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{k.unit}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="ft-card p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <div>
            <h2 className="font-semibold">Indeks Ketersediaan per Bulan</h2>
            <p className="text-xs text-muted-foreground">Apr 2026 s/d Mar 2027 · Index 1=Kritis, 3=Normal, 5=Surplus</p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={supplyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="bulan" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis domain={[0,5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                cursor={{ fill: "hsl(var(--card-hover))" }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="Jagung"           fill="hsl(var(--primary))" radius={[3,3,0,0]} />
              <Bar dataKey="Bungkil Kedelai"  fill="hsl(var(--warning))" radius={[3,3,0,0]} />
              <Bar dataKey="Tepung Ikan"      fill="hsl(var(--danger))"  radius={[3,3,0,0]} />
              <Bar dataKey="Bungkil Sawit"    fill="hsl(var(--success))" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h2 className="font-semibold mb-3 flex items-center gap-2"><Flame className="h-4 w-4 text-danger" /> Alert Kritis</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {alerts.map((a, i) => {
            const isDanger = a.tone === "danger";
            return (
              <div key={i} className={`ft-card p-4 border-l-4 ${isDanger ? "border-l-danger" : "border-l-warning"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`h-2 w-2 rounded-full ${isDanger ? "bg-danger" : "bg-warning"} animate-pulse`} />
                  <span className="font-medium">{a.title}</span>
                </div>
                <p className="text-sm text-muted-foreground font-mono">{a.body}</p>
                <p className="text-xs mt-2 text-foreground/80">→ {a.action}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="font-semibold mb-3 flex items-center gap-2"><Leaf className="h-4 w-4 text-success" /> Rekomendasi Strategis</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {recs.map((r,i) => (
            <div key={i} className="ft-card ft-card-hover p-4 flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm">{r}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
