import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { works } from './works';
import { AppWindow } from './components/app-window/AppWindow';
import { LauncherTerminalWindow } from './components/terminal/LauncherTerminalWindow';
import { DesktopBackdrop } from './components/desktop/DesktopBackdrop';
import { DesktopMenuBar } from './components/desktop/DesktopMenuBar';
import { OnloadAnimation } from './components/onload/OnloadAnimation';
import {
  APP_BOOT_MESSAGE,
  AVAILABLE_COMMANDS_TEXT,
  CLI_BOOT_MESSAGE,
  CLI_COMMANDS_TEXT,
  HELP_COMMAND_LINES,
} from './constants/terminal';
import { PAGE_BACKGROUND_COLOR, WINDOW_FLIP_DURATION_MS, WINDOW_FLIP_EASING } from './constants/window';
import { getCliPathFromCommand, getOpenTargetFromCommand, getWorkFromCliTarget } from './utils/commands';
import {
  createCliOutputEntries,
  createTerminalEntries,
  createWorkDetailEntries,
  getThreadState,
} from './utils/threadState';
import { clampWindowFrame, getDesktopWindowFrames, getFallbackDesktopArea, getMaximizedFrame } from './utils/windowFrames';

function WorkspaceScreen({
  threadType = 'works',
  displayMode,
  terminalCommand,
  terminalLog,
  onTerminalCommandChange,
  onTerminalSubmit,
}) {
  const { id } = useParams();
  const selectedWork = threadType === 'works' && id ? works.find((work) => work.id === id) ?? null : null;
  const effectiveThreadType = selectedWork ? 'works' : threadType;
  const threadState = getThreadState(effectiveThreadType, selectedWork);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  const desktopViewportRef = useRef(null);
  const [desktopArea, setDesktopArea] = useState(() => getFallbackDesktopArea(window.innerWidth, window.innerHeight));
  const [windowFrames, setWindowFrames] = useState(() =>
    getDesktopWindowFrames(desktopArea.width, desktopArea.height, displayMode),
  );
  const [activeWindow, setActiveWindow] = useState(displayMode === 'app' ? 'app' : 'terminal');
  const [dragState, setDragState] = useState(null);
  const [hasIntroCompleted, setHasIntroCompleted] = useState(false);
  const windowFrameRefs = useRef({ terminal: null, app: null });
  const windowAnimationRefs = useRef({ terminal: null, app: null });
  const previousDisplayModeRef = useRef(displayMode);

  const handleOnloadAnimationComplete = useCallback(() => {
    setHasIntroCompleted(true);
  }, []);

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

  return (
    <div
      className="relative h-screen w-screen overflow-hidden text-white antialiased"
      style={{ backgroundColor: PAGE_BACKGROUND_COLOR }}
    >
      <DesktopBackdrop />
      <OnloadAnimation onComplete={handleOnloadAnimationComplete} />

      <div
        className={`desktop-ui-reveal relative z-10 flex h-full flex-col overflow-hidden ${
          hasIntroCompleted ? 'desktop-ui-reveal--visible' : ''
        }`}
      >
        <div className="desktop-menu-reveal">
          <DesktopMenuBar displayMode={displayMode} />
        </div>

        <div className="desktop-window-reveal relative flex-1 overflow-hidden px-3 pt-3 sm:px-5 sm:pt-5 lg:p-0">
          <div className="flex h-full flex-col gap-4 lg:hidden">
            {displayMode === 'cli' ? (
              <div className="min-h-0 flex-1">
                <LauncherTerminalWindow
                  threadType={effectiveThreadType}
                  selectedWork={selectedWork}
                  threadState={threadState}
                  displayMode={displayMode}
                  terminalCommand={terminalCommand}
                  terminalLog={terminalLog}
                  onTerminalCommandChange={onTerminalCommandChange}
                  onTerminalSubmit={onTerminalSubmit}
                />
              </div>
            ) : (
              <>
                <div className="shrink-0">
                    <LauncherTerminalWindow
                      threadType={effectiveThreadType}
                      selectedWork={selectedWork}
                      threadState={threadState}
                      displayMode={displayMode}
                      terminalCommand={terminalCommand}
                      terminalLog={terminalLog}
                      onTerminalCommandChange={onTerminalCommandChange}
                      onTerminalSubmit={onTerminalSubmit}
                    />
                </div>

                {displayMode === 'app' ? (
                  <div className="min-h-0 flex-1">
                    <AppWindow threadType={effectiveThreadType} selectedWork={selectedWork} threadState={threadState} />
                  </div>
                ) : null}
              </>
            )}
          </div>

          <div ref={desktopViewportRef} className="relative hidden h-full lg:block">
            <div
              ref={(node) => {
                windowFrameRefs.current.terminal = node;
              }}
              style={{
                left: `${windowFrames.terminal.x}px`,
                top: `${windowFrames.terminal.y}px`,
                width: `${windowFrames.terminal.width}px`,
                height: `${windowFrames.terminal.height}px`,
                zIndex: activeWindow === 'terminal' ? 30 : 20,
              }}
              className={`desktop-window-frame absolute ${dragState?.key === 'terminal' ? 'desktop-window-frame--dragging' : ''}`}
            >
                <LauncherTerminalWindow
                  threadType={effectiveThreadType}
                  selectedWork={selectedWork}
                  threadState={threadState}
                  displayMode={displayMode}
                  terminalCommand={terminalCommand}
                  terminalLog={terminalLog}
                  onTerminalCommandChange={onTerminalCommandChange}
                  onTerminalSubmit={onTerminalSubmit}
                  shellProps={terminalShellProps}
              />
            </div>

            {displayMode === 'app' ? (
              <div
                ref={(node) => {
                  windowFrameRefs.current.app = node;
                }}
                style={{
                  left: `${windowFrames.app.x}px`,
                  top: `${windowFrames.app.y}px`,
                  width: `${windowFrames.app.width}px`,
                  height: `${windowFrames.app.height}px`,
                  zIndex: activeWindow === 'app' ? 30 : 20,
                }}
                className={`desktop-window-frame absolute ${dragState?.key === 'app' ? 'desktop-window-frame--dragging' : ''}`}
              >
                <AppWindow
                  threadType={effectiveThreadType}
                  selectedWork={selectedWork}
                  threadState={threadState}
                  shellProps={appShellProps}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const [displayMode, setDisplayMode] = useState('idle');
  const [hasEnteredWorkspace, setHasEnteredWorkspace] = useState(false);
  const [terminalCommand, setTerminalCommand] = useState('');
  const [terminalLog, setTerminalLog] = useState(() => [
    { kind: 'system', text: AVAILABLE_COMMANDS_TEXT },
  ]);

  function appendTerminalEntries(entries) {
    setTerminalLog((currentLog) => [...currentLog, ...entries]);
  }

  function appendTerminalLines(lines, kind = 'system') {
    appendTerminalEntries(createTerminalEntries(lines, kind));
  }

  function handleTerminalSubmit(event) {
    event.preventDefault();
    const rawCommand = terminalCommand.trim();
    const normalizedCommand = rawCommand.toLowerCase().replace(/\s+/g, ' ');
    setTerminalCommand('');

    if (!normalizedCommand) {
      return;
    }

    setTerminalLog((currentLog) => [...currentLog, { kind: 'command', text: rawCommand }]);

    if (normalizedCommand === 'masaking') {
      setHasEnteredWorkspace(true);
      setDisplayMode('cli');
      navigate('/');
      appendTerminalLines([CLI_BOOT_MESSAGE]);
      appendTerminalEntries(createCliOutputEntries('/'));
      return;
    }

    if (normalizedCommand === 'masaking app') {
      setHasEnteredWorkspace(true);
      setDisplayMode('app');
      appendTerminalLines([APP_BOOT_MESSAGE]);
      return;
    }

    if (normalizedCommand === 'help') {
      appendTerminalLines(hasEnteredWorkspace ? [...HELP_COMMAND_LINES, CLI_COMMANDS_TEXT] : HELP_COMMAND_LINES);
      return;
    }

    if (normalizedCommand === 'clear') {
      setTerminalLog([]);
      navigate('/');
      return;
    }

    const cliPath = getCliPathFromCommand(normalizedCommand);
    if (cliPath) {
      if (!hasEnteredWorkspace) {
        appendTerminalLines(['Run "masaking" or "masaking app" first.'], 'error');
        return;
      }

      navigate(cliPath);
      appendTerminalEntries(createCliOutputEntries(cliPath));
      return;
    }

    const openTarget = getOpenTargetFromCommand(normalizedCommand);
    if (openTarget !== null) {
      if (!hasEnteredWorkspace) {
        appendTerminalLines(['Run "masaking" or "masaking app" first.'], 'error');
        return;
      }

      const work = getWorkFromCliTarget(openTarget);
      if (!work) {
        appendTerminalLines([`work not found: ${openTarget}`], 'error');
        return;
      }

      navigate(`/work/${work.id}`);
      appendTerminalEntries(createWorkDetailEntries(work));
      return;
    }

    appendTerminalLines([`command not found: ${rawCommand}`], 'error');
  }

  function renderWorkspaceRoute(threadType) {
    return (
      <WorkspaceScreen
        threadType={threadType}
        displayMode={displayMode}
        terminalCommand={terminalCommand}
        terminalLog={terminalLog}
        onTerminalCommandChange={setTerminalCommand}
        onTerminalSubmit={handleTerminalSubmit}
      />
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <WorkspaceScreen
            threadType="top"
            displayMode={displayMode}
            terminalCommand={terminalCommand}
            terminalLog={terminalLog}
            onTerminalCommandChange={setTerminalCommand}
            onTerminalSubmit={handleTerminalSubmit}
          />
        }
      />
      <Route
        path="/works"
        element={renderWorkspaceRoute('works')}
      />
      <Route
        path="/work/:id"
        element={renderWorkspaceRoute('works')}
      />
      <Route
        path="/about"
        element={renderWorkspaceRoute('about')}
      />
      <Route
        path="/contact"
        element={renderWorkspaceRoute('contact')}
      />
    </Routes>
  );
}

export default App;
