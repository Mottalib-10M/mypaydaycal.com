import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'federal-pay-calendar-2027',
  group: 'banking',
  order: 10,
  tool: { kind: 'fedpp', props: { year: 2027, date: '2027-07-04' } },
  mini: { kind: 'mini:fedbiweekly', props: { a: 75000 } },
  related: ['federal-pay-calendar-2026', 'how-many-pay-periods-in-2027', '27-pay-periods', 'direct-deposit-holidays'],
  sources: ['opmLeaveYear', 'nfc2027', 'opmHolidays', 'usc5504', 'opm27'],
  demarche: true,
  en: {
    slug: 'federal-pay-calendar-2027',
    nav: 'Federal pay calendar 2027',
    card: 'The 26 federal pay periods of leave year 2027, Sunday to Saturday, the holidays inside them and the use-or-lose date.',
    title: 'Federal Pay Calendar 2027: All 26 Pay Periods, Dated',
    description: 'Federal pay calendar 2027: the 26 biweekly pay periods of leave year 2027 from January 10, the holidays in each, the use-or-lose date and how pay is computed.',
    h1: 'Federal pay calendar 2027: every pay period',
    intro: 'Pick the leave year and a date: the calendar lists the federal pay periods and shows which one contains that date.',
    resume: (h) => {
      const l = h.ly(2027);
      return `Federal employees are paid on a biweekly schedule in which each pay period runs two weeks, from a Sunday to the second Saturday after it. The pay periods are numbered within the leave year, which begins on the first day of the first full pay period of the calendar year. For 2027, the ${h.src('opmLeaveYear', 'OPM leave year table')} sets the start on ${h.day(l.start)} and the end on ${h.day(l.end)}: ${l.count} pay periods, the first from ${h.md(l.periods[0].start)} to ${h.md(l.periods[0].end)} and the last from ${h.md(l.periods[l.count - 1].start)} to ${h.date(l.periods[l.count - 1].end)}, the same dates shown on the ${h.src('nfc2027', 'National Finance Center calendar for 2027')}. Annual leave above the carryover limit is forfeited at the end of the leave year unless it was scheduled in advance, and the date by which it must be scheduled in 2027 is ${h.day(l.useOrLose!)}. Paydays are not on this calendar: each payroll provider pays a few days after the period closes and publishes its own pay dates.`;
    },
    faqs: (h) => [
      { q: 'When is federal payday in 2027?', a: 'Federal paydays are set by the payroll provider that serves your agency, such as the National Finance Center, the Defense Finance and Accounting Service, the Interior Business Center or GSA. They pay a few days after each pay period ends, usually within the following week. Your provider’s own calendar and your earnings statement give the exact date for each period.' },
      { q: 'Does leave year 2027 have 27 pay periods?', a: `No. Leave year 2027 runs from ${h.date(h.ly(2027).start)} to ${h.date(h.ly(2027).end)}, exactly 26 two-week periods. A leave year has 27 periods only when the first full pay period of the next year starts 378 days after the current one; the last time was 2023, and the OPM table up to 2030 shows none.` },
      { q: 'What is the use-or-lose date for 2027?', a: `It is ${h.date(h.ly(2027).useOrLose!)}, the Saturday before the third pay period from the end of the leave year begins. Annual leave above your carryover ceiling, usually ${h.P.federalPay.carryoverHours} hours, must be scheduled in writing by that date to be restored if an exigency or illness later prevents you from taking it.` },
    ],
    body: (h) => {
      const l = h.ly(2027);
      const hol = h.cal.holidaysInYear(2027, 'federal').concat(h.cal.holidaysInYear(2028, 'federal')).filter((x) => x.date >= l.start && x.date <= l.end);
      const rows = hol.map((x) => { const p = h.fed.periodOf(x.date)!; return [x.name, h.day(x.date), `PP ${String(p.period.n).padStart(2, '0')}`]; });
      return `
<h2>Holidays inside the 2027 pay periods</h2>
<p>A holiday that falls in a pay period gives federal employees eight hours of holiday pay instead of work, and timekeepers code it in that period. The table matches each federal day off of leave year 2027, from the ${h.src('opmHolidays', 'OPM holiday tables')}, with its pay period.</p>
${h.table(['Holiday', 'Day off', 'Pay period'], rows, `Federal days off between ${h.date(l.start)} and ${h.date(l.end)}.`, ['l', 'l', 'l'])}
<p>New Year’s Day 2027 falls on ${h.day('2027-01-01')}, before the leave year starts, so it belongs to the last pay period of leave year 2026. New Year’s Day 2028 is a Saturday; its day off, ${h.day('2027-12-31')}, falls in the last pay period of leave year 2027.</p>

<h2>How federal biweekly pay is computed</h2>
<p>The pay of a federal employee for a pay period does not depend on the number of paydays in the year. Under ${h.src('usc5504', '5 U.S.C. 5504')}, the hourly rate is the annual rate of basic pay divided by 2,087 hours and rounded to the nearest cent, and a full-time biweekly paycheck is that rate times 80 hours. The converter below applies the rule to any annual rate; locality pay is already included in the rate shown on your notification of personnel action.</p>
<!--tool:mini:fedbiweekly-->
<p>The 2,087 figure is the average number of paid hours in a year over a 28-year cycle, which is why it is a little more than 52 weeks of 40 hours. Because pay is computed per period, a 27-period leave year, like 2023, pays 27 periods without any change to the biweekly amount. OPM’s ${h.src('opm27', 'memorandum on the 2023 case')} explains how leave accrual and pay caps were handled that year.</p>

<h2>Where to find your pay dates</h2>
<p>This site lists pay periods from OPM’s leave year dates; it does not publish federal paydays, because they are set by each payroll provider and differ between them. The ${h.src('nfc2027', 'National Finance Center calendar')} shows the 2027 pay periods for the agencies it serves; other providers publish their own. Most providers pay on the Tuesday to Thursday after a period ends, and when a holiday falls in that week the payday can move. Your agency’s payroll office or your earnings statement is the reference for your own dates.</p>

<h2>Leave year dates around 2027</h2>
<p>Leave year 2026 ends on ${h.day(h.ly(2026).end)}, and leave year 2028 starts on ${h.day(h.ly(2028).start)}. The ${h.a('federal-pay-calendar-2026', 'federal pay calendar 2026')} lists the periods of the current year. Private-sector employees on a biweekly Friday schedule will find their own 2027 dates on the ${h.a('biweekly-pay-schedule-2027', 'biweekly schedule')}, where the question of 26 or 27 paydays is different.</p>
`;
    },
  },
});
