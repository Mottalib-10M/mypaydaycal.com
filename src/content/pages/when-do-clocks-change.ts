import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'when-do-clocks-change',
  group: 'clocks',
  order: 20,
  tool: { kind: 'dst', props: { year: 2027, focus: 'next' } },
  mini: { kind: 'mini:dstdates', props: { y: 2027 } },
  related: ['when-does-daylight-saving-time-end', 'daylight-saving-time-2027', 'daylight-saving-time-night-shift-pay', 'business-days-calculator'],
  sources: ['usc260a', 'nistDst', 'hr139'],
  en: {
    slug: 'when-do-clocks-change',
    nav: 'When clocks change',
    card: 'The next US clock change in either direction, counted down live in your time zone, with spring and fall dates to 2040.',
    title: 'Clocks Change in the US: Next Fall Back and Spring Forward',
    description: 'Clocks change in the US twice a year at 2 a.m.: spring forward in March, fall back in November. Live countdown to the next change and the dates up to 2040.',
    h1: 'When do the clocks change next?',
    intro: 'The countdown always points at the next change, forward or back, in your own time zone; pick a year to see both of its dates.',
    resume: (h) => `US clocks change twice a year, both times on a Sunday at 2:00 a.m. local time. On the second Sunday of March they spring forward one hour, from 2 a.m. straight to 3 a.m., which starts daylight saving time; on the first Sunday of November they fall back one hour, from 2 a.m. to 1 a.m., which ends it. The next change after ${h.date(h.P.retrieved_at)}, the day these pages were last checked, is the fall back of ${h.day(h.dst.nextChange(h.P.retrieved_at).date)}; the one after that is the spring forward of ${h.day(h.dst.dstStart(2027))}. A handy way to remember the direction is the old phrase “spring forward, fall back”. The dates are set by ${h.src('usc260a', '15 U.S.C. 260a')}, as amended in 2005 with effect in 2007, which made daylight time last about eight months a year: in 2027 it runs for ${h.cal.daysBetween(h.dst.dstStart(2027), h.dst.dstEnd(2027))} days. Hawaii, most of Arizona and the territories do not change their clocks at all.`,
    faqs: (h) => [
      { q: 'Do clocks go forward or back in March?', a: 'Forward. On the second Sunday of March, clocks jump from 2 a.m. to 3 a.m., so the night is one hour shorter and you lose an hour of sleep. Evenings get lighter by the clock from that day. The phrase “spring forward, fall back” gives the direction for both changes.' },
      { q: 'Why do clocks change at 2 a.m.?', a: 'Federal law fixes the change at 2 a.m. local time because it is late enough not to split the evening into two dates and early enough to finish before most people start work on Sunday. Few trains or flights are scheduled at that hour, which keeps timetables simpler. Each time zone changes at its own 2 a.m.' },
      { q: 'Do my phone and computer change on their own?', a: 'Yes, if they are set to update the time automatically and to your local time zone. They follow the rules built into their operating system, which match federal law. Older devices whose software has not been updated since 2007 may still change on the old dates, in April and late October; check them by hand.' },
    ],
    body: (h) => {
      const rows = Array.from({ length: 6 }, (_, i) => 2026 + i).map((y) => [String(y), h.md(h.dst.dstStart(y)), h.md(h.dst.dstEnd(y)), String(h.cal.daysBetween(h.dst.dstStart(y), h.dst.dstEnd(y)))]);
      return `
<h2>Clock change calendar</h2>
<p>The second Sunday of March falls between the 8th and the 14th, the first Sunday of November between the 1st and the 7th. The table gives the next years; the mini tool below goes as far as 2040.</p>
${h.table(['Year', 'Spring forward', 'Fall back', 'Days of daylight time'], rows, `Dates computed from ${h.src('usc260a', '15 U.S.C. 260a')}; all changes at 2 a.m. local time.`, ['l', 'l', 'l', 'r'])}
<!--tool:mini:dstdates-->

<h2>How the rule came to be</h2>
<p>The Uniform Time Act of 1966 set national dates for daylight saving time and let states opt out. The dates moved several times; the current ones come from the Energy Policy Act of 2005, which extended daylight time by about four weeks from 2007: it now starts three weeks earlier in March and ends one week later in November. The ${h.src('nistDst', 'NIST page on daylight saving time')} summarizes the rule and its history, and it is NIST’s time service that many network clocks read.</p>
<p>The law lets a state stay on standard time all year, but not on daylight time all year. That is why the many state laws passed in recent years to adopt permanent daylight time only take effect if Congress allows it. In 2026 the House passed such a change, H.R. 139, as the ${h.src('hr139', 'roll call')} records; the Senate has not voted on it, so the clocks still change on the dates above.</p>

<h2>Living with the change</h2>
<p>The spring change is the harder one: a lost hour of sleep on a Sunday night, followed by a Monday morning in the dark. Moving bedtime fifteen minutes earlier on each of the few nights before helps. The fall change gives an hour back, but evenings grow dark about an hour earlier by the clock, which affects commutes. Medication taken at fixed hours, timers, and schedules shared across time zones are worth a check on both weekends.</p>
<p>At work, the change only matters for those on duty at 2 a.m.: a night shift is an hour shorter in March and an hour longer in November, and the ${h.a('daylight-saving-time-night-shift-pay', 'night shift pay page')} shows how those hours are paid. For a countdown that always points at November, see the ${h.a('when-does-daylight-saving-time-end', 'end of daylight saving time')}; for next year’s dates and what to plan around them, the ${h.a('daylight-saving-time-2027', '2027 page')}.</p>

<h2>Time zones that stay put</h2>
<p>Arizona stays on Mountain Standard Time all year, except the Navajo Nation, which observes daylight time. Hawaii stays on Hawaii-Aleutian Standard Time. Puerto Rico and the U.S. Virgin Islands stay on Atlantic Standard Time, Guam on Chamorro Standard Time, American Samoa on Samoa Standard Time. In summer, Phoenix keeps the same clock time as Los Angeles; in winter, the same as Denver. Anyone who schedules calls or deliveries across those zones sees the gap change twice a year, on the very dates in the table above.</p>
`;
    },
  },
});
