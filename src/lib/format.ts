export const fmtRp = (n: number) =>
  "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(n));

export const fmtNum = (n: number, digits = 0) =>
  new Intl.NumberFormat("id-ID", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);

export const fmtPct = (n: number, digits = 1) =>
  `${n > 0 ? "+" : ""}${n.toFixed(digits)}%`;
