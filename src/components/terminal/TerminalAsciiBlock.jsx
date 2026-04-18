export function TerminalAsciiBlock({ lines, className = '' }) {
  const content = lines.length > 0 ? lines.join('\n') : '';

  return <pre className={`m-0 whitespace-pre font-mono ${className}`}>{content}</pre>;
}
