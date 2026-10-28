import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'how-many-fridays-in-2027',
  group: 'periods',
  order: 50,
  tool: { kind: 'mini:weekdays', props: { y: 2027, w: 5 } },
  mini: { kind: 'mini:payperiods', props: { y: 2027, w: 5 } },
  related: ['how-many-pay-periods-in-2027', 'biweekly-pay-schedule-2027', 'working-days-in-2027', '27-pay-periods'],
  sources: ['usc6103', 'opmHolidays', 'frbHolidays'],
  en: {
    slug: 'how-many-fridays-in-2027',
    nav: 'Fridays in 2027',
    card: 'Year 2027 has 53 Fridays, from January 1 to December 31: what that means for weekly and biweekly paydays.',
    title: 'Fridays in 2027: 53 of Them, From January 1 to December 31',
    description: 'Fridays in 2027: there are 53, starting on New Year’s Day and ending on New Year’s Eve. The months with five Fridays and what it does to Friday paydays.',
    h1: 'How many Fridays are in 2027?',
    intro: 'Pick a year and a weekday: the counter gives how many times it occurs, its first and last date, and the months with five of them.',
    resume: (h) => {
      const fr = h.cal.weekdayDates(2027, 5);
      const five = h.cal.MONTHS.filter((_, i) => fr.filter((d) => +d.slice(5, 7) === i + 1).length === 5);
      return `There are ${fr.length} Fridays in 2027. The year begins on Friday, ${h.md(fr[0])}, and, being a common year of 365 days, ends on the same weekday, Friday, ${h.md(fr[fr.length - 1])}. Fifty-two weeks take 364 days, so the day left over is a Friday and Friday is the only weekday that occurs 53 times; every other weekday occurs 52 times. ${five.length} months have five Fridays: ${five.join(', ')}. For anyone paid on Fridays this is the year’s headline. Weekly pay has 53 scheduled paydays. Biweekly pay has 27 for the series that pays on New Year’s Day and 26 for the other. Monthly budgets feel it too: a biweekly earner on the first series gets three paychecks in ${h.cal.MONTHS.filter((_, i) => h.pay.nominalDates(h.sched({ anchor: '2027-01-01' }), '2027-01-01', '2027-12-31').filter((d) => +d.slice(5, 7) === i + 1).length === 3).join(' and ')}. Two of those Fridays are holidays, New Year’s Day and, for federal employees, ${h.day('2027-12-31')}.`;
    },
    faqs: (h) => [
      { q: 'Does 2027 have 53 weeks?', a: 'It has 52 full weeks and one extra day, which is a Friday. Whether a payroll sees 53 weeks depends on how it counts. A weekly payroll paid on Fridays has 53 paydays. One that counts workweeks ending on Saturday has 52 week-ending dates in 2027, plus a week that started in 2027 and ends on January 1, 2028.' },
      { q: 'When was the last year with 53 Fridays?', a: `The previous one was 2021, which also started on a Friday. Leap years that start on a Thursday, such as 2032, also have 53 Fridays because their extra day falls on January 2. After 2027, the next common year starting on a Friday is 2038.` },
      { q: 'Are banks open on Friday, December 31, 2027?', a: 'Yes. New Year’s Day 2028 falls on a Saturday, and the Federal Reserve Banks stay open on the Friday before a Saturday holiday, so direct deposits settle that day. Federal offices are closed, because federal employees take the Friday off under the observance rule for Saturday holidays.' },
    ],
    body: (h) => {
      const fr = h.cal.weekdayDates(2027, 5);
      const rows = h.cal.MONTHS.map((m, i) => { const ds = fr.filter((d) => +d.slice(5, 7) === i + 1); return [m, String(ds.length), ds.map((d) => String(+d.slice(8, 10))).join(', ')]; });
      return `
<h2>Every Friday of 2027, month by month</h2>
<p>The table lists the day of the month of each Friday. Months with five Fridays are those where the first Friday falls on the 1st, 2nd or 3rd of a 31-day month, or on the 1st or 2nd of a 30-day month.</p>
${h.table(['Month', 'Fridays', 'Dates'], rows, 'Fridays of 2027.', ['l', 'r', 'l'])}

<h2>Friday holidays in 2027</h2>
<p>Several Fridays of 2027 are days off for someone. ${h.day('2027-01-01')} is New Year’s Day under ${h.src('usc6103', '5 U.S.C. 6103')}, closed for federal offices and banks alike. ${h.day(h.hol(2027, 'juneteenth').observed)} and ${h.day(h.hol(2027, 'christmas').observed)} are the federal days off for Juneteenth and Christmas, which fall on Saturdays; and ${h.day('2027-12-31')} is the day off for New Year’s Day 2028, listed in ${h.src('opmHolidays', 'OPM’s 2028 table')}. On those three Fridays the ${h.src('frbHolidays', 'Federal Reserve Banks')} are open, because their rule for a Saturday holiday is to stay open the day before.</p>
<p>That difference decides whether a Friday payday moves. A payroll that follows the bank calendar pays on all three. One that follows the federal calendar, as many public employers do, pays on the Thursday before. The ${h.a('home', 'payroll calendar generator')} lets you switch between the two calendars and see the dates change.</p>

<h2>Fridays and pay counts</h2>
<p>Fifty-three Fridays mean 53 weekly paydays for a Friday payroll, a week more of pay in the calendar year than in most years. For a weekly employee on an annual salary divided by 52, it is an extra check; for an hourly employee, it is simply the pay for the week that ends on New Year’s Day weekend. Biweekly payrolls see 27 paydays only on the series that starts on January 1, as the counter below shows; the other series keeps 26.</p>
<!--tool:mini:payperiods-->
<p>New Year’s Day being a Friday, many payrolls pay that first check on Thursday, December 31, 2026, which moves it out of 2027. The ${h.a('how-many-pay-periods-in-2027', 'pay periods 2027 page')} counts both cases, and the ${h.a('27-pay-periods', '27 pay periods page')} explains what the extra check does to a salary.</p>

<h2>Other weekdays in 2027</h2>
<p>Every other weekday occurs 52 times in 2027. Change the weekday in the counter at the top to check a Monday or Wednesday payday, or the year to see when your payday weekday next occurs 53 times: a common year gives 53 of the weekday it starts on, a leap year 53 of its first two weekdays. For counts of working days rather than one weekday, the ${h.a('working-days-in-2027', 'working days 2027 page')} takes holidays out month by month, on the federal or the bank calendar, and gives the work hours that go with each month.</p>
`;
    },
  },
});
