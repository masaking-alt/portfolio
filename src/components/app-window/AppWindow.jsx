import { useEffect, useRef, useState } from 'react';
import { WindowShell } from '../desktop/WindowShell';
import { clampColumnWidths } from '../../utils/windowFrames';
import { getAddedLineCount } from '../../utils/threadState';
import { CenterColumn } from './CenterColumn';
import { Composer } from './Composer';
import { LeftSidebar } from './LeftSidebar';
import { RightColumn } from './RightColumn';
import { TopBar } from './TopBar';

export function AppWindow({ threadType, selectedWork, threadState, shellProps = {} }) {
  const addedCount = getAddedLineCount(threadState.diffEntries);
  const containerRef = useRef(null);
  const centerScrollRef = useRef(null);
  const rightScrollRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [draggingDivider, setDraggingDivider] = useState(null);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const savedWidths = JSON.parse(window.localStorage.getItem('portfolio-column-widths') ?? 'null');
      if (savedWidths && typeof savedWidths.left === 'number' && typeof savedWidths.right === 'number') {
        return savedWidths;
      }
    } catch {
      return { left: 268, right: 864 };
    }
    return { left: 268, right: 864 };
  });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isDesktop || containerWidth === 0) {
      return;
    }
    setColumnWidths((currentWidths) => clampColumnWidths(currentWidths, containerWidth));
  }, [containerWidth, isDesktop]);

  useEffect(() => {
    window.localStorage.setItem('portfolio-column-widths', JSON.stringify(columnWidths));
  }, [columnWidths]);

  useEffect(() => {
    if (!isDesktop || !draggingDivider) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      if (!containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      if (draggingDivider === 'left') {
        const nextLeftWidth = event.clientX - rect.left;
        setColumnWidths((currentWidths) => clampColumnWidths({ ...currentWidths, left: nextLeftWidth }, rect.width));
      } else {
        const nextRightWidth = rect.right - event.clientX;
        setColumnWidths((currentWidths) => clampColumnWidths({ ...currentWidths, right: nextRightWidth }, rect.width));
      }
    };

    const handlePointerUp = () => setDraggingDivider(null);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingDivider, isDesktop]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (centerScrollRef.current) {
      centerScrollRef.current.scrollTop = 0;
    }
    if (rightScrollRef.current) {
      rightScrollRef.current.scrollTop = 0;
    }
  }, [threadType, selectedWork?.id]);

  const gridStyle = isDesktop
    ? { gridTemplateColumns: `${columnWidths.left}px minmax(0, 1fr) ${columnWidths.right}px` }
    : undefined;
  const { onHeaderPointerDown, onToggleMaximize, isMaximized } = shellProps;

  return (
    <WindowShell
      active
      className="flex h-full min-h-0 flex-col"
      bodyClassName="flex-1 min-h-0"
      {...shellProps}
    >
      <div ref={containerRef} className="relative h-full min-h-0 flex-1 overflow-hidden bg-[#111112]">
        <div
          className="grid h-full w-full grid-cols-1 auto-rows-max lg:grid-cols-[268px_minmax(0,1fr)_864px] lg:grid-rows-[40px_minmax(0,1fr)]"
          style={gridStyle}
        >
          <LeftSidebar
            activeThreadType={threadType}
            selectedWorkId={selectedWork?.id ?? null}
            onHeaderPointerDown={onHeaderPointerDown}
            onToggleMaximize={onToggleMaximize}
            isMaximized={isMaximized}
          />
          <TopBar title={threadState.title} addedCount={addedCount} onHeaderPointerDown={onHeaderPointerDown} />
          <CenterColumn
            threadType={threadType}
            selectedWork={selectedWork}
            threadState={threadState}
            scrollRef={centerScrollRef}
          />
          <RightColumn diffEntries={threadState.diffEntries} scrollRef={rightScrollRef} />
        </div>

        {isDesktop && containerWidth > 0 ? (
          <>
            <div
              style={{ left: `${columnWidths.left}px` }}
              className="absolute top-10 bottom-0 z-30 hidden w-3 -translate-x-1/2 cursor-col-resize lg:block"
              onPointerDown={(event) => {
                event.preventDefault();
                setDraggingDivider('left');
              }}
            >
              <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/[0.05]" />
              <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-transparent transition hover:bg-white/[0.16]" />
            </div>
            <div
              style={{ left: `${containerWidth - columnWidths.right}px` }}
              className="absolute top-10 bottom-0 z-30 hidden w-3 -translate-x-1/2 cursor-col-resize lg:block"
              onPointerDown={(event) => {
                event.preventDefault();
                setDraggingDivider('right');
              }}
            >
              <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/[0.05]" />
              <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-transparent transition hover:bg-white/[0.16]" />
            </div>
          </>
        ) : null}
      </div>
    </WindowShell>
  );
}
