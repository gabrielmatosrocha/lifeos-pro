import { ButtonHTMLAttributes } from "react";

export default function Button(
props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="
      rounded-2xl
      bg-cyan-500
      hover:bg-cyan-400
      px-6
      py-3
      font-semibold
      transition
      duration-300
      shadow-lg
      shadow-cyan-500/30
      "
    />
  );
}
