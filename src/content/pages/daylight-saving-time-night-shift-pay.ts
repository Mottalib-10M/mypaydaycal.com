import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'daylight-saving-time-night-shift-pay',
  group: 'clocks',
  order: 40,
  tool: { kind: 'shift', props: { kind: 'fall', year: 2026 } },
  mini: { kind: 'mini:dstdates', props: { y: 2027 } },
  related: ['when-does-daylight-saving-time-end', 'daylight-saving-time-2027', 'biweekly-pay-calculator', 'when-do-clocks-change'],
  sources: ['dolDst', 'cfr778104', 'cfr778106', 'usc260a'],
  en: {
    slug: 'daylight-saving-time-night-shift-pay',
    nav: 'Night shift and the clock change',
    card: 'An overnight shift is one hour longer when clocks fall back and one hour shorter in spring: the hours, the overtime and the pay.',
    title: 'Night Shift Pay at the Clock Change: 7 or 9 Hours Worked',
    description: 'Night shift pay when clocks change: a shift across 2 a.m. works 9 hours in fall and 7 in spring. Hours worked, overtime over 40 and the week’s gross pay.',
    h1: 'Night shift pay when the clocks change',
    intro: 'Enter your shift, break, the other hours of the week and your rate: the calculator gives the hours actually worked on the change night and the week’s pay.',
    resume: (h) => `A night shift that is on duty at 2 a.m. on a clock change night does not last the hours printed on the schedule. When clocks fall back, on ${h.day(h.dst.dstEnd(2026))}, the hour from 1 a.m. to 2 a.m. is worked twice, so a shift from 11 p.m. to 7:30 a.m. with a 30-minute unpaid break, eight hours on any other night, is nine hours of work. When clocks spring forward, on ${h.day(h.dst.dstStart(2027))}, the hour from 2 a.m. to 3 a.m. does not exist, and the same shift is seven hours. The Department of Labor’s ${h.src('dolDst', 'Hours Worked Advisor')} uses exactly this example and states the rule: employees must be credited with all hours actually worked. The extra hour in November is paid like any other, and for an hourly worker who is not exempt from overtime it can tip the workweek over 40 hours. Federal law counts overtime week by week, so that hour is paid at one and a half times the regular rate if the week already holds 32 hours plus the 9-hour night. The hour lost in March is simply not worked, and an employer may pay or not pay it.`,
    faqs: (h) => [
      { q: 'Do I get paid for the extra hour when the clocks go back?', a: 'Yes, if you work it. The Department of Labor counts the hours actually worked, so a night shift on duty when 2 a.m. becomes 1 a.m. works, and is paid, one more hour. If that hour brings your workweek above 40 hours and you are not exempt, it is paid at time and a half.' },
      { q: 'Is my paycheck smaller after the spring clock change?', a: `It can be, by one hour, if you are paid by the hour and on duty at 2 a.m. on ${h.date(h.dst.dstStart(2027))}, since that hour is not worked. Some employers pay the scheduled hours anyway as a policy or under a union contract. Salaried employees are paid their salary either way.` },
      { q: 'Can my employer make me clock out an hour early in November?', a: 'An employer can schedule the shift to end at the usual clock time, which gives nine hours of work, or end it an hour earlier by the clock, which keeps it at eight. What it cannot do is have you work the extra hour without pay. The timekeeping record should show the real hours.' },
    ],
    body: (h) => `
<h2>The Department of Labor rule</h2>
<p>The ${h.src('dolDst', 'Hours Worked Advisor of the Department of Labor')} answers the question directly with an overnight shift from 11 p.m. to 7:30 a.m. with a 30-minute meal break. On a normal night it is eight hours of work. On the night daylight saving time begins, it is seven hours, and the employer has to pay for seven. On the night it ends, it is nine hours, and the employer has to pay for nine. The principle behind the example is the general one of the Fair Labor Standards Act: all hours actually worked must be counted, and the clock on the wall does not change that.</p>
<p>The calculator applies the same reasoning to any start time, end time and break. It checks whether the shift is on duty at 2 a.m., adds one hour in fall or takes one away in spring, then adds the hours of the rest of your workweek.</p>

<h2>When the extra hour becomes overtime</h2>
<p>Overtime under federal law is counted per workweek of seven consecutive days, and ${h.src('cfr778104', 'each workweek stands alone')}: hours above 40 in one week are not offset by a short week before or after. The fall change night falls on a Saturday to Sunday, so it belongs to whichever workweek your employer has fixed; with a Sunday to Saturday workweek, the hours after midnight count in the new week. A worker with four other eight-hour shifts in the week works 32 plus 9, which is 41 hours, and one of them is paid at time and a half.</p>
${h.table(['Case', 'Hours that night', 'Week total', 'Overtime hours'], [['Ordinary night', '8', '40', '0'], ['Clocks fall back', '9', '41', '1'], ['Clocks spring forward', '7', '39', '0']].map((r) => r), 'Four other 8-hour shifts in the workweek, shift from 11 p.m. to 7:30 a.m. with a 30-minute unpaid break.', ['l', 'r', 'r', 'r'])}
<p>The overtime must be paid on the regular payday for the period in which the workweek ends, or as soon after it as the hours can be computed, under ${h.src('cfr778106', '29 CFR 778.106')}. Some states add daily overtime after eight hours in a day; there the ninth hour of the fall night is overtime on its own. The calculator shows the federal weekly rule only.</p>

<h2>The spring night</h2>
<p>In spring the shift loses an hour. Federal law does not require pay for hours not worked, so an hourly worker paid strictly by the clock earns one hour less that week. Many employers, hospitals and plants among them, pay the scheduled hours anyway, by policy or under a collective agreement; others offer to extend the shift by an hour. The useful step is to read your employer’s policy before the change night, which falls on ${h.day(h.dst.dstStart(2027))} next.</p>
<!--tool:mini:dstdates-->

<h2>Recording the hours</h2>
<p>Timekeeping systems that store time in local clock time can misread the change night, showing seven hours in fall and nine in spring, the reverse of the truth, when they subtract the start time from the end time. Systems that store time with the offset or in universal time get it right. If your timecard for the change night shows the scheduled hours rather than the hours worked, it is worth asking payroll to check, because the federal clock change dates come from ${h.src('usc260a', '15 U.S.C. 260a')} and are known years in advance. The ${h.a('when-does-daylight-saving-time-end', 'countdown to the fall change')} and the ${h.a('daylight-saving-time-2027', '2027 dates')} help to plan the rosters.</p>
`,
  },
});
