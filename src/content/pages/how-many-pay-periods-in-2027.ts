import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'how-many-pay-periods-in-2027',
  group: 'periods',
  order: 20,
  tool: { kind: 'mini:payperiods', props: { y: 2027, w: 5 } },
  mini: { kind: 'mini:perpaycheck', props: { a: 60000, f: 1 } },
  related: ['biweekly-pay-schedule-2027', '27-pay-periods', 'how-many-fridays-in-2027', 'federal-pay-calendar-2027'],
  sources: ['usc6103', 'frbHolidays', 'opmLeaveYear', 'opm27'],
  en: {
    slug: 'how-many-pay-periods-in-2027',
    nav: 'Pay periods in 2027',
    card: 'Year 2027 starts on a Friday: one biweekly Friday series has 27 dates, the other 26. Which one you are on, and what it pays.',
    title: 'Pay Periods in 2027: 26 or 27 Biweekly, 52 or 53 Weekly',
    description: 'Pay periods in 2027: 26 or 27 biweekly paydays depending on your Friday, 53 Fridays for weekly pay, 24 semi-monthly, and the New Year’s Day payday that moves.',
    h1: 'How many pay periods are there in 2027?',
    intro: 'Choose your payday weekday: the counter shows both biweekly series of 2027 and how many dates each one has.',
    resume: (h) => {
      const [s1, s2] = h.pay.biweeklySeries(2027, 5);
      return `Year 2027 begins on a Friday and is not a leap year, so it contains ${h.cal.weekdayCounts(2027)[5]} Fridays and 52 of every other weekday. That single fact sets the pay counts. Weekly pay on Fridays has 53 scheduled paydays, from ${h.md('2027-01-01')} to ${h.md('2027-12-31')}. Biweekly pay on Fridays has ${s1.count} scheduled paydays for the series that starts on ${h.md(s1.first)} and ${s2.count} for the series that starts on ${h.md(s2.first)}; every other weekday gives 26. Semi-monthly pay gives 24 and monthly 12, as always. The 27-date series has a catch: its first payday is New Year’s Day, a federal holiday on which banks are closed. Paid on ${h.day('2026-12-31')}, as most payrolls do, it belongs to 2026, and the series pays ${h.pay.paydays(h.sched({ anchor: s1.first }), 2027).length} times in 2027. Paid on ${h.day('2027-01-04')}, it stays in 2027 and the year counts ${h.pay.paydays(h.sched({ anchor: s1.first, rule: 'after' }), 2027).length}.`;
    },
    faqs: (h) => [
      { q: 'Will 2027 have 27 pay periods?', a: 'For biweekly pay on Fridays, one of the two series has 27 scheduled paydays, from January 1 to December 31, 2027. Whether all 27 are paid in 2027 depends on the New Year’s Day payday: paid early, it falls in December 2026 and leaves 26. Biweekly pay on any other weekday has 26 paydays in 2027.' },
      { q: 'How many Fridays are in 2027?', a: `There are ${h.cal.weekdayCounts(2027)[5]} Fridays in 2027, the first on January 1 and the last on December 31. That is why Friday is the only weekday that can give 53 weekly paydays or 27 biweekly paydays in 2027. Every other weekday occurs 52 times, as in any common year that does not start on it.` },
      { q: 'Do federal employees have 27 pay periods in 2027?', a: `No. Federal pay periods follow the leave year, and leave year 2027 runs from ${h.date(h.ly(2027).start)} to ${h.date(h.ly(2027).end)}: exactly ${h.ly(2027).count} biweekly periods, as the OPM table shows. The last federal leave year with 27 periods was 2023, and none of the leave years published up to 2030 has 27.` },
      { q: 'How much is each paycheck in a 27-payday year?', a: `It depends on the employer. Some divide the annual salary by 26 every year, so a 27th check adds about ${h.pct(1 / 26, 1)} to the year’s gross. Others divide by 27 in that year, so each check is a little smaller and the year totals the same salary. Hourly workers are paid for the hours worked in each period either way.` },
    ],
    body: (h) => {
      const rows = [1, 2, 3, 4, 5].map((w) => { const [a, b] = h.pay.biweeklySeries(2027, w); return [h.cal.WEEKDAYS[w], `${h.md(a.first)}: ${a.count}`, `${h.md(b.first)}: ${b.count}`, String(h.cal.weekdayCounts(2027)[w])]; });
      return `
<h2>Count by weekday</h2>
<p>For each weekday, the table gives the first payday of the two biweekly series of 2027 and how many scheduled dates each has, then the number of weekly paydays. Only Friday reaches 27 and 53, because 2027 starts on a Friday.</p>
${h.table(['Payday', 'Biweekly series A', 'Biweekly series B', 'Weekly'], rows, 'Scheduled paydays in 2027 before any move for a holiday.', ['l', 'l', 'l', 'r'])}
<p>The counts are those of the calendar. A payroll that moves paydays off holidays can push one across the year boundary in either direction. In 2027 the only date where that happens for a weekday series is New Year’s Day, Friday ${h.md('2027-01-01')}. The last Friday of the year, ${h.md('2027-12-31')}, is a federal day off, because New Year’s Day 2028 falls on a Saturday, but the ${h.src('frbHolidays', 'Federal Reserve Banks')} stay open on it, so a payroll that follows the bank calendar pays on that day.</p>

<h2>Calendar year or tax year</h2>
<p>Wages count in the year they are paid. A payday of ${h.md('2027-01-01')} paid on ${h.md('2026-12-31')} is a 2026 wage on the W-2, even though the work it pays was done in December 2026. That is why this site counts paydays by the date the money is paid and lets you choose the holiday rule. For a salaried employee whose employer divides the salary by 26, a year with 27 paydays raises the gross shown on the W-2 by one paycheck, and a year with 25, which can follow, lowers it.</p>
<p>The rule your employer uses is in its pay policy or handbook, and it usually applies to every holiday of the year, not just New Year’s Day. Many pay the business day before a holiday, so the money is never late. Others pay the next business day. Federal law does not decide the direction, and ${h.src('usc6103', '5 U.S.C. 6103')} only fixes the holidays themselves.</p>

<h2>Federal leave year 2027</h2>
<p>For federal employees, the count that matters for leave is the number of pay periods in the leave year, not the paydays in the calendar year. The ${h.src('opmLeaveYear', 'OPM leave year table')} sets leave year 2027 from ${h.day(h.ly(2027).start)} to ${h.day(h.ly(2027).end)}, ${h.ly(2027).count} pay periods. In 2023, a 27-period leave year, OPM’s ${h.src('opm27', 'memorandum CPM 2023-11')} pointed out that most employees still had 26 paydays in the calendar year. The ${h.a('federal-pay-calendar-2027', 'federal pay calendar 2027')} lists every period.</p>

<h2>What one paycheck is worth</h2>
<p>Turning a salary into a paycheck only needs the number of paydays in a standard year: 52, 26, 24 or 12. The mini calculator below divides an annual salary for each frequency, before tax. For a 27-payday year, the ${h.a('biweekly-pay-calculator', 'biweekly pay calculator')} shows both employer methods side by side.</p>
<!--tool:mini:perpaycheck-->
<p>For the full dated list of your 2027 paydays, the ${h.a('biweekly-pay-schedule-2027', 'biweekly schedule')} and the ${h.a('home', 'payroll calendar generator')} build it from any payday you enter, and export it as a calendar file you can open on your phone.</p>
`;
    },
  },
});
