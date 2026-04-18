import { CliHomeScreen } from './CliHomeScreen';
import { TerminalCommandLine } from './TerminalCommandLine';

export function TerminalLogLine({ entry }) {
  if (entry.kind === 'cli-home') {
    return <CliHomeScreen />;
  }

  if (entry.kind === 'command') {
    return <TerminalCommandLine command={entry.text} />;
  }

  if (entry.kind === 'error') {
    return <div className="text-[#f5f5f5]">{entry.text}</div>;
  }

  return <div className="text-[#d0d0d0]">{entry.text}</div>;
}
