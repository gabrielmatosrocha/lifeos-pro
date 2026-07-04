import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: Props) {
  return (
    <div
      className={`
      group
      relative
      overflow-hidden
      rounded-[28px]
      border
      border-white/[0.14]
      bg-[linear-gradient(145deg,rgba(255,255,255,0.105),rgba(255,255,255,0.035)_48%,rgba(255,255,255,0.065))]
      p-5
      shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_24px_70px_rgba(0,0,0,.38)]
      backdrop-blur-2xl
      transition-all
      duration-300
      ease-out
      before:pointer-events-none
      before:absolute
      before:inset-x-6
      before:top-0
      before:h-px
      before:bg-gradient-to-r
      before:from-transparent
      before:via-white/45
      before:to-transparent
      hover:-translate-y-0.5
      hover:border-cyan-200/30
      hover:bg-white/[0.075]
      hover:shadow-[inset_0_1px_0_rgba(255,255,255,.2),0_30px_90px_rgba(0,0,0,.45),0_0_45px_rgba(34,211,238,.08)]
      ${className}
      `}
    >
      <div className="relative">{children}</div>
    </div>
  );
}

export default Card;
