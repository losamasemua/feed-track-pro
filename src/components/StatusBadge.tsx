import type { Status } from "@/data/ingredients";
import { AlertTriangle, Eye, ShieldCheck, Sparkles } from "lucide-react";

const map: Record<Status, { cls: string; Icon: typeof AlertTriangle; label: string }> = {
  KRITIS:  { cls: "ft-status-kritis",  Icon: AlertTriangle, label: "KRITIS" },
  MONITOR: { cls: "ft-status-monitor", Icon: Eye,           label: "MONITOR" },
  AMAN:    { cls: "ft-status-aman",    Icon: ShieldCheck,   label: "AMAN" },
  SURPLUS: { cls: "ft-status-surplus", Icon: Sparkles,      label: "SURPLUS" },
};

export function StatusBadge({ status }: { status: Status }) {
  const { cls, Icon, label } = map[status];
  return (
    <span className={`ft-badge ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
