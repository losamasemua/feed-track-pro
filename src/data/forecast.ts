import type { Segmen } from "./ingredients";

export const MONTHS = ["Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des","Jan","Feb","Mar"] as const;

export interface ForecastRow {
  id: number;
  nama: string;
  segmen: Segmen[];
  values: number[]; // 12 months 1..5
  trend: string;
  rek: string;
}

export const forecastRows: ForecastRow[] = [
  { id:1,  nama:"Jagung",              segmen:["Poultry","Ruminansia","Aquaculture"], values:[4,5,4,3,3,3,3,3,3,3,3,5], trend:"↑ Mei; stabil", rek:"Gunakan SPHP Bulog Rp5.500. Beli bulk Apr-Mei panen raya" },
  { id:2,  nama:"Bungkil Kedelai",     segmen:["Poultry","Ruminansia","Aquaculture"], values:[4,4,4,4,3,3,4,4,3,4,4,4], trend:"→ Fluktuatif",  rek:"Kontrak 3 bulan rolling. Substitusi PKM+kopra 30-40%" },
  { id:3,  nama:"Tepung Ikan Lokal",   segmen:["Poultry","Aquaculture"],              values:[3,3,4,5,5,4,3,3,2,2,2,3], trend:"↑ Jun–Agt",    rek:"Stok 60-90 hari saat Jul-Agt. Jan-Mar sangat terbatas" },
  { id:4,  nama:"Tepung Ikan Impor",   segmen:["Poultry","Aquaculture","Ruminansia"], values:[2,2,3,4,5,4,3,2,2,2,2,3], trend:"↑ Jun–Agt",    rek:"Kontrak tahunan importir. Trial maggot BSF 5-10% Q3" },
  { id:5,  nama:"Dedak Padi",          segmen:["Poultry","Ruminansia","Aquaculture"], values:[5,4,3,3,3,3,5,4,3,3,3,5], trend:"↑ Apr & Okt",  rek:"Beli bulk post-panen Apr-Mei & Okt-Nov + BHT antioksidan" },
  { id:6,  nama:"Bungkil Sawit PKM",   segmen:["Poultry","Ruminansia","Aquaculture"], values:[5,5,5,5,5,5,5,5,5,5,5,5], trend:"→ Surplus",    rek:"Surplus nasional. Negosiasi langsung pabrik CPO Kaltim" },
  { id:7,  nama:"Minyak Sawit CPO",    segmen:["Poultry","Ruminansia","Aquaculture"], values:[4,5,5,5,4,4,3,3,4,4,4,4], trend:"↑ Mei–Jul",    rek:"Kontrak 3-6 bulan refinery. Kunci sebelum Jun" },
  { id:8,  nama:"CGM Corn Gluten",     segmen:["Poultry","Aquaculture"],              values:[3,3,4,4,3,3,3,3,3,3,3,4], trend:"→ Stabil",     rek:"Import rutin. Kontrak 3 bulan AS/China" },
  { id:9,  nama:"Maggot BSF",          segmen:["Poultry","Aquaculture","Ruminansia"], values:[2,2,2,3,3,3,3,3,3,2,2,2], trend:"↑ Skala naik", rek:"Kerjasama 2-3 farm BSF lokal. Target substitusi FM 5-10% Q4" },
  { id:10, nama:"Rumput Gajah",        segmen:["Ruminansia"],                          values:[5,5,4,4,3,3,4,4,4,4,4,5], trend:"→ Musim hujan", rek:"Kontrak petani HMT sekitar pabrik" },
  { id:11, nama:"Jerami Padi",         segmen:["Ruminansia"],                          values:[2,2,5,4,3,2,3,3,2,5,3,2], trend:"↑ Mei & Nov",  rek:"Kumpulkan saat panen. Treatment urea 3% in situ" },
  { id:12, nama:"Molases",             segmen:["Ruminansia","Poultry"],                values:[3,3,4,5,5,5,5,4,4,3,3,3], trend:"↑ Jul–Okt",    rek:"Kontrak PG Jatim sebelum giling dimulai Jun" },
  { id:13, nama:"Indigofera",          segmen:["Ruminansia"],                          values:[4,5,5,5,4,4,4,5,5,5,4,4], trend:"→ Berkembang",  rek:"Kembangkan lahan HMT 0.5-1 ha per 100 ton produksi" },
  { id:14, nama:"Hay Alfalfa",         segmen:["Ruminansia"],                          values:[2,2,2,2,2,2,2,2,2,2,2,2], trend:"→ Terbatas",   rek:"Substitusi gamal+indigofera lokal hemat 60-70%" },
  { id:15, nama:"Minyak Ikan",         segmen:["Aquaculture"],                          values:[2,2,3,4,5,4,3,2,2,2,2,3], trend:"↑ Jun–Agt",    rek:"KRITIS: Rp38.000/kg. Blend CPO+flaxseed 60-70%" },
  { id:16, nama:"Tepung Udang",        segmen:["Aquaculture","Poultry"],              values:[2,3,4,4,3,3,2,2,2,2,2,2], trend:"↑ Mei–Jul",    rek:"Kontrak pabrik udang Jatim/Lampung. Stok 30-45 hari" },
  { id:17, nama:"Tapioka/Singkong",    segmen:["Poultry","Ruminansia","Aquaculture"], values:[4,5,5,4,4,4,3,3,4,4,4,5], trend:"↑ Apr–Jun",    rek:"Beli bulk panen ubi Apr-Jun. Lokal Lampung/Jatim melimpah" },
  { id:18, nama:"Ampas Tahu kering",   segmen:["Ruminansia","Aquaculture"],            values:[4,4,4,4,4,4,4,4,4,4,4,4], trend:"→ Stabil",     rek:"Tersedia sepanjang tahun Rp1.800/kg. Standarisasi nutrisi" },
  { id:19, nama:"DL-Metionin",         segmen:["Poultry","Aquaculture"],              values:[3,3,3,3,3,3,3,3,3,3,3,3], trend:"→ Stabil",     rek:"Kontrak 6 bulan Evonik/Adisseo. Multi-supplier" },
  { id:20, nama:"L-Lisin HCl",         segmen:["Poultry","Aquaculture"],              values:[3,3,3,3,3,3,3,3,3,3,3,3], trend:"→ Stabil",     rek:"CJ Indonesia beroperasi. Negosiasi langsung pabrik lokal" },
];

export const PRICE_TREND = {
  months: ["Okt'25","Nov'25","Des'25","Jan'26","Feb'26","Mar'26","Apr'26"],
  series: [
    { name: "Jagung",          color: "hsl(var(--primary))", data: [5800,6000,6300,6500,6400,6300,6200] },
    { name: "Bungkil Kedelai", color: "hsl(var(--warning))", data: [8700,8800,9000,9200,9300,9400,9500] },
    { name: "Tepung Ikan Imp", color: "hsl(var(--danger))",  data: [14200,14500,14800,15200,15500,15800,16000] },
    { name: "Minyak Ikan",     color: "hsl(var(--purple))",  data: [33000,34500,36000,37500,38500,39200,40000] },
    { name: "Bungkil Sawit",   color: "hsl(var(--success))", data: [1750,1800,1850,1900,1950,1980,2000] },
  ],
};

export interface VolatilityRow {
  nama: string;
  okt: number; apr: number;
  perubahan: string;
  volatilitas: "RENDAH"|"SEDANG"|"TINGGI"|"SANGAT TINGGI";
  risiko: string;
  waktu: string;
  buffer: string;
}

export const volatility: VolatilityRow[] = [
  { nama:"Jagung Pipil",       okt:5800,  apr:6200,  perubahan:"+6.9% (puncak Jan 6.500)", volatilitas:"TINGGI",        risiko:"Sedang",        waktu:"Apr–Mei (panen)", buffer:"30 hari" },
  { nama:"Bungkil Kedelai",    okt:8700,  apr:9500,  perubahan:"+9.2%",  volatilitas:"SEDANG",        risiko:"Sedang",        waktu:"Kontrak 3 bulan", buffer:"21 hari" },
  { nama:"Tepung Ikan Lokal",  okt:10800, apr:11500, perubahan:"+6.5%",  volatilitas:"SEDANG",        risiko:"Sedang",        waktu:"Jun–Agt",         buffer:"45 hari" },
  { nama:"Tepung Ikan Impor",  okt:14200, apr:16000, perubahan:"+12.7%", volatilitas:"TINGGI",        risiko:"Tinggi",        waktu:"Jun–Agt",         buffer:"60 hari" },
  { nama:"Dedak Padi",         okt:2800,  apr:3000,  perubahan:"+7.1%",  volatilitas:"SEDANG",        risiko:"Rendah",        waktu:"Apr–Mei & Okt",   buffer:"14 hari" },
  { nama:"Bungkil Sawit PKM",  okt:1750,  apr:2000,  perubahan:"+14.3%", volatilitas:"RENDAH",        risiko:"Sangat Rendah", waktu:"Kapan saja",      buffer:"7 hari" },
  { nama:"Minyak Sawit CPO",   okt:12500, apr:14500, perubahan:"+16.0%", volatilitas:"SEDANG",        risiko:"Sedang",        waktu:"Mar–Mei",         buffer:"21 hari" },
  { nama:"CGM Corn Gluten",    okt:8400,  apr:9000,  perubahan:"+7.1%",  volatilitas:"SEDANG",        risiko:"Sedang",        waktu:"Kontrak 3 bulan", buffer:"30 hari" },
  { nama:"DDGS Jagung",        okt:5700,  apr:6100,  perubahan:"+7.0%",  volatilitas:"SEDANG",        risiko:"Sedang",        waktu:"Stabil",          buffer:"21 hari" },
  { nama:"Minyak Ikan",        okt:33000, apr:40000, perubahan:"+21.2%", volatilitas:"SANGAT TINGGI", risiko:"Sangat Tinggi", waktu:"Jun–Agt",         buffer:"60 hari" },
  { nama:"Molases",            okt:2200,  apr:2450,  perubahan:"+11.4%", volatilitas:"SEDANG",        risiko:"Rendah",        waktu:"Jun–Jul giling",  buffer:"21 hari" },
  { nama:"DL-Metionin",        okt:50000, apr:54000, perubahan:"+8.0%",  volatilitas:"SEDANG",        risiko:"Sedang",        waktu:"Kontrak 6 bulan", buffer:"30 hari" },
  { nama:"L-Lisin HCl",        okt:40000, apr:44000, perubahan:"+10.0%", volatilitas:"SEDANG",        risiko:"Rendah",        waktu:"Kontrak 3 bulan", buffer:"30 hari" },
  { nama:"Tepung Maggot BSF",  okt:11000, apr:13000, perubahan:"+18.2%", volatilitas:"SEDANG",        risiko:"Rendah",        waktu:"Kontrak farm BSF",buffer:"14 hari" },
  { nama:"Bungkil Kopra",      okt:2500,  apr:2800,  perubahan:"+12.0%", volatilitas:"RENDAH",        risiko:"Rendah",        waktu:"Kapan saja",      buffer:"14 hari" },
];

export interface SubPair { label: string; from: string; to: string; hematPct: number; refHarga: number; subHarga: number; }

// hematPct = % saving on cost of substituted volume
export const subPairs: SubPair[] = [
  { label:"SBM → PKM+Kopra blend",            from:"Bungkil Kedelai 48% (SBM)", to:"PKM+Kopra (blend 50:50)", hematPct:52, refHarga:9000,  subHarga:4320 },
  { label:"Tepung Ikan Impor → FM Lokal+MBM", from:"Tepung Ikan Impor",         to:"FM Lokal + MBM (blend)",  hematPct:35, refHarga:15500, subHarga:10075 },
  { label:"Jagung → Sorghum+Singkong",        from:"Jagung Pipil",              to:"Sorghum + Ubi Kayu",      hematPct:20, refHarga:5800,  subHarga:4640 },
  { label:"Hay Alfalfa → Indigofera+Gamal",   from:"Hay Alfalfa Impor",         to:"Indigofera + Gamal",      hematPct:70, refHarga:7000,  subHarga:2100 },
  { label:"Minyak Ikan → CPO+Flaxseed",       from:"Minyak Ikan",               to:"CPO + Flaxseed Oil",      hematPct:47, refHarga:38000, subHarga:20140 },
  { label:"DCP → Tepung Tulang+Fitase",       from:"Dikalsium Fosfat (DCP)",    to:"Tepung Tulang + Fitase",  hematPct:28, refHarga:9500,  subHarga:6840 },
];

export const initialOffers = [
  { id:1, nama:"Jagung Pipil",         supplier:"PT Sumber Tani Makmur",  volume:500,  satuan:"Ton", harga:5500,  ref:5800,  lokasi:"Jatim",    periode:"Spot",     window:"Apr-Mei", status:"Menunggu Review" as const },
  { id:2, nama:"Bungkil Sawit PKM",    supplier:"CV Kalimantan Agro",     volume:1000, satuan:"Ton", harga:1850,  ref:1900,  lokasi:"Kaltim",   periode:"3 bulan",  window:"Apr-Jun", status:"Disetujui" as const },
  { id:3, nama:"Tepung Ikan 62%",      supplier:"UD Nelayan Jaya",        volume:50,   satuan:"Ton", harga:10800, ref:11000, lokasi:"Jatim",    periode:"Spot",     window:"Jun-Agt", status:"Menunggu Review" as const },
  { id:4, nama:"Dedak Padi",           supplier:"Penggilingan Padi Surya",volume:200,  satuan:"Ton", harga:2800,  ref:2900,  lokasi:"Jateng",   periode:"1 bulan",  window:"Stabil",  status:"Disetujui" as const },
  { id:5, nama:"Molases",              supplier:"PG Candi Sidoarjo",      volume:300,  satuan:"Ton", harga:2200,  ref:2300,  lokasi:"Sidoarjo", periode:"6 bulan",  window:"Jun-Nov", status:"Negosiasi" as const },
  { id:6, nama:"Bungkil Kopra",        supplier:"CV Sulawesi Mandiri",    volume:150,  satuan:"Ton", harga:2500,  ref:2600,  lokasi:"Sulsel",   periode:"3 bulan",  window:"Stabil",  status:"Disetujui" as const },
  { id:7, nama:"Minyak Ikan Lokal",    supplier:"PT Perikanan Nusantara", volume:20,   satuan:"Ton", harga:34000, ref:38000, lokasi:"Bali",     periode:"Spot",     window:"Jul-Agt", status:"Menunggu Review" as const },
  { id:8, nama:"Onggok Singkong",      supplier:"UD Tapioka Lampung",     volume:800,  satuan:"Ton", harga:750,   ref:800,   lokasi:"Lampung",  periode:"6 bulan",  window:"Stabil",  status:"Disetujui" as const },
];

export type OfferStatus = "Menunggu Review" | "Disetujui" | "Negosiasi" | "Ditolak";
export interface Offer {
  id: number; nama: string; supplier: string; volume: number; satuan: string;
  harga: number; ref: number; lokasi: string; periode: string; window: string;
  status: OfferStatus; segmen?: string[]; protein?: number; catatan?: string;
}
