import { useEffect, useRef } from 'react';
import { TerminalWindowShell } from '../desktop/TerminalWindowShell';
import { TerminalLogLine } from './TerminalLogLine';
import { TerminalPromptInput } from './TerminalPromptInput';

export function LauncherTerminalWindow({
  terminalCommand,
  terminalLog,
  onTerminalCommandChange,
  onTerminalSubmit,
  shellProps = {},
}) {
  const terminalTitle = 'Visitor@MasakingPortfolio ~ website/portfolio';
  const launcherScrollRef = useRef(null);

  useEffect(() => {
    if (launcherScrollRef.current) {
      launcherScrollRef.current.scrollTop = launcherScrollRef.current.scrollHeight;
    }
  }, [terminalLog]);

  return (
    <TerminalWindowShell title={terminalTitle} active className="flex h-full min-h-0 flex-col" {...shellProps}>
      <div
        ref={launcherScrollRef}
        className="min-h-0 flex-1 overflow-auto bg-[#1e1e1e] px-5 py-4 font-mono text-[12px] leading-6 text-[#d0d0d0] custom-scrollbar"
      >
        <div className="space-y-0">
          {terminalLog.map((entry, index) => (
            <div key={`${entry.text}-${index}`}>
              <TerminalLogLine entry={entry} />
            </div>
          ))}
        </div>
        <div className="pt-0">
          <TerminalPromptInput value={terminalCommand} onChange={onTerminalCommandChange} onSubmit={onTerminalSubmit} />
        </div>
      </div>
    </TerminalWindowShell>
  );
}
