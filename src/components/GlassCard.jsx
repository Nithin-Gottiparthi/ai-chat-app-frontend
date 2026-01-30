export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={
        "rounded-3xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-glass " +
        "p-4 " +
        className
      }
    >
      {children}
    </div>
  );
}
