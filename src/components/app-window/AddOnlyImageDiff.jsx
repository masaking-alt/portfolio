export function AddOnlyImageDiff({ entry }) {
  return (
    <div className="grid grid-cols-[44px_minmax(0,1fr)]">
      <div className="border-r border-white/[0.04] bg-[#102117] px-2 py-3 text-right font-mono text-[11.5px] text-white/28">
        1
      </div>
      <div className="bg-[#132418] px-4 py-4">
        <div className="mx-auto flex max-w-[420px] items-center justify-center rounded-lg border border-emerald-400/10 bg-black/20 p-3">
          <img src={entry.imageUrl} alt={entry.imageAlt} className="block h-auto max-h-[420px] w-auto max-w-full object-contain" />
        </div>
        <div className="mt-3 font-mono text-[11.5px] text-[#89d39a]">{entry.caption}</div>
      </div>
    </div>
  );
}
