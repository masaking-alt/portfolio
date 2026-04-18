export function AddOnlyTextDiff({ lines }) {
  return (
    <div className="font-mono text-[12px] leading-[1.65]">
      {lines.map((line, index) => (
        <div key={`${line}-${index}`} className="grid grid-cols-[44px_minmax(0,1fr)]">
          <div className="border-r border-white/[0.04] bg-[#102117] px-2 py-1.5 text-right text-white/28">
            {index + 1}
          </div>
          <div className="bg-[#15321f] px-3 py-1.5 text-[#89d39a]">+ {line}</div>
        </div>
      ))}
    </div>
  );
}
