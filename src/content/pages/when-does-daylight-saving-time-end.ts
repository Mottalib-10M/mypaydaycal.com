import { definePage } from '../../lib/guide-types';
import { dstEnd } from '../../lib/engine/dst';
import { longDate } from '../../lib/engine/calendar';

const END = longDate(dstEnd(2026), { weekday: false });

export default definePage({
  id: 'when-does-daylight-saving-time-end',
  group: 'clocks',
  order: 10,
  tool: { kind: 'dst', props: { year: 2026, focus: 'fall' } },
  mini: { kind: 'mini:shiftnight', props: { h: 8, k: 1 } },
  related: ['when-do-clocks-change', 'daylight-saving-time-2027', 'daylight-saving-time-night-shift-pay', 'home'],
  sources: ['usc260a', 'nistDst', 'hr139', 'dolDst'],
  en: {
    slug: 'when-does-daylight-saving-time-end',
    nav: 'Daylight saving time ends',
    card: `Clocks fall back at 2 a.m. on ${END}: a live countdown in your time zone, who changes and what it does to a night shift.`,
    title: `Daylight Saving Time Ends ${END}: Fall Back`,
    description: `Daylight saving time ends at 2 a.m. on ${END}: clocks fall back one hour. Live countdown in your time zone, the states that skip it and the 2027 date.`,
    h1: 'When does daylight saving time end in 2026?',
    intro: 'The countdown runs on your own clock and time zone: it shows the time left until 2 a.m. on the Sunday the clocks go back.',
    resume: (h) => {
      const e = h.dst.dstEnd(2026);
      return `Daylight saving time ends at 2:00 a.m. local time on ${h.day(e)}. At that moment clocks go back one hour to 1:00 a.m. standard time, so the night of Saturday to Sunday is 25 hours long and the hour from 1 a.m. to 2 a.m. happens twice. The date comes from federal law: ${h.src('usc260a', '15 U.S.C. 260a')} sets daylight time from 2 a.m. on the second Sunday of March to 2 a.m. on the first Sunday of November, a rule in force since 2007. Each time zone changes at its own 2 a.m., so the switch moves across the country over several hours, starting in the East. Hawaii and most of Arizona stay on standard time all year, as do Puerto Rico, Guam, the U.S. Virgin Islands and American Samoa, so their clocks do not move. Phones and computers change on their own; wall clocks, ovens and car clocks need a hand. In 2027 the clocks fall back on ${h.day(h.dst.dstEnd(2027))}, and they spring forward next on ${h.day(h.dst.dstStart(2027))}.`;
    },
    faqs: (h) => [
      { q: 'Do we gain or lose an hour when daylight saving time ends?', a: 'You gain one. At 2 a.m. the clocks go back to 1 a.m., so the night has an extra hour and the morning feels earlier. Sunrise and sunset both come about an hour earlier by the clock the next day, which is why evenings suddenly feel dark in November.' },
      { q: 'Is daylight saving time ending for good?', a: `Not as of ${h.date(h.P.retrieved_at)}. The House passed the Sunshine Protection Act, H.R. 139, on ${h.date(h.P.dst.bill.housePassed)}, by 308 votes to 117, to make daylight time permanent. The Senate referred it to its commerce committee on ${h.date(h.P.dst.bill.senateReferred)}. Until both chambers pass it and it is signed, clocks change as usual.` },
      { q: 'Which states do not fall back?', a: 'Hawaii and Arizona, except the Navajo Nation in Arizona, do not use daylight saving time, so they have nothing to fall back from. The same goes for Puerto Rico, Guam, the U.S. Virgin Islands and American Samoa. Their clocks stay put while the rest of the country moves one hour back.' },
      { q: 'What time does the clock change happen?', a: 'At 2:00 a.m. local time in each time zone, on the first Sunday of November. New York changes first, then Chicago an hour later in absolute time, then Denver, Los Angeles, Anchorage. Connected devices switch on their own; set manual clocks back one hour before bed on Saturday night.' },
    ],
    body: (h) => {
      const rows = [2026, 2027, 2028, 2029, 2030].map((y) => [String(y), h.day(h.dst.dstStart(y)), h.day(h.dst.dstEnd(y))]);
      return `
<h2>Clock change dates, 2026 to 2030</h2>
<p>The rule is simple to compute: second Sunday of March, first Sunday of November. The table applies it year by year, and the ${h.src('nistDst', 'National Institute of Standards and Technology')} publishes the same rule with its own list of dates.</p>
${h.table(['Year', 'Clocks spring forward', 'Clocks fall back'], rows, `Daylight saving time under ${h.src('usc260a', '15 U.S.C. 260a')}, at 2 a.m. local time.`, ['l', 'l', 'l'])}

<h2>Where the clocks do not change</h2>
<p>A state may exempt itself from daylight saving time by law, the whole state at once, under the same section of the U.S. Code. Hawaii and Arizona have done so. The Navajo Nation, which reaches into Arizona, Utah and New Mexico, keeps daylight time across its territory, so in summer it runs one hour ahead of the rest of Arizona. The territories in the Caribbean and the Pacific stay on standard time too. The countdown above reads the time zone of your device and tells you whether it changes; if it does not, it still shows the date when the rest of the country does, which shifts your time difference with other states by one hour.</p>

<h2>What changes at work and on payday</h2>
<p>For most people the change is a longer Sunday night. For people on duty at 2 a.m., it is an extra hour of work. The ${h.src('dolDst', 'Department of Labor’s Hours Worked Advisor')} says that the hours actually worked must be counted: a shift scheduled from 11 p.m. to 7:30 a.m. with a 30-minute break is eight hours most nights and nine on the night the clocks fall back. That hour is paid, and it can push the week over 40 hours, which turns it into overtime for workers who are not exempt. The mini tool below gives the hours worked for any shift length; the ${h.a('daylight-saving-time-night-shift-pay', 'night shift page')} adds the week and the pay.</p>
<!--tool:mini:shiftnight-->

<h2>Will the clocks stop changing?</h2>
<p>Congress has debated permanent daylight time for years. In 2026 the House of Representatives passed H.R. 139, the Sunshine Protection Act, by 308 votes to 117, the ${h.src('hr139', 'roll call of July 14, 2026')} shows. The bill went to the Senate, where it was referred to the Committee on Commerce, Science, and Transportation on ${h.date(h.P.dst.bill.senateReferred)}. It is not law, and federal law still sets the clock change dates above. Even if it passes, it would take effect on a date fixed in the bill, and the dates on this page would then change. This site reads the status again when the bill moves and updates the countdown.</p>
<p>Until then, every November brings the same routine: the ${h.a('when-do-clocks-change', 'clock change page')} counts down to the next switch in either direction, and the ${h.a('daylight-saving-time-2027', '2027 page')} gives next year’s dates.</p>
`;
    },
  },
});
