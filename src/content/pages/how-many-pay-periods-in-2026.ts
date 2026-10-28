import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'how-many-pay-periods-in-2026',
  group: 'periods',
  order: 10,
  tool: { kind: 'mini:payperiods', props: { y: 2026, w: 5 } },
  mini: { kind: 'payroll', props: { year: 2026, anchor: '2026-01-02', years: [2026, 2027] } },
  related: ['how-many-pay-periods-in-2027', 'payroll-calendar-2026', '27-pay-periods', 'federal-pay-calendar-2026'],
  sources: ['opmLeaveYear', 'usc6103', 'frbHolidays'],
  en: {
    slug: 'how-many-pay-periods-in-2026',
    nav: 'Pay periods in 2026',
    card: 'Weekly 52 or 53, biweekly 26 or 27, semi-monthly 24, monthly 12: the 2026 count for your payday, holidays included.',
    title: 'Pay Periods in 2026: 26, 27, 52 or 53 for Your Payday',
    description: 'Pay periods in 2026 by frequency and payday: 52 or 53 weekly, 26 or 27 biweekly, 24 semi-monthly, 12 monthly, and why a New Year’s Day payday can add a check.',
    h1: 'How many pay periods are there in 2026?',
    intro: 'Pick the year and your payday: the counter gives the number of biweekly paydays for both series of that weekday.',
    resume: (h) => {
      const c = h.cal.weekdayCounts(2026);
      const a = h.sched({ anchor: '2026-01-02' });
      return `Year 2026 has 52 scheduled weekly paydays for most weekdays and 53 for a Thursday payday, because the year starts and ends on a Thursday and holds ${c[4]} Thursdays against ${c[5]} Fridays. A biweekly payroll has 26 pay periods in 2026 whatever its weekday, with one exception on the calendar: a Thursday series that starts on ${h.day('2026-01-01')} has 27 dates, the first of them New Year’s Day. There is a second exception that comes from the holidays rather than the calendar. A Friday series paid on ${h.md('2026-01-02')} has its 27th date on ${h.day('2027-01-01')}; banks are closed, and a payroll that pays the business day before puts it on ${h.day(h.pay.paydays(a, 2026).at(-1)!.paid)}. Counted by the date the money arrives, which is what a W-2 counts, that schedule pays ${h.pay.paydays(a, 2026).length} times in 2026. Semi-monthly pay gives 24 periods and monthly pay 12, every year. The counter above checks any weekday and year.`;
    },
    faqs: (h) => [
      { q: 'How many biweekly paychecks will I get in 2026?', a: 'Twenty-six for most people paid every other week. You get 27 only if your schedule has a payday on January 1, 2026, which is a Thursday and a holiday, or if your Friday payday of January 1, 2027 is paid early, on December 31, 2026. Check your first payday of January to know which case is yours.' },
      { q: 'How many weekly pay periods are there in 2026?', a: `On the calendar, 52 scheduled paydays for a Monday, Tuesday, Wednesday or Friday payroll and 53 for a Thursday one, since 2026 contains ${h.cal.weekdayCounts(2026)[4]} Thursdays. A Friday payroll that pays New Year’s Day 2027 early, on December 31, adds a 53rd payday to 2026. Weekly periods counted by their Saturday end date number 52.` },
      { q: 'Is a pay period the same thing as a payday?', a: 'No. A pay period is the span of days whose work is paid together, and the payday comes after it ends, often a few days to a week later. A pay period that runs over New Year can be paid in January, which is why counts by period and counts by payday can differ by one in the same year.' },
    ],
    body: (h) => {
      const rows = (['weekly', 'biweekly', 'semimonthly', 'monthly'] as const).map((f) => {
        const s = h.sched({ freq: f, anchor: f === 'weekly' ? '2026-01-02' : '2026-01-09' });
        return [h.pay.FREQ_LABEL[f], String(h.pay.PERIODS[f]), String(h.pay.paydays(s, 2026).length)];
      });
      return `
<h2>The count for each frequency</h2>
<p>The table gives the standard number of periods in a year, the divisor most payrolls use to split a salary, and the number of paydays a typical Friday or fixed-date schedule actually has in 2026, after moving dates off weekends and bank holidays.</p>
${h.table(['Frequency', 'Standard periods', 'Paydays in 2026'], rows, 'Weekly and biweekly on Fridays (biweekly from January 9), semi-monthly on the 15th and last day, monthly on the last day; bank holidays from the Federal Reserve schedule.', ['l', 'r', 'r'])}
<p>The weekly row counts ${h.pay.paydays(h.sched({ freq: 'weekly', anchor: '2026-01-02' }), 2026).length} paydays for a Friday payroll, although 2026 has ${h.cal.weekdayCounts(2026)[5]} Fridays. Christmas Day, ${h.day('2026-12-25')}, is paid a day early and stays in the year; the extra one is ${h.day('2027-01-01')}, New Year’s Day, paid on ${h.dayNoYear('2026-12-31')} when the payroll pays the business day before. A Thursday weekly payroll meets ${h.cal.weekdayCounts(2026)[4]} Thursdays, the first being New Year’s Day 2026, so its count depends on the holiday rule in the same way.</p>

<h2>Why the count changes from year to year</h2>
<p>A year is 52 weeks and one day, two in a leap year. Every weekday therefore occurs 52 times, and the weekday of January 1 occurs 53 times; in a leap year the weekday of January 2 does too. A weekly payroll on that weekday gets a 53rd payday. A biweekly payroll covers two weeks per period, so it needs the extra day to fall exactly on one of its paydays: for 2026 that is a Thursday series beginning on New Year’s Day, the only weekday series with 27 dates that year.</p>
<p>Holidays can shift a payday across the year boundary, which adds or removes one. Moving a payday from January 1 to December 31 gives the old year an extra check and the new year one fewer. Under ${h.src('usc6103', '5 U.S.C. 6103')}, January 1 is always a holiday, and the ${h.src('frbHolidays', 'Federal Reserve Banks')} close on it whenever it falls on a weekday. That is why the year boundary is where pay counts get interesting, and why this site counts paydays by the date they are paid.</p>

<h2>Federal employees in 2026</h2>
<p>Federal pay periods are counted by leave year, not by calendar year. Leave year 2026 runs from ${h.day(h.ly(2026).start)} to ${h.day(h.ly(2026).end)}, as the ${h.src('opmLeaveYear', 'OPM table of leave years')} shows, and holds ${h.ly(2026).count} biweekly pay periods. The next leave year with 27 periods is not in the published table, which runs to 2030; the last one was 2023. The ${h.a('federal-pay-calendar-2026', 'federal pay calendar 2026')} dates each period.</p>

<h2>Checking your own count</h2>
<p>Your pay stub or payroll portal gives the date of your first payday of the year. Enter it in the calendar under the summary at the top of this page, which counts paydays by the date they are paid, the way they appear on your W-2. If your employer pays early when a payday falls on a holiday, keep the default rule; if it pays late, choose “Pay the next business day” and watch the New Year’s payday cross into the next year.</p>
<!--tool:mini:years27-->
<p>The finder above lists the next years in which a biweekly series on your weekday has 27 scheduled dates. For the year after, the ${h.a('how-many-pay-periods-in-2027', 'pay periods 2027 page')} shows the Friday series that gives 27 scheduled paydays, and the ${h.a('27-pay-periods', '27 pay periods page')} explains what an extra check does to a salary.</p>
`;
    },
  },
});
