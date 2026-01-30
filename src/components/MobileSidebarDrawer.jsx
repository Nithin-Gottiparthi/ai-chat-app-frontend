export default function MobileSidebarDrawer({ open, children }) {
  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        className={`absolute left-0 top-0 h-full w-[85%] max-w-xs
        bg-black/35 backdrop-blur-2xl border-r border-white/10 shadow-2xl
        transform transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
