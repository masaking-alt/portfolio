export function WindowShell({
  active = false,
  isMaximized = false,
  className = '',
  bodyClassName = '',
  onWindowPointerDown,
  children,
}) {
  return (
    <section
      onPointerDown={onWindowPointerDown}
      className={`desktop-window-surface ${isMaximized ? 'desktop-window-surface--maximized' : ''} relative overflow-hidden rounded-[28px] border bg-[#0d1017]/90 backdrop-blur-xl ${
        active
          ? 'border-white/16 shadow-[0_28px_90px_rgba(0,0,0,0.48)]'
          : 'border-white/10 shadow-[0_18px_56px_rgba(0,0,0,0.34)]'
      } ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%)]" />
      <div className={`relative flex min-h-0 flex-col ${bodyClassName}`}>{children}</div>
    </section>
  );
}
