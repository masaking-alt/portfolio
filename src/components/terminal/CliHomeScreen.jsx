import { MASAKING_LOGO_LINES, PROFILE_ASCII_LINES } from '../../constants/asciiArt';
import { CLI_HOME_COMMAND_ROWS, CLI_HOME_OVERVIEW_ROWS } from '../../constants/terminal';
import { TerminalAsciiBlock } from './TerminalAsciiBlock';

export function CliHomeScreen() {
  const logoLines = MASAKING_LOGO_LINES.length > 0 ? MASAKING_LOGO_LINES : ['MASAKING'];
  const portraitLines = PROFILE_ASCII_LINES.length > 0 ? PROFILE_ASCII_LINES : ['[ profile art ]'];

  return (
    <div className="space-y-6 py-2">
      <div className="overflow-x-auto px-1 pb-1 custom-scrollbar">
        <TerminalAsciiBlock
          lines={logoLines}
          className="w-max min-w-full text-[4.5px] leading-[1] text-[#f0b186] sm:text-[5px] md:text-[6px]"
        />
      </div>

      <div className="grid min-h-[460px] items-center gap-7 rounded-xl border border-white/[0.14] bg-white/[0.025] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:px-5 lg:py-5">
        <section className="flex min-w-0 flex-col items-center justify-center overflow-hidden">
          <h2 className="w-full text-center text-[16px] font-semibold text-[#f4f4f4]">Welcome, visitor.</h2>
          <div className="mt-4 flex w-full min-w-0 justify-center overflow-hidden">
              <TerminalAsciiBlock
                lines={portraitLines}
                className="text-[2.8px] leading-[1.0] text-[#f0b186] sm:text-[3.2px] md:text-[3.6px]"
              />
          </div>
          <div className="mt-3 w-full text-center text-[12px] text-white/68">Masaking • Web creator • Kochi, Japan</div>
          <div className="w-full text-center text-[12px] text-white/42">Scroll inside the portrait frame if needed.</div>
        </section>

        <div className="flex min-w-0 flex-col items-center justify-center space-y-4 border-t border-white/[0.1] pt-5 lg:border-l lg:border-t-0 lg:pt-0">
          <section className="w-full max-w-[380px]">
            <h2 className="text-[14px] font-semibold text-[#f0b186]">Overview</h2>
            <p className="mt-2 text-[12px] leading-6 text-white/72">
              Masaking portfolio running in terminal mode. Use slash commands to move between sections without leaving the shell.
            </p>
            <div className="mt-4 space-y-2">
              {CLI_HOME_OVERVIEW_ROWS.map(([label, value]) => (
                <div key={label} className="flex gap-4 text-[12px] leading-6">
                  <span className="min-w-[64px] text-white/36">{label}</span>
                  <span className="text-white/82">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="w-full max-w-[380px] pt-2">
            <h2 className="text-[14px] font-semibold text-[#f0b186]">Navigation</h2>
            <div className="mt-3 space-y-2">
              {CLI_HOME_COMMAND_ROWS.map(([command, description]) => (
                <div key={command} className="flex gap-4 text-[12px] leading-6">
                  <span className="min-w-[64px] text-[#f4f4f4]">{command}</span>
                  <span className="text-white/56">{description}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-[12px] italic text-white/34">Type `help` for launcher commands and `clear` to reset the terminal.</div>
          </section>
        </div>
      </div>
    </div>
  );
}
