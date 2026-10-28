import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'payroll-calendar-2028',
  group: 'schedules',
  order: 40,
  tool: { kind: 'payroll', props: { year: 2028, freq: 'biweekly', anchor: '2028-01-07', years: [2027, 2028] } },
  mini: { kind: 'mini:workdays', props: { y: 2028, m: 0, c: 0 } },
  related: ['home', 'biweekly-pay-schedule-2027', '27-pay-periods', 'business-days-calculator'],
  sources: ['opmHolidays', 'frbHolidays', 'usc6103'],
  en: {
    slug: 'payroll-calendar-2028',
    nav: 'Payroll calendar 2028',
    card: 'Paydays of 2028, a leap year that starts on a Saturday: 26 biweekly Fridays, a Monday New Year and holidays on Saturdays.',
    title: 'Payroll Calendar 2028: Leap-Year Paydays and Holidays',
    description: 'Payroll calendar 2028: biweekly, weekly, semi-monthly and monthly paydays in a leap year, the holidays that fall on Saturdays and the bank days that stay open.',
    h1: 'Payroll calendar 2028: paydays in a leap year',
    intro: 'Plan 2028 now: pick the schedule and one payday, and the calendar lists the year’s paydays with each weekend and holiday move.',
    resume: (h) => {
      const ny = h.hol(2028, 'newYear'), vet = h.hol(2028, 'veterans');
      return `Payroll year 2028 is a leap year of 366 days that starts on a ${h.wd('2028-01-01')} and ends on a ${h.wd('2028-12-31')}, so it holds 53 Saturdays and 53 Sundays but only 52 of each weekday. No biweekly schedule paid on a weekday reaches 27 paydays in 2028: every Friday series has 26. The holidays shape the year differently. New Year’s Day falls on a Saturday, so federal employees take ${h.day(ny.observed)} off, while the Federal Reserve Banks stay open that day and close on no weekday at all for it. Veterans Day is also a Saturday, observed by federal offices on ${h.day(vet.observed)}, a day when banks are open. For a payroll that follows the bank calendar, nine weekday closures remain in 2028; for one that follows the federal calendar, the count is ten, plus that Friday in December 2027. The calendar above computes each payday from those rules, the same ones that give the 2026 and 2027 schedules on this site.`;
    },
    faqs: (h) => [
      { q: 'Does 2028 have 27 biweekly paydays?', a: `Not for a schedule paid on a weekday. A year has 27 biweekly dates only when its first payday is January 1, or January 2 in a leap year. In 2028 those days are a Saturday and a Sunday, so every Monday to Friday series has 26 paydays. The next Friday series with 27 is in ${h.pay.years27(2028, 2060, 5)[0].year}.` },
      { q: 'Is February 29, 2028 a payday?', a: 'Only for a schedule that lands on it. February 29, 2028 is a Tuesday, an ordinary business day. A monthly or semi-monthly payroll on the last day of the month pays on the 29th that year, one day later than in 2027. A biweekly schedule is not affected by the leap day except that its dates shift by one weekday against the calendar.' },
      { q: 'Why plan the 2028 payroll calendar so early?', a: 'Payroll offices publish the next year’s calendar in the fall, but employees and small employers often need it sooner: to set loan due dates, to plan leave around paydays, or to see whether a year brings an extra check. The rules that set the dates are fixed in law, so the 2028 dates can be computed today.' },
    ],
    body: (h) => {
      const b = h.sched({ anchor: '2028-01-07' });
      return `
<h2>Holidays and bank days in 2028</h2>
<p>Two of the eleven holidays fall on Saturdays in 2028. For federal employees, ${h.src('opmHolidays', 'OPM’s table')} moves them to the Friday before, as 5 U.S.C. 6103(b) requires. For banks, the ${h.src('frbHolidays', 'Federal Reserve schedule')} keeps the Friday open. A payroll calendar therefore has to say which calendar it follows: the generator offers both.</p>
${h.holidayTable(2028, `Holidays of 2028 under ${h.src('usc6103', '5 U.S.C. 6103')}: the federal day off and the Federal Reserve closure.`)}
<p>The New Year’s Day row reads strangely but correctly: the day off for New Year’s Day 2028 is ${h.day(h.hol(2028, 'newYear').observed)}, in the previous year. That is also the last scheduled payday of the 2027 Friday series that started on New Year’s Day 2027, which is why the federal and bank calendars give it different answers.</p>

<h2>Biweekly 2028, first Friday series</h2>
<p>The first Friday of 2028 is ${h.day('2028-01-07')}. Its series has 26 paydays, the last on ${h.day(h.pay.paydays(b, 2028).at(-1)!.paid)}, and none of them meets a weekday bank holiday. The other Friday series starts on ${h.day('2028-01-14')} and ends on ${h.day('2028-12-29')}, also with 26 paydays.</p>
${h.payTable(b, 2028, 'Biweekly Friday paydays in 2028 from January 7, with the pay period each closes.', true)}

<h2>Fixed-date pay in 2028</h2>
<p>A semi-monthly payroll on the 15th and the last day moves ${h.moved(h.sched({ freq: 'semimonthly' }), 2028).length} paydays in 2028, among them ${h.md('2028-01-15')}, a Saturday paid on ${h.day(h.pay.paydays(h.sched({ freq: 'semimonthly' }), 2028)[0].paid)}, and ${h.md('2028-12-31')}, a Sunday paid on ${h.dayNoYear(h.pay.paydays(h.sched({ freq: 'semimonthly' }), 2028).at(-1)!.paid)}. A monthly payroll on the last day moves ${h.moved(h.sched({ freq: 'monthly' }), 2028).length} times: April, September and December end on weekends. The leap day only matters for pay on the last day of February, which is the 29th in 2028.</p>
<p>Working days set many salaries for hourly staff and the cost of a month for employers. With the bank calendar, 2028 counts the business days shown in the mini tool below; choose a month to see how many weekdays and holidays it holds.</p>
<!--tool:mini:workdays-->

<h2>Using the 2028 calendar with care</h2>
<p>The dates on this page come from rules: the holiday law, the observance rules for federal employees and for banks, and the schedule you enter. They will hold unless one of those changes. Congress has added holidays before, most recently Juneteenth in 2021, and the Federal Reserve publishes its schedules several years ahead; this site reads both again when they change and dates each update. Your employer can also change its payday rules, so the payroll office’s calendar is the final word for your own checks.</p>
<p>For the year before, the ${h.a('biweekly-pay-schedule-2027', 'biweekly 2027 schedule')} shows how the New Year’s Day payday of 2027 is handled, and the ${h.a('27-pay-periods', '27 pay periods page')} lists the coming years that carry an extra biweekly check.</p>
`;
    },
  },
});
