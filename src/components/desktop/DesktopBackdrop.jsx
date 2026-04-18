import { PAGE_BACKGROUND_COLOR } from '../../constants/window';

export function DesktopBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ backgroundColor: PAGE_BACKGROUND_COLOR }}
    />
  );
}
