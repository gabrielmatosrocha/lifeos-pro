import { AlertCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";

type FeedbackVariant = "loading" | "error" | "empty" | "success";

type FeedbackStateProps = {
  title: string;
  description?: string;
  variant?: FeedbackVariant;
  action?: React.ReactNode;
  className?: string;
};

const iconByVariant = {
  loading: Loader2,
  error: AlertCircle,
  empty: Sparkles,
  success: CheckCircle2,
};

const toneByVariant: Record<FeedbackVariant, string> = {
  loading: "border-cyan-400/20 bg-cyan-500/10 text-cyan-200",
  error: "border-rose-400/25 bg-rose-500/10 text-rose-200",
  empty: "border-white/10 bg-white/[0.04] text-zinc-200",
  success: "border-emerald-400/25 bg-emerald-500/10 text-emerald-200",
};

export default function FeedbackState({
  title,
  description,
  variant = "empty",
  action,
  className = "",
}: FeedbackStateProps) {
  const Icon = iconByVariant[variant];

  return (
    <div className={`rounded-[22px] border p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.10),0_16px_45px_rgba(0,0,0,.22)] backdrop-blur-xl ${toneByVariant[variant]} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-2xl border border-white/10 bg-white/10 p-2 shadow-inner shadow-white/5">
          <Icon className={variant === "loading" ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{title}</p>
          {description ? <p className="mt-1 text-sm text-zinc-400">{description}</p> : null}
          {action ? <div className="mt-3">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
