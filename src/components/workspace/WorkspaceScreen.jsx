import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { works } from '../../works';
import { AppWindow } from '../app-window/AppWindow';
import { DesktopBackdrop } from '../desktop/DesktopBackdrop';
import { DesktopMenuBar } from '../desktop/DesktopMenuBar';
import { MacosHomeScreen } from '../home/MacosHomeScreen';
import { OnloadAnimation } from '../onload/OnloadAnimation';
import { SshConnectScreen } from '../home/SshConnectScreen';
import { PAGE_BACKGROUND_COLOR } from '../../constants/window';
import { getThreadState } from '../../utils/threadState';
import { useDesktopWindows } from '../../hooks/useDesktopWindows';

export function WorkspaceScreen({
  threadType = 'works',
  displayMode,
  onSelectCui,
  onSelectGui,
  onBackHome,
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
          <DesktopMenuBar displayMode={displayMode} onBackHome={onBackHome} />
        </div>

        <div className="desktop-window-reveal relative flex-1 overflow-hidden px-3 pt-3 sm:px-5 sm:pt-5 lg:p-0">
          {displayMode === 'home' ? (
            <MacosHomeScreen onSelectCui={onSelectCui} onSelectGui={onSelectGui} />
          ) : null}

          {displayMode === 'cui' ? <SshConnectScreen onBackHome={onBackHome} /> : null}

          {displayMode === 'app' ? (
            <>
              <div className="flex h-full min-h-0 flex-col lg:hidden">
                <AppWindow threadType={effectiveThreadType} selectedWork={selectedWork} threadState={threadState} />
              </div>

              <div ref={desktopViewportRef} className="relative hidden h-full lg:block">
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
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
