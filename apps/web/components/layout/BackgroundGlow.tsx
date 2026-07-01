"use client";

export default function BackgroundGlow() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0">

        <div
          className="
          absolute
          -left-40
          -top-40
          h-[520px]
          w-[520px]
          rounded-full
          bg-sky-500/20
          blur-[160px]
        "
        />

        <div
          className="
          absolute
          right-[-150px]
          bottom-[-150px]
          h-[520px]
          w-[520px]
          rounded-full
          bg-emerald-500/15
          blur-[180px]
        "
        />

      </div>
    </>
  );
}