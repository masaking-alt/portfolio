export function getModeLabel(displayMode) {
  if (displayMode === 'cli') {
    return 'Masaking CLI';
  }
  if (displayMode === 'app') {
    return 'Masaking App';
  }
  return 'terminal';
}
