export function clampColumnWidths(widths, containerWidth) {
  const minLeft = 220;
  const minCenter = 520;
  const minRight = 420;
  const maxLeft = Math.max(minLeft, containerWidth - minCenter - minRight);
  const left = Math.min(Math.max(widths.left, minLeft), maxLeft);
  const maxRight = Math.max(minRight, containerWidth - left - minCenter);
  const right = Math.min(Math.max(widths.right, minRight), maxRight);
  return { left, right };
}

function clampValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function getFallbackDesktopArea(viewportWidth, viewportHeight) {
  return {
    width: Math.max(320, viewportWidth - 48),
    height: Math.max(260, viewportHeight - 96),
  };
}

export function getMaximizedFrame(containerWidth, containerHeight) {
  return {
    x: 0,
    y: 0,
    width: Math.max(320, containerWidth),
    height: Math.max(260, containerHeight),
    isMaximized: true,
  };
}

export function clampWindowFrame(frame, containerWidth, containerHeight) {
  if (frame.isMaximized) {
    return {
      ...frame,
      ...getMaximizedFrame(containerWidth, containerHeight),
    };
  }

  const margin = 18;
  const width = Math.min(frame.width, Math.max(320, containerWidth - margin * 2));
  const height = Math.min(frame.height, Math.max(260, containerHeight - margin * 2));
  return {
    ...frame,
    width,
    height,
    x: clampValue(frame.x, 0, Math.max(0, containerWidth - width)),
    y: clampValue(frame.y, 0, Math.max(0, containerHeight - height)),
  };
}

export function getDesktopWindowFrames(containerWidth, containerHeight, mode) {
  const terminalLargeWidth = Math.min(containerWidth - 36, 1180);
  const terminalLargeHeight = Math.min(containerHeight - 36, 760);
  const centeredTerminal = {
    x: Math.max(18, Math.round((containerWidth - terminalLargeWidth) / 2)),
    y: Math.max(18, Math.round((containerHeight - terminalLargeHeight) / 2) - 10),
    width: terminalLargeWidth,
    height: terminalLargeHeight,
    isMaximized: false,
  };

  const terminalCompact = clampWindowFrame(
    {
      x: 24,
      y: 24,
      width: Math.min(460, containerWidth * 0.3),
      height: Math.min(380, containerHeight * 0.44),
      isMaximized: false,
    },
    containerWidth,
    containerHeight,
  );

  const appLarge = clampWindowFrame(
    {
      x: Math.max(120, Math.round(containerWidth * 0.14)),
      y: 24,
      width: Math.min(containerWidth - 48, 1180),
      height: Math.min(containerHeight - 48, 760),
      isMaximized: false,
    },
    containerWidth,
    containerHeight,
  );

  if (mode === 'app') {
    return {
      terminal: terminalCompact,
      app: appLarge,
    };
  }

  return {
    terminal: centeredTerminal,
    app: appLarge,
  };
}
