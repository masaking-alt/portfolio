import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { works } from '../../works';
import { AppWindow } from '../app-window/AppWindow';
import { DesktopBackdrop } from '../desktop/DesktopBackdrop';
import { DesktopMenuBar } from '../desktop/DesktopMenuBar';
import { OnloadAnimation } from '../onload/OnloadAnimation';
import { LauncherTerminalWindow } from '../terminal/LauncherTerminalWindow';
import { PAGE_BACKGROUND_COLOR } from '../../constants/window';
import { getThreadState } from '../../utils/threadState';
import { useDesktopWindows } from '../../hooks/useDesktopWindows';

export function WorkspaceScreen({
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
  const [hasIntroCompleted, setHasIntroCompleted] = useState(false);
  const handleOnloadAnimationComplete = useCallback(() => {
    setHasIntroCompleted(true);
  }, []);
  const {
    activeWindow,
    appShellProps,
    desktopViewportRef,
    dragState,
    terminalShellProps,
    windowFrameRefs,
    windowFrames,
  } = useDesktopWindows(displayMode);
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
