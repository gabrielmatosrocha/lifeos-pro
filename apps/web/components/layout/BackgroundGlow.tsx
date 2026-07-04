"use client";

export default function BackgroundGlow() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(80%_60%_at_18%_0%,rgba(34,211,238,.16),transparent_58%),radial-gradient(70%_55%_at_92%_100%,rgba(16,185,129,.12),transparent_55%),linear-gradient(180deg,rgba(255,255,255,.025),transparent_36%)]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,.035)_42%,transparent_58%)] opacity-60" />
      </div>
    </>
  );
}
