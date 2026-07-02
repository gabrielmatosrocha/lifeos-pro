import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: Props) {
  return (
    <div
      className={`
      rounded-3xl
      border
      border-white/10
      bg-white/[0.03]
      backdrop-blur-xl
      shadow-[0_20px_60px_rgba(0,0,0,.35)]
      transition-all
      duration-300
      hover:scale-[1.01]
      hover:border-cyan-400/30
      ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;
