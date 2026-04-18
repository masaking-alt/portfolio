import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { WINDOW_FLIP_DURATION_MS, WINDOW_FLIP_EASING } from '../constants/window';
import { clampWindowFrame, getDesktopWindowFrames, getFallbackDesktopArea, getMaximizedFrame } from '../utils/windowFrames';

export function useDesktopWindows(displayMode) {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  const desktopViewportRef = useRef(null);
  const [desktopArea, setDesktopArea] = useState(() => getFallbackDesktopArea(window.innerWidth, window.innerHeight));
  const [windowFrames, setWindowFrames] = useState(() =>
    getDesktopWindowFrames(desktopArea.width, desktopArea.height, displayMode),
  );
  const [activeWindow, setActiveWindow] = useState(displayMode === 'app' ? 'app' : 'terminal');
  const [dragState, setDragState] = useState(null);
  const windowFrameRefs = useRef({ terminal: null, app: null });
  const windowAnimationRefs = useRef({ terminal: null, app: null });
  const previousDisplayModeRef = useRef(displayMode);


  function cancelWindowFrameAnimation(windowKey, shouldClearStyles = false) {
    const currentAnimation = windowAnimationRefs.current[windowKey];
    if (currentAnimation?.rafId) {
      cancelAnimationFrame(currentAnimation.rafId);
    }
    if (currentAnimation?.timeoutId) {
      window.clearTimeout(currentAnimation.timeoutId);
    }
    windowAnimationRefs.current[windowKey] = null;

    if (!shouldClearStyles) {
      return;
    }

    const frameElement = windowFrameRefs.current[windowKey];
    if (!frameElement) {
      return;
    }
    frameElement.style.transition = '';
    frameElement.style.transform = '';
    frameElement.style.transformOrigin = '';
    frameElement.style.pointerEvents = '';
  }

  function playWindowFrameFlip(windowKey, firstRect, nextFrame) {
    const frameElement = windowFrameRefs.current[windowKey];
    const desktopViewport = desktopViewportRef.current;
    if (!frameElement || !desktopViewport || !firstRect || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cancelWindowFrameAnimation(windowKey, true);
      return;
    }

    const viewportRect = desktopViewport.getBoundingClientRect();
    const lastRect = {
      left: viewportRect.left + nextFrame.x,
      top: viewportRect.top + nextFrame.y,
      width: nextFrame.width,
      height: nextFrame.height,
    };

    if (lastRect.width <= 0 || lastRect.height <= 0) {
      cancelWindowFrameAnimation(windowKey, true);
      return;
    }

    const deltaX = firstRect.left - lastRect.left;
    const deltaY = firstRect.top - lastRect.top;
    const scaleX = firstRect.width / lastRect.width;
    const scaleY = firstRect.height / lastRect.height;
    const animationId = Symbol(windowKey);
    const animationState = { id: animationId, rafId: null, timeoutId: null };
    windowAnimationRefs.current[windowKey] = animationState;

    frameElement.style.transition = 'none';
    frameElement.style.transformOrigin = 'top left';
    frameElement.style.pointerEvents = 'none';
    frameElement.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})`;
    frameElement.getBoundingClientRect();

    animationState.rafId = requestAnimationFrame(() => {
      if (windowAnimationRefs.current[windowKey]?.id !== animationId) {
        return;
      }

      frameElement.style.transition = `transform ${WINDOW_FLIP_DURATION_MS}ms ${WINDOW_FLIP_EASING}`;
      frameElement.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
    });

    animationState.timeoutId = window.setTimeout(() => {
      if (windowAnimationRefs.current[windowKey]?.id !== animationId) {
        return;
      }

      frameElement.style.transition = '';
      frameElement.style.transform = '';
      frameElement.style.transformOrigin = '';
      frameElement.style.pointerEvents = '';
      windowAnimationRefs.current[windowKey] = null;
    }, WINDOW_FLIP_DURATION_MS + 80);
  }

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => () => {
    cancelWindowFrameAnimation('terminal', true);
    cancelWindowFrameAnimation('app', true);
  }, []);

  useEffect(() => {
    const desktopViewport = desktopViewportRef.current;
    if (!desktopViewport) {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width <= 0 || entry.contentRect.height <= 0) {
        return;
      }

      setDesktopArea({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    resizeObserver.observe(desktopViewport);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      previousDisplayModeRef.current = displayMode;
      return;
    }

    if (previousDisplayModeRef.current !== displayMode) {
      setWindowFrames(getDesktopWindowFrames(desktopArea.width, desktopArea.height, displayMode));
      setActiveWindow(displayMode === 'app' ? 'app' : 'terminal');
      previousDisplayModeRef.current = displayMode;
    }
  }, [desktopArea.height, desktopArea.width, displayMode, isDesktop]);

  useEffect(() => {
    if (!isDesktop) {
      return;
    }

    setWindowFrames((currentFrames) => ({
      terminal: clampWindowFrame(currentFrames.terminal, desktopArea.width, desktopArea.height),
      app: clampWindowFrame(currentFrames.app, desktopArea.width, desktopArea.height),
    }));
  }, [desktopArea.height, desktopArea.width, isDesktop]);

  useEffect(() => {
    if (!isDesktop || !dragState) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      const desktopViewport = desktopViewportRef.current;
      if (!desktopViewport) {
        return;
      }

      const viewportRect = desktopViewport.getBoundingClientRect();
      setWindowFrames((currentFrames) => {
        const currentFrame = currentFrames[dragState.key];
        if (!currentFrame || currentFrame.isMaximized) {
          return currentFrames;
        }

        return {
          ...currentFrames,
          [dragState.key]: clampWindowFrame(
            {
              ...currentFrame,
              x: event.clientX - viewportRect.left - dragState.offsetX,
              y: event.clientY - viewportRect.top - dragState.offsetY,
            },
            desktopArea.width,
            desktopArea.height,
          ),
        };
      });
    };

    const handlePointerUp = () => setDragState(null);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [desktopArea.height, desktopArea.width, dragState, isDesktop]);

  function focusWindow(windowKey) {
    setActiveWindow(windowKey);
  }

  function startWindowDrag(windowKey, event) {
    if (!isDesktop) {
      return;
    }

    const desktopViewport = desktopViewportRef.current;
    const frame = windowFrames[windowKey];
    if (!desktopViewport || !frame || frame.isMaximized) {
      return;
    }

    const viewportRect = desktopViewport.getBoundingClientRect();
    event.preventDefault();
    setActiveWindow(windowKey);
    setDragState({
      key: windowKey,
      offsetX: event.clientX - viewportRect.left - frame.x,
      offsetY: event.clientY - viewportRect.top - frame.y,
    });
  }

  function toggleWindowMaximize(windowKey) {
    if (!isDesktop) {
      return;
    }

    const frame = windowFrames[windowKey];
    if (!frame) {
      return;
    }

    const frameElement = windowFrameRefs.current[windowKey];
    const firstRect = frameElement?.getBoundingClientRect();
    cancelWindowFrameAnimation(windowKey);

    const nextFrame = frame.isMaximized && frame.restoreFrame
      ? {
          ...clampWindowFrame(
            {
              ...frame.restoreFrame,
              isMaximized: false,
            },
            desktopArea.width,
            desktopArea.height,
          ),
          restoreFrame: null,
        }
      : {
          ...getMaximizedFrame(desktopArea.width, desktopArea.height),
          restoreFrame: {
            x: frame.x,
            y: frame.y,
            width: frame.width,
            height: frame.height,
          },
        };

    flushSync(() => {
      setActiveWindow(windowKey);
      setWindowFrames((currentFrames) => ({
        ...currentFrames,
        [windowKey]: nextFrame,
      }));
    });

    playWindowFrameFlip(windowKey, firstRect, nextFrame);
  }

  const terminalShellProps = {
    active: activeWindow === 'terminal',
    isMaximized: Boolean(windowFrames.terminal?.isMaximized),
    onWindowPointerDown: () => focusWindow('terminal'),
    onHeaderPointerDown: (event) => startWindowDrag('terminal', event),
    onToggleMaximize: () => toggleWindowMaximize('terminal'),
  };

  const appShellProps = {
    active: activeWindow === 'app',
    isMaximized: Boolean(windowFrames.app?.isMaximized),
    onWindowPointerDown: () => focusWindow('app'),
    onHeaderPointerDown: (event) => startWindowDrag('app', event),
    onToggleMaximize: () => toggleWindowMaximize('app'),
  };

  return {
    activeWindow,
    appShellProps,
    desktopViewportRef,
    dragState,
    terminalShellProps,
    windowFrameRefs,
    windowFrames,
  };
}
