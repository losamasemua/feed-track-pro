// Konteks makro: bahan utama, substitusi, musim, ekspor-impor, kebijakan
// Data per April 2026 — disusun dari riset publik (BMKG, NOAA, Kementan, BPS, AFI, GAPMMI)

export interface CoreIngredient {
  key: string;
  nama: string;
  kategori: "Energi" | "Protein Nabati" | "Protein Hewani" | "Lemak" | "By-Product";
  hargaSekarang: number;
  hargaSebelum: number; // 6 bulan lalu / Okt 2025
  satuan: string;
  porsiPakan: string; // tipikal % dalam ransum unggas/sapi
  asal: "Lokal" | "Impor" | "Lokal+Impor";
  importShare: number; // % impor dari kebutuhan nasional
  ringkas: string;
  substitusi: SubstitutionOption[];
}

export interface SubstitutionOption {
  nama: string;
  rasio: string; // berapa % bisa menggantikan bahan utama
  hematPerKg: number; // estimasi penghematan Rp/kg pakan jadi
  catatanNutrisi: string;
  kompensasi?: string; // perlu tambahan apa (mis. lisin sintetis)
}

// Bahan utama yang menyumbang >70% biaya pakan di Indonesia
export const coreIngredients: CoreIngredient[] = [
  {
    key: "jagung",
    nama: "Jagung Pipil",
    kategori: "Energi",
    hargaSekarang: 6200,
    hargaSebelum: 5800,
    satuan: "kg",
    porsiPakan: "45–55% pakan unggas",
    asal: "Lokal+Impor",
    importShare: 15,
    ringkas: "Sumber energi utama. Panen raya Mar–Mei meredam kenaikan, tapi El Niño residual menahan stok 2026.",
    substitusi: [
      { nama: "Sorghum (Cantel)", rasio: "hingga 30%", hematPerKg: 250, catatanNutrisi: "ME setara, tanin perlu varietas low-tanin", kompensasi: "Tambah lisin 0.05%" },
      { nama: "Onggok Singkong + CGM", rasio: "20% energi + protein", hematPerKg: 480, catatanNutrisi: "Onggok murah Rp850, CGM tutup defisit protein", kompensasi: "Suplementasi metionin & lisin" },
      { nama: "Ubi Kayu chips", rasio: "hingga 25%", hematPerKg: 380, catatanNutrisi: "ME 3.250 kcal — hampir setara jagung", kompensasi: "Awas HCN, jemur 3 hari" },
    ],
  },
  {
    key: "sbm",
    nama: "Bungkil Kedelai (SBM 48%)",
    kategori: "Protein Nabati",
    hargaSekarang: 9500,
    hargaSebelum: 8700,
    satuan: "kg",
    porsiPakan: "20–28% pakan broiler/layer",
    asal: "Impor",
    importShare: 95,
    ringkas: "95% impor (Brasil/AS). Rupiah melemah + kontrak CBOT naik membuat harga +9.2% sejak Okt 2025.",
    substitusi: [
      { nama: "PKM + Bungkil Kopra (50:50)", rasio: "10–15% blend", hematPerKg: 750, catatanNutrisi: "Hemat 50% di porsi yang disubstitusi", kompensasi: "Tambah lisin sintetik 0.10–0.15%" },
      { nama: "Tepung Maggot BSF", rasio: "hingga 10%", hematPerKg: 280, catatanNutrisi: "PK 42%, lisin tinggi, profil AA mendekati FM" },
      { nama: "DDGS Jagung", rasio: "hingga 15% layer", hematPerKg: 320, catatanNutrisi: "PK 26%, sumbang energi juga", kompensasi: "Tambah lisin, awas mikotoksin" },
    ],
  },
  {
    key: "mbm",
    nama: "Tepung Daging & Tulang (MBM)",
    kategori: "Protein Hewani",
    hargaSekarang: 9200,
    hargaSebelum: 8400,
    satuan: "kg",
    porsiPakan: "3–7% pakan broiler",
    asal: "Lokal",
    importShare: 25,
    ringkas: "Stabil dari rumah potong domestik. Larangan impor MBM dari negara FMD masih berlaku — pasokan dalam negeri aman.",
    substitusi: [
      { nama: "Tepung Bulu Hidrolisis + Lisin", rasio: "hingga 50% MBM", hematPerKg: 350, catatanNutrisi: "PK 80%, lisin & metionin rendah", kompensasi: "Wajib AA sintetik + maks 5% pakan" },
      { nama: "Tepung Maggot BSF", rasio: "1:1 substitusi", hematPerKg: 0, catatanNutrisi: "Profil mineral mirip, lebih ramah lingkungan", kompensasi: "Suplai lokal masih terbatas" },
      { nama: "Tepung Darah Spray-Dried", rasio: "hingga 30%", hematPerKg: -120, catatanNutrisi: "Lisin sangat tinggi (7.8%), palatabilitas rendah", kompensasi: "Maks 3-5% pakan" },
    ],
  },
  {
    key: "dedak",
    nama: "Dedak Padi (Katul)",
    kategori: "By-Product",
    hargaSekarang: 3000,
    hargaSebelum: 2800,
    satuan: "kg",
    porsiPakan: "10–20% pakan unggas, 25% sapi",
    asal: "Lokal",
    importShare: 0,
    ringkas: "100% lokal dari penggilingan padi. Harga naik 7% mengikuti gabah. Stok melimpah pasca panen Apr–Mei & Okt–Nov.",
    substitusi: [
      { nama: "Dedak Gandum (Pollard)", rasio: "1:1 substitusi", hematPerKg: -600, catatanNutrisi: "Pollard impor lebih mahal, PK lebih tinggi (16.5%)", kompensasi: "Tambah xylanase" },
      { nama: "Ampok / CGF Lokal", rasio: "hingga 50%", hematPerKg: 200, catatanNutrisi: "Energi setara, protein lebih tinggi", kompensasi: "—" },
      { nama: "Onggok + CPO 2%", rasio: "hingga 60%", hematPerKg: 450, catatanNutrisi: "Energi via CPO, onggok penyumbang serat", kompensasi: "Tambah PK lain (PKM/SBM)" },
    ],
  },
  {
    key: "tepung-ikan",
    nama: "Tepung Ikan Impor (65%)",
    kategori: "Protein Hewani",
    hargaSekarang: 16000,
    hargaSebelum: 14200,
    satuan: "kg",
    porsiPakan: "3–8% broiler, 25–35% udang",
    asal: "Impor",
    importShare: 70,
    ringkas: "KRITIS. El Niño 2024-25 hancurkan musim anchovy Peru — kuota fishmeal global turun 30%, harga +12.7% YoY.",
    substitusi: [
      { nama: "FM Lokal (Jatim/Babel) + MBM", rasio: "blend 60:40", hematPerKg: 1900, catatanNutrisi: "Hemat 36%, kualitas lebih bervariasi", kompensasi: "Uji histamin & TVN tiap batch" },
      { nama: "Tepung Maggot BSF", rasio: "hingga 50% FM", hematPerKg: 800, catatanNutrisi: "Lisin & metionin baik, suplai lokal scaling-up" },
      { nama: "SPC + Krill Hidrolisat", rasio: "untuk udang", hematPerKg: -200, catatanNutrisi: "Aquafeed premium, lebih mahal tapi tersedia" },
    ],
  },
  {
    key: "pkm",
    nama: "Bungkil Sawit (PKM)",
    kategori: "Protein Nabati",
    hargaSekarang: 2000,
    hargaSebelum: 1750,
    satuan: "kg",
    porsiPakan: "8–15% pakan ruminansia & layer",
    asal: "Lokal",
    importShare: 0,
    ringkas: "SURPLUS nasional. Ekspor PKM 2025 turun karena permintaan Eropa lesu — pasokan lokal sangat melimpah, ideal substitusi.",
    substitusi: [
      { nama: "HPKM (Hi-Pro Palm Kernel)", rasio: "1:1 upgrade", hematPerKg: -800, catatanNutrisi: "PK 24% (vs 17%), nutrisi lebih baik" },
      { nama: "Bungkil Kopra", rasio: "kombinasi 50:50", hematPerKg: -800, catatanNutrisi: "Profil AA komplementer dengan PKM" },
    ],
  },
  {
    key: "cpo",
    nama: "Minyak Sawit (CPO)",
    kategori: "Lemak",
    hargaSekarang: 14500,
    hargaSebelum: 12500,
    satuan: "kg",
    porsiPakan: "2–5% pakan broiler/layer",
    asal: "Lokal",
    importShare: 0,
    ringkas: "Naik 16% YoY karena B40 mandatori biodiesel + ekspor India kuat. DMO CPO bisa redam, tapi tetap tertekan.",
    substitusi: [
      { nama: "Crude Palm Olein", rasio: "1:1", hematPerKg: -500, catatanNutrisi: "ME lebih tinggi, mudah dicampur" },
      { nama: "Lemak Sapi (Tallow)", rasio: "hingga 50%", hematPerKg: 6000, catatanNutrisi: "SFA tinggi, granulasi pelet baik", kompensasi: "Antioksidan wajib" },
    ],
  },
  {
    key: "minyak-ikan",
    nama: "Minyak Ikan",
    kategori: "Lemak",
    hargaSekarang: 40000,
    hargaSebelum: 33000,
    satuan: "kg",
    porsiPakan: "1–3% aquafeed (esensial DHA/EPA)",
    asal: "Impor",
    importShare: 80,
    ringkas: "KRITIS. +21% YoY akibat El Niño Peru & moratorium IFFO. Perlu blend wajib untuk aqua mill.",
    substitusi: [
      { nama: "CPO + Flaxseed Oil (60:40)", rasio: "hingga 70%", hematPerKg: 19200, catatanNutrisi: "Flaxseed sumbang ALA omega-3", kompensasi: "Tetap perlu 0.5% FM untuk DHA" },
      { nama: "Minyak Maggot BSF", rasio: "hingga 30%", hematPerKg: 12000, catatanNutrisi: "MCFA antimikroba alami" },
    ],
  },
];

// Konteks makro & musim April 2026
export interface MacroSignal {
  judul: string;
  kategori: "Iklim" | "Ekspor-Impor" | "Kebijakan" | "Pasar Global";
  status: "positif" | "netral" | "negatif" | "kritis";
  ringkas: string;
  dampak: string[]; // bahan utama key yang terdampak
  detail: string;
  sumber?: string;
}

export const macroSignals: MacroSignal[] = [
  {
    judul: "ENSO Netral menuju La Niña Lemah",
    kategori: "Iklim",
    status: "positif",
    ringkas: "BMKG/NOAA: La Niña lemah Mei–Sep 2026, curah hujan di atas normal di Jawa & Sumatera.",
    dampak: ["jagung", "dedak", "pkm"],
    detail: "Panen jagung & padi diperkirakan naik 4–6%. Tapi waspada banjir di sentra padi pantura — risiko aflatoksin pada jagung & dedak meningkat. Terapkan binder mikotoksin (bentonite) 0.2–0.3%.",
    sumber: "BMKG ENSO Outlook Apr 2026",
  },
  {
    judul: "Anchovy Peru: Kuota Q1 Anjlok 30%",
    kategori: "Pasar Global",
    status: "kritis",
    ringkas: "IFFO: produksi fishmeal global Q1 2026 turun 30% — efek El Niño sebelumnya & moratorium.",
    dampak: ["tepung-ikan", "minyak-ikan"],
    detail: "Harga tepung ikan impor & minyak ikan diprediksi naik 5–10% lagi sebelum kuota Q2 dibuka. Aqua mill wajib pre-buy Mei–Jun, blend dengan FM lokal & maggot BSF.",
    sumber: "IFFO Market Update Mar 2026",
  },
  {
    judul: "Inpres 3/2026: HPP Jagung Rp 5.500",
    kategori: "Kebijakan",
    status: "positif",
    ringkas: "Bulog serap jagung petani Rp 5.500/kg & SPHP Rp 5.500 ke pabrik pakan.",
    dampak: ["jagung"],
    detail: "Manfaatkan SPHP Bulog (alokasi 168rb ton Apr–Jun) untuk hemat Rp 700/kg vs spot. Daftarkan pabrik via portal Bulog. Validitas surat order H+7.",
    sumber: "Inpres No. 3 Tahun 2026",
  },
  {
    judul: "Impor Kedelai Naik 8% — Rupiah Tertekan",
    kategori: "Ekspor-Impor",
    status: "negatif",
    ringkas: "BPS: impor kedelai Q1 2026 = 720rb ton (+8% YoY). USD/IDR di Rp 16.450 menekan harga SBM domestik.",
    dampak: ["sbm"],
    detail: "Kontrak SBM Q3 disarankan dikunci sekarang (3-month rolling). Substitusi PKM+Kopra di porsi 10–15% memberi buffer terhadap volatilitas FX.",
    sumber: "BPS Statistik Impor Mar 2026",
  },
  {
    judul: "B40 Biodiesel Mandatori — CPO Tertarik Naik",
    kategori: "Kebijakan",
    status: "negatif",
    ringkas: "Implementasi B40 sejak Jan 2026 alokasikan 16 juta kL CPO ke biodiesel — pasokan feed grade ketat.",
    dampak: ["cpo", "pkm"],
    detail: "CPO feed grade naik 16% YoY. Pertimbangkan substitusi sebagian dengan tallow lokal atau crude palm olein. PKM (by-product CPO) tetap surplus karena ekspor turun.",
    sumber: "Permen ESDM 2026",
  },
  {
    judul: "Larangan Impor MBM dari Negara FMD",
    kategori: "Ekspor-Impor",
    status: "netral",
    ringkas: "Karantina perketat impor MBM dari Eropa & Brasil — pasokan domestik dari RPH lokal aman.",
    dampak: ["mbm"],
    detail: "Harga MBM lokal stabil di Rp 9.200/kg. Kontrak langsung dengan rendering plant Jatim/Bali untuk supply 6 bulan.",
    sumber: "Kepmentan Karantina 2026",
  },
  {
    judul: "Panen Padi Apr–Mei: Stok Dedak Surplus",
    kategori: "Iklim",
    status: "positif",
    ringkas: "Panen raya padi Apr–Mei 2026 estimasi 18.5 juta ton GKG — dedak melimpah.",
    dampak: ["dedak"],
    detail: "Beli bulk dedak Apr–Mei untuk stok 30–45 hari. Tambah BHT/etoxyquin 100 ppm untuk cegah oksidasi. Harga diprediksi turun ke Rp 2.800 di puncak panen.",
    sumber: "Kementan Outlook Pangan",
  },
];

// Threshold untuk trigger alert substitusi
export const PRICE_RISE_THRESHOLD = 0.06; // 6% kenaikan = wajib pertimbangkan substitusi
