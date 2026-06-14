export function getModeLabel(displayMode) {
  if (displayMode === 'home') {
    return 'Masaking';
  }
  if (displayMode === 'cui') {
    return 'Masaking CLI';
  }
  if (displayMode === 'app') {
    return 'Masaking App';
  }
  return 'Masaking';
}
