import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { ingredients } from "@/data/ingredients";
import { fmtRp } from "@/lib/format";
import { toast } from "sonner";
import { Upload, CheckCircle2, XCircle, Eye, FileText } from "lucide-react";
import type { Offer, OfferStatus } from "@/data/forecast";

const statusColor: Record<OfferStatus, string> = {
  "Disetujui":       "bg-success/15 text-success border-success/30",
  "Menunggu Review": "bg-warning/15 text-warning border-warning/30",
  "Negosiasi":       "bg-primary/15 text-primary border-primary/30",
  "Ditolak":         "bg-danger/15  text-danger  border-danger/30",
};

const SEGMEN_OPTS = ["Poultry","Ruminansia","Aquaculture"];

export default function Penawaran() {
  const { offers, addOffer, updateOffer } = useApp();

  const [form, setForm] = useState({
    supplier: "", bahanId: "", segmen: [] as string[], volume: "", harga: "",
    protein: "", lokasi: "", from: "", to: "", periode: "Spot",
    moq: "", moqUnit: "Ton", catatan: "",
  });

  const selectedBahan = useMemo(() => ingredients.find(i => i.id === Number(form.bahanId)) || null, [form.bahanId]);
  const refHarga = selectedBahan?.harga || 0;
  const hargaNum = Number(form.harga) || 0;
  const selisih = hargaNum && refHarga ? hargaNum - refHarga : 0;
  const selisihPct = refHarga ? (selisih / refHarga) * 100 : 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.supplier || !selectedBahan || !form.volume || !form.harga) {
      toast.error("Lengkapi field wajib"); return;
    }
    const newOffer: Omit<Offer,"id"> = {
      nama: selectedBahan.nama,
      supplier: form.supplier,
      volume: Number(form.volume),
      satuan: "Ton",
      harga: hargaNum,
      ref: refHarga,
      lokasi: form.lokasi || "—",
      periode: form.periode,
      window: form.from && form.to ? `${form.from} → ${form.to}` : "—",
      status: "Menunggu Review",
      segmen: form.segmen,
      protein: Number(form.protein) || undefined,
      catatan: form.catatan,
    };
    addOffer(newOffer);
    toast.success("Penawaran berhasil dikirim!");
    setForm({ supplier:"", bahanId:"", segmen:[], volume:"", harga:"", protein:"", lokasi:"", from:"", to:"", periode:"Spot", moq:"", moqUnit:"Ton", catatan:"" });
  };

  const stats = useMemo(() => ({
    total:    offers.length,
    menunggu: offers.filter(o => o.status === "Menunggu Review").length,
    setuju:   offers.filter(o => o.status === "Disetujui").length,
    nego:     offers.filter(o => o.status === "Negosiasi").length,
  }), [offers]);

  const toggleSegmen = (s: string) =>
    setForm(f => ({ ...f, segmen: f.segmen.includes(s) ? f.segmen.filter(x=>x!==s) : [...f.segmen, s] }));

  const inp = "w-full bg-surface border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Manajemen Penawaran</h1>
        <p className="text-sm text-muted-foreground mt-1">Kelola penawaran pemasok dengan perbandingan harga referensi otomatis</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* FORM */}
        <form onSubmit={submit} className="ft-card p-5 space-y-4 h-fit">
          <h2 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Buat Penawaran Baru</h2>

          <div>
            <label className="text-xs text-muted-foreground">Nama Pemasok *</label>
            <input className={inp} value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})} placeholder="PT / CV / UD …" />
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Bahan Baku *</label>
            <select className={inp} value={form.bahanId} onChange={e => setForm({...form, bahanId: e.target.value})}>
              <option value="">— Pilih bahan baku —</option>
              {ingredients.map(i => <option key={i.id} value={i.id}>{i.nama}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Segmen Tujuan</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {SEGMEN_OPTS.map(s => (
                <label key={s} className={`ft-badge cursor-pointer transition-colors ${form.segmen.includes(s) ? "bg-primary/15 text-primary border-primary/30" : "bg-secondary border-border text-muted-foreground"}`}>
                  <input type="checkbox" className="hidden" checked={form.segmen.includes(s)} onChange={() => toggleSegmen(s)} />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Volume (Ton) *</label>
              <input type="number" className={inp} value={form.volume} onChange={e => setForm({...form, volume: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Harga (Rp/kg) *</label>
              <input type="number" className={inp} value={form.harga} onChange={e => setForm({...form, harga: e.target.value})} />
            </div>
          </div>

          {hargaNum > 0 && refHarga > 0 && (
            <div className={`ft-card p-3 border ${selisih <= 0 ? "border-success/40" : "border-danger/40"}`}>
              <div className="text-xs text-muted-foreground">Harga Ref April 2026: <span className="font-mono">{fmtRp(refHarga)}/kg</span></div>
              <div className={`text-sm font-mono mt-1 ${selisih <= 0 ? "text-success" : "text-danger"}`}>
                Selisih: {selisih >= 0 ? "+" : ""}{fmtRp(selisih)} ({selisih >= 0 ? "+" : ""}{selisihPct.toFixed(1)}%)
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Kadar Protein (%)</label>
              <input type="number" className={inp} value={form.protein} onChange={e => setForm({...form, protein: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Lokasi Asal</label>
              <input className={inp} value={form.lokasi} onChange={e => setForm({...form, lokasi: e.target.value})} placeholder="Jatim, Kaltim, …" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Tersedia Dari</label>
              <input type="date" className={inp} value={form.from} onChange={e => setForm({...form, from: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Sampai</label>
              <input type="date" className={inp} value={form.to} onChange={e => setForm({...form, to: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Periode Kontrak</label>
              <select className={inp} value={form.periode} onChange={e => setForm({...form, periode: e.target.value})}>
                {["Spot","1 bulan","3 bulan","6 bulan","1 tahun"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Min. Order</label>
              <div className="flex gap-2">
                <input type="number" className={inp} value={form.moq} onChange={e => setForm({...form, moq: e.target.value})} />
                <select className={inp + " w-28"} value={form.moqUnit} onChange={e => setForm({...form, moqUnit: e.target.value})}>
                  {["Ton","Karung","Liter"].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Catatan Tambahan</label>
            <textarea rows={2} className={inp} value={form.catatan} onChange={e => setForm({...form, catatan: e.target.value})} />
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Upload Dokumen</label>
            <label className="mt-1 flex items-center gap-2 px-3 py-2 bg-secondary/40 border border-dashed border-border rounded-md text-sm text-muted-foreground cursor-pointer hover:bg-secondary">
              <Upload className="h-4 w-4" /> Pilih file (PDF, XLSX)
              <input type="file" className="hidden" />
            </label>
          </div>

          <button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-md py-2.5 font-medium text-sm">
            Kirim Penawaran
          </button>
        </form>

        {/* OFFER LIST */}
        <div className="space-y-4">
          <div className="ft-card p-4 grid grid-cols-4 gap-2 text-center">
            <Stat label="Total" value={stats.total} color="text-foreground" />
            <Stat label="Menunggu" value={stats.menunggu} color="text-warning" />
            <Stat label="Disetujui" value={stats.setuju} color="text-success" />
            <Stat label="Negosiasi" value={stats.nego} color="text-primary" />
          </div>

          <div className="space-y-3 max-h-[1000px] overflow-y-auto scroll-thin pr-1">
            {offers.map(o => {
              const diff = o.harga - o.ref;
              const diffPct = o.ref ? (diff / o.ref) * 100 : 0;
              return (
                <div key={o.id} className="ft-card p-4 ft-card-hover">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{o.nama}</div>
                      <div className="text-xs text-muted-foreground">{o.supplier} · {o.lokasi}</div>
                    </div>
                    <span className={`ft-badge ${statusColor[o.status]}`}>{o.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Volume</div>
                      <div className="font-mono">{o.volume.toLocaleString("id-ID")} {o.satuan}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Harga</div>
                      <div className="font-mono">{fmtRp(o.harga)}/kg</div>
                      <div className={`text-[11px] font-mono ${diff <= 0 ? "text-success" : "text-danger"}`}>
                        {diff >= 0 ? "+" : ""}{diffPct.toFixed(1)}% vs ref
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Periode</div>
                      <div className="text-xs">{o.periode}</div>
                      <div className="text-[11px] text-muted-foreground">{o.window}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                    <button onClick={() => toast(`Detail: ${o.nama}`, { description: `${o.supplier} · ${fmtRp(o.harga)}/kg` })}
                      className="text-xs px-3 py-1.5 rounded-md bg-secondary hover:bg-card-hover inline-flex items-center gap-1"><Eye className="h-3 w-3" /> Detail</button>
                    <button onClick={() => { updateOffer(o.id, { status: "Disetujui" }); toast.success("Penawaran disetujui"); }}
                      className="text-xs px-3 py-1.5 rounded-md bg-success/15 text-success hover:bg-success/25 inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Setujui</button>
                    <button onClick={() => { updateOffer(o.id, { status: "Ditolak" }); toast("Penawaran ditolak"); }}
                      className="text-xs px-3 py-1.5 rounded-md bg-danger/15 text-danger hover:bg-danger/25 inline-flex items-center gap-1"><XCircle className="h-3 w-3" /> Tolak</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className={`text-2xl font-mono font-semibold ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
}
