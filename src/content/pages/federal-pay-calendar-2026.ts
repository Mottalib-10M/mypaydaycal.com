import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'federal-pay-calendar-2026',
  group: 'banking',
  order: 20,
  tool: { kind: 'fedpp', props: { year: 2026, date: '2026-11-28' } },
  mini: { kind: 'mini:leaveyear', props: { y: 2026 } },
  related: ['federal-pay-calendar-2027', 'how-many-pay-periods-in-2026', 'payroll-calendar-2026', 'direct-deposit-holidays'],
  sources: ['opmLeaveYear', 'nfc2026', 'opmHolidays'],
  demarche: true,
  en: {
    slug: 'federal-pay-calendar-2026',
    nav: 'Federal pay calendar 2026',
    card: 'Leave year 2026 from January 11, its 26 pay periods, the periods left before year end and the November 28 use-or-lose date.',
    title: 'Federal Pay Calendar 2026: Pay Periods Left This Year',
    description: 'Federal pay calendar 2026: the 26 pay periods of leave year 2026, those left before it ends in January 2027, the holidays inside them and the use-or-lose date.',
    h1: 'Federal pay calendar 2026: the pay periods left',
    intro: 'The calendar opens on the use-or-lose date: pick any date to see its pay period, or switch to the 2027 leave year.',
    resume: (h) => {
      const l = h.ly(2026);
      const now = h.fed.periodOf(h.P.retrieved_at)!;
      return `Leave year 2026 for federal employees started on ${h.day(l.start)} and ends on ${h.day(l.end)}, according to the ${h.src('opmLeaveYear', 'OPM leave year table')}. It holds ${l.count} biweekly pay periods, each from a Sunday to the second Saturday after it. On ${h.date(h.P.retrieved_at)}, the date these pages were last checked, the current period was number ${now.period.n}, from ${h.md(now.period.start)} to ${h.md(now.period.end)}, which leaves ${l.count - now.period.n} full periods after it. The most pressing date of the fall is ${h.day(l.useOrLose!)}: annual leave above the carryover ceiling must be scheduled in writing by then to be restorable if it cannot be used. Holidays left in the leave year are Veterans Day on ${h.day(h.hol(2026, 'veterans').observed)}, Thanksgiving on ${h.dayNoYear(h.hol(2026, 'thanksgiving').observed)}, Christmas on ${h.dayNoYear(h.hol(2026, 'christmas').observed)} and New Year’s Day on ${h.day(h.hol(2027, 'newYear').observed)}. Paydays are set by each agency’s payroll provider.`;
    },
    faqs: (h) => [
      { q: 'When does the 2026 federal leave year end?', a: `On ${h.day(h.ly(2026).end)}, the last day of pay period ${h.ly(2026).count}. The 2027 leave year starts the next day, ${h.day(h.ly(2027).start)}. Leave above your carryover ceiling that has not been used by the end of the leave year is forfeited unless it was scheduled in advance and could not be taken.` },
      { q: 'Which pay period is Thanksgiving 2026 in?', a: `Thanksgiving Day falls on ${h.day(h.hol(2026, 'thanksgiving').date)}, in pay period ${h.fed.periodOf(h.hol(2026, 'thanksgiving').date)!.period.n} of leave year 2026, which runs from ${h.md(h.fed.periodOf(h.hol(2026, 'thanksgiving').date)!.period.start)} to ${h.md(h.fed.periodOf(h.hol(2026, 'thanksgiving').date)!.period.end)}. Full-time employees are paid eight hours of holiday pay for it in that period, and the day after Thanksgiving is an ordinary workday unless leave is taken.` },
      { q: 'Is New Year’s Day 2027 in leave year 2026?', a: `Yes. ${h.day('2027-01-01')} falls before leave year 2027 starts on ${h.md(h.ly(2027).start)}, so it is in the last pay period of leave year 2026. Its holiday hours are recorded in that period, and leave taken around it counts against the 2026 balance.` },
    ],
    body: (h) => {
      const l = h.ly(2026);
      const now = h.fed.periodOf(h.P.retrieved_at)!.period.n;
      const rows = l.periods.filter((p) => p.n >= now).map((p) => [`PP ${String(p.n).padStart(2, '0')}`, `${h.md(p.start)} to ${h.date(p.end)}`, h.cal.holidaysInYear(2026, 'federal').concat(h.cal.holidaysInYear(2027, 'federal')).filter((x) => x.date >= p.start && x.date <= p.end).map((x) => x.name).join(', ')]);
      return `
<h2>Pay periods from late October 2026</h2>
<p>The table starts with the pay period that was running when these dates were last checked and lists every one to the end of the leave year, with the federal holidays inside each, from ${h.src('opmHolidays', 'OPM’s holiday table')}. The tool at the top shows all ${l.count} periods; the ${h.src('nfc2026', 'National Finance Center 2026 calendar')} has the same periods for the agencies it pays.</p>
${h.table(['Period', 'Dates', 'Holidays'], rows, 'Federal pay periods of leave year 2026, from the OPM leave year dates.', ['l', 'l', 'l'])}

<h2>Before the use-or-lose date</h2>
<p>The use-or-lose date is the day before the third pay period from the end of the leave year begins: ${h.day(l.useOrLose!)} for 2026. Annual leave in excess of the maximum carryover, ${h.P.federalPay.carryoverHours} hours for most employees in the United States, is lost at the end of the leave year. It can be restored only if it was scheduled in writing before that date and then cancelled for an exigency of the public business, illness or administrative error. A practical planning step is to count the hours you can still take: with ${l.count - h.fed.periodOf(l.useOrLose!)!.period.n} pay periods left after that date, the leave you schedule later is not protected.</p>
<p>The mini tool below gives the same dates for the following leave years, so you can plan 2027 ahead.</p>
<!--tool:mini:leaveyear-->

<h2>Pay dates are set by your provider</h2>
<p>Federal employees are paid by one of a few payroll providers, each with its own calendar of pay dates, usually a few business days after the pay period closes. This page therefore lists periods, not paydays. When a federal holiday falls in the week after a period ends, the payday may shift; the provider’s calendar says by how much. Retirees and annuitants follow a monthly calendar of their own and are not concerned by pay periods.</p>

<h2>Reading a pay period number</h2>
<p>Pay period numbers restart at 1 every leave year, so “PP 21” means nothing without the year. Earnings statements, timecards and leave balances all carry the period number and the leave year together, and the period ending date is the easiest way to match them. Because a leave year starts in the second week of January, the first days of January belong to the last pay period of the previous leave year: hours worked on ${h.md('2027-01-04')} are recorded in pay period ${h.fed.periodOf('2027-01-04')!.period.n} of leave year ${h.fed.periodOf('2027-01-04')!.year}. The tool at the top answers the question for any date between 2023 and 2030; type the date of a holiday, a training course or the first day of a leave request to see the period it falls in.</p>
<p>Leave is also earned by full pay period, so the number of periods left in the leave year sets how much more annual and sick leave can still be added to your balance before the year closes and the carryover ceiling is applied.</p>

<h2>The year after</h2>
<p>Leave year 2027 starts on ${h.day(h.ly(2027).start)} and has ${h.ly(2027).count} periods, with its use-or-lose date on ${h.day(h.ly(2027).useOrLose!)}. The ${h.a('federal-pay-calendar-2027', 'federal pay calendar 2027')} lists them and the holidays that fall in each. For private-sector biweekly schedules, the ${h.a('payroll-calendar-2026', 'payroll calendar 2026')} works from your own first payday.</p>
`;
    },
  },
});
