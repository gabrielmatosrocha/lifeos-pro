import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[linear-gradient(135deg,#67e8f9,#22d3ee_42%,#38bdf8)] text-slate-950 shadow-[0_18px_50px_rgba(34,211,238,.24),inset_0_1px_0_rgba(255,255,255,.38)] hover:brightness-110",
  secondary:
    "border border-white/15 bg-white/[0.07] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_14px_40px_rgba(0,0,0,.26)] hover:border-cyan-200/30 hover:bg-white/[0.105]",
  ghost:
    "bg-transparent text-zinc-300 shadow-none hover:bg-white/[0.08] hover:text-white",
  danger:
    "bg-[linear-gradient(135deg,#fb7185,#e11d48)] text-white shadow-[0_18px_50px_rgba(225,29,72,.24),inset_0_1px_0_rgba(255,255,255,.18)] hover:brightness-110",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-7 py-4 text-base",
};

export default function Button({
  className = "",
  disabled,
  isLoading = false,
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
      inline-flex
      items-center
      justify-center
      gap-2
      rounded-[20px]
      font-semibold
      transition-all
      duration-200
      ease-out
      shadow-lg
      outline-none
      focus-visible:ring-2
      focus-visible:ring-cyan-300/70
      focus-visible:ring-offset-2
      focus-visible:ring-offset-zinc-950
      active:scale-[0.98]
      disabled:cursor-not-allowed
      disabled:opacity-60
      ${variants[variant]}
      ${sizes[size]}
      ${className}
      `}
    />
  );
}
