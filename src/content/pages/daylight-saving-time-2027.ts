import { definePage } from '../../lib/guide-types';
import { dstStart, dstEnd } from '../../lib/engine/dst';
import { longDate } from '../../lib/engine/calendar';

const A = longDate(dstStart(2027), { weekday: false, year: false });
const B = longDate(dstEnd(2027), { weekday: false, year: false });

export default definePage({
  id: 'daylight-saving-time-2027',
  group: 'clocks',
  order: 30,
  tool: { kind: 'dst', props: { year: 2027, focus: 'next' } },
  mini: { kind: 'mini:dstdates', props: { y: 2028 } },
  related: ['when-do-clocks-change', 'when-does-daylight-saving-time-end', 'payroll-calendar-2028', 'daylight-saving-time-night-shift-pay'],
  sources: ['usc260a', 'nistDst', 'hr139', 'cfr778104'],
  en: {
    slug: 'daylight-saving-time-2027',
    nav: 'Daylight saving time 2027',
    card: `Clocks spring forward on ${A}, 2027 and fall back on ${B}, 2027: the dates, the countdown and what could change them.`,
    title: `Daylight Saving Time 2027: ${A} to ${B} Dates`,
    description: `Daylight saving time 2027 starts at 2 a.m. on ${A} and ends at 2 a.m. on ${B}. Countdown in your time zone, 2028 dates and the bill that could end it.`,
    h1: 'Daylight saving time 2027: start and end dates',
    intro: 'Choose a year to see its two clock changes; the countdown above them always points at the next one, in your own time zone.',
    resume: (h) => {
      const a = h.dst.dstStart(2027), b = h.dst.dstEnd(2027);
      return `In 2027, daylight saving time starts at 2:00 a.m. on ${h.day(a)}, when clocks spring forward to 3:00 a.m., and ends at 2:00 a.m. on ${h.day(b)}, when they fall back to 1:00 a.m. That is the latest possible start, because the second Sunday of March can fall no later than the 14th, and the latest possible end, because the first Sunday of November can fall no later than the 7th; daylight time lasts ${h.cal.daysBetween(a, b)} days. Both dates follow from ${h.src('usc260a', '15 U.S.C. 260a')} and will hold unless Congress changes the law before then. One bill that would do so, the Sunshine Protection Act, H.R. 139, passed the House in July 2026 and is waiting in the Senate. If it became law, the clocks would spring forward one last time and stay on daylight time. For planning, the 2027 changes fall on the nights of Saturday ${h.md(h.cal.addDays(a, -1))} to Sunday ${h.md(a)} and Saturday ${h.md(h.cal.addDays(b, -1))} to Sunday ${h.md(b)}, the first one hour shorter and the second one hour longer for anyone on duty.`;
    },
    faqs: (h) => [
      { q: 'What day does daylight saving time start in 2027?', a: `${h.day(h.dst.dstStart(2027))}, at 2 a.m. local time. Clocks move forward one hour to 3 a.m. It is the second Sunday of March, as federal law requires, and the latest date that rule can produce, so 2027 has one of the shortest stretches of standard time in early spring.` },
      { q: 'Is 2027 the last year of clock changes?', a: `Not unless Congress passes a law. The House approved H.R. 139 on ${h.date(h.P.dst.bill.housePassed)}, and the Senate referred it to committee the next day. Until the Senate passes the same text and it is signed, both 2027 changes stay on the calendar. Any new law would also set its own effective date.` },
      { q: 'When does daylight saving time start and end in 2028?', a: `In 2028 the clocks spring forward on ${h.day(h.dst.dstStart(2028))} and fall back on ${h.day(h.dst.dstEnd(2028))}, both at 2 a.m. local time. The mini tool on this page gives the dates of any year up to 2040, computed from the same rule.` },
    ],
    body: (h) => {
      const a = h.dst.dstStart(2027), b = h.dst.dstEnd(2027);
      return `
<h2>The 2027 dates in context</h2>
<p>Because 2027 starts on a Friday, its Sundays fall on the 3rd, 10th, 17th and so on in January, and the rule gives the latest dates it can: ${h.md(a)} and ${h.md(b)}. In 2026 the changes came on ${h.md(h.dst.dstStart(2026))} and ${h.md(h.dst.dstEnd(2026))}, the earliest possible dates, so the two years bracket the range. The ${h.src('nistDst', 'NIST summary of the rule')} gives the same days.</p>
${h.table(['Year', 'Starts', 'Ends', 'Days'], [2026, 2027, 2028].map((y) => [String(y), h.day(h.dst.dstStart(y)), h.day(h.dst.dstEnd(y)), String(h.cal.daysBetween(h.dst.dstStart(y), h.dst.dstEnd(y)))]), 'Daylight saving time in 2026, 2027 and 2028.', ['l', 'l', 'l', 'r'])}
<p>The fall change of 2027 comes on the weekend after Halloween, which is a Sunday that year, so trick-or-treating still happens on daylight time. The mini tool below gives the dates of any year to 2040.</p>
<!--tool:mini:dstdates-->

<h2>What the Sunshine Protection Act would change</h2>
<p>H.R. 139 would make daylight saving time the permanent standard time in the states that observe it. The House passed it on ${h.date(h.P.dst.bill.housePassed)} by 308 votes to 117, according to the ${h.src('hr139', 'Clerk’s roll call')}, and the Senate referred it to its commerce committee on ${h.date(h.P.dst.bill.senateReferred)}. A vote in one chamber is not a law: the Senate has to pass the same text and the President has to sign it. If the bill passes, the date it takes effect is set in its text; states that now stay on standard time, such as Hawaii and Arizona, would keep their choice. This page will show the change as soon as it is law.</p>

<h2>Planning work around the 2027 changes</h2>
<p>For employers, the two nights matter for anyone working at 2 a.m. On ${h.dayNoYear(a)} a shift that spans the change is one hour shorter, and on ${h.dayNoYear(b)} one hour longer. Hours worked are counted as worked, and ${h.src('cfr778104', 'each workweek stands alone')} for overtime, so a fall shift can push a 40-hour week into overtime while the spring shift can leave a week one hour short. The ${h.a('daylight-saving-time-night-shift-pay', 'night shift page')} computes both cases, and payroll staff can mark the two weekends in the ${h.a('payroll-calendar-2028', 'payroll calendars')} they publish.</p>
<p>For everyone else, the practical list is short: clocks without automatic updates, recurring alarms, medication schedules, and meetings set with people in Arizona or Hawaii, where the time difference changes by an hour on each date. Calendar apps handle the change for events stored with a time zone; events typed as floating times may shift.</p>

<h2>Countdown and time zone</h2>
<p>The countdown at the top uses your device’s clock and time zone, nothing else, and nothing is sent anywhere. Each zone changes at its own 2 a.m., so the switch reaches New York first and Honolulu never. Between now and ${h.date(a)}, the countdown points at the November change of 2026 first, then at the March change of 2027; the ${h.a('when-does-daylight-saving-time-end', 'fall back page')} keeps its countdown on November.</p>
`;
    },
  },
});
