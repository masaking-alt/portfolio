export function WindowControlButtons({ onToggleMaximize, isMaximized = false, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        aria-label="close window"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        className="h-3 w-3 rounded-full bg-[#ff5f57]"
      />
      <button
        type="button"
        aria-label="minimize window"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        className="h-3 w-3 rounded-full bg-[#febc2e]"
      />
      <button
        type="button"
        aria-label={isMaximized ? 'restore window' : 'maximize window'}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onToggleMaximize?.();
        }}
        className="flex h-3 w-3 items-center justify-center rounded-full bg-[#28c840]"
      >
        <span className="h-[5px] w-[5px] rounded-[1px] bg-black/25" />
      </button>
    </div>
  );
}
