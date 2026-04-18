import { contactContent } from '../../constants/content';
import { ChangeSummary } from './ChangeSummary';

export function ContactContent({ diffEntries }) {
  return (
    <>
      <div className="mt-6 rounded-2xl border border-white/[0.06] bg-[#141415] p-6">
        <p className="text-[15px] leading-7 text-white/76">{contactContent.intro}</p>
        <a
          href={`mailto:${contactContent.email}`}
          className="mt-5 inline-flex rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[14px] text-white/84 transition hover:bg-white/[0.06]"
        >
          {contactContent.email}
        </a>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {contactContent.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/[0.06] bg-black/10 px-4 py-4 text-[13px] text-white/72 transition hover:bg-white/[0.04] hover:text-white"
            >
              <div className="text-[11px] tracking-[0.08em] text-white/34">LINK</div>
              <div className="mt-2 font-medium">{link.label}</div>
            </a>
          ))}
        </div>
      </div>

      <ChangeSummary diffEntries={diffEntries} />
    </>
  );
}
