import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'semi-monthly-pay-schedule-2027',
  group: 'schedules',
  order: 30,
  tool: { kind: 'payroll', props: { year: 2027, freq: 'semimonthly', d1: 15, d2: 31, years: [2026, 2027, 2028] } },
  mini: { kind: 'mini:semimonthly', props: { y: 2027, m: 5 } },
  related: ['home', 'biweekly-pay-calculator', 'payroll-calendar-2026', 'working-days-in-2027'],
  sources: ['frbHolidays', 'usc6103', 'cfr778113'],
  en: {
    slug: 'semi-monthly-pay-schedule-2027',
    nav: 'Semi-monthly pay schedule 2027',
    card: 'The 24 twice-a-month paydays of 2027 on the 15th and the last day, or any two days you choose, moved off weekends.',
    title: 'Semi-Monthly Pay Schedule 2027: 24 Paydays, Moved Dates',
    description: 'Semi-monthly pay schedule 2027: the 24 paydays on the 15th and last day of the month, or the 1st and 15th, with every weekend and bank holiday move dated.',
    h1: 'Semi-monthly pay schedule 2027: the 24 paydays',
    intro: 'Choose the two days of the month you are paid and the rule for weekends: the schedule dates all 24 paydays of 2027 and shows which ones move.',
    resume: (h) => {
      const s = h.sched({ freq: 'semimonthly' });
      const mv = h.moved(s, 2027);
      const may = mv.find((p) => p.nominal === '2027-05-31')!;
      return `A semi-monthly payroll pays twice a month on two set dates, which makes 24 paydays in 2027 as in every year, against 26 or 27 for biweekly pay. The usual pair is the 15th and the last day of the month. In 2027, ${mv.length} of those 24 dates fall on a weekend or a bank holiday, so under the common rule, pay the business day before, the check comes early: ${h.md(mv[0].nominal)} is paid on ${h.day(mv[0].paid)}, the 15th of February on ${h.dayNoYear(mv[1].paid)} and the 31st of May, which is Memorial Day, on ${h.day(may.paid)}. Juneteenth and Christmas do not move any of these paydays in 2027: they fall on Saturdays, and the Federal Reserve Banks stay open on the Fridays before. The 1st and the 15th is the other frequent pair; it meets New Year’s Day on the first payday of the year. Each semi-monthly check pays half a month, so it is 1/24 of an annual salary, a little more than a biweekly check, which is 1/26.`;
    },
    faqs: (h) => [
      { q: 'Is semi-monthly pay the same as biweekly pay?', a: 'No. Semi-monthly means twice a month on set dates, 24 paydays a year. Biweekly means every other week on the same weekday, 26 paydays in most years and 27 in some. A semi-monthly check is larger, because the salary is split into fewer payments, and its pay period does not line up with workweeks.' },
      { q: 'What if the 15th falls on a Sunday?', a: `Most employers pay the Friday before, so the money arrives early; some pay the following Monday. The choice is a payroll policy, and some states require that wages due on a non-workday be paid on a set side of it. In 2027 the 15th falls on a weekend in February, May and August.` },
      { q: 'How is overtime handled with semi-monthly pay?', a: 'Overtime is still computed per workweek of seven days, whatever the pay period. A workweek that straddles two semi-monthly periods is usually paid in the period where it ends. For a salaried nonexempt employee, the regulations convert the semi-monthly salary to a weekly figure by multiplying it by 24 and dividing by 52.' },
    ],
    body: (h) => {
      const s = h.sched({ freq: 'semimonthly' });
      const s1 = h.sched({ freq: 'semimonthly', d1: 1, d2: 15 });
      return `
<h2>All 24 paydays of 2027</h2>
<p>The table follows the most common semi-monthly pattern, the 15th and the last calendar day, with dates moved to the business day before a weekend or a bank holiday. Bank holidays are the closure days of the ${h.src('frbHolidays', 'Federal Reserve Banks')}, the days when a direct deposit cannot settle.</p>
${h.payTable(s, 2027, 'Semi-monthly paydays in 2027, the 15th and the last day of each month, moved to the business day before a closure.')}
<p>The last-day payday moves more often than the 15th, because month ends drift through the week: in 2027, January, February, July and October end on a weekend, and May ends on Memorial Day. A February payday on the last day is the 28th in 2027, the 29th only in a leap year such as 2028.</p>

<h2>Choosing the two days</h2>
<p>Employers pick the pair that fits their payroll cut-off. The 15th and the last day pays each half of the month as soon as it ends. The 1st and the 15th pays it later, often with an arrears week, and meets New Year’s Day, which ${h.src('usc6103', '5 U.S.C. 6103')} fixes on January 1. Run that pair in the generator and the first payday of 2027 moves to ${h.day(h.pay.paydays({ ...s1, rule: 'after' }, 2027)[0].paid)} if your employer pays the next business day, or into the last day of 2026 if it pays the business day before.</p>
<p>Some payrolls choose the 10th and the 25th, or the 5th and the 20th, to keep paydays away from month ends. The menus of the generator take any day from the 1st to the 28th, plus “last day of the month”, which stays right in February and in 30-day months.</p>
<!--tool:mini:semimonthly-->

<h2>Semi-monthly pay and the workweek</h2>
<p>A semi-monthly period is 15 or 16 days, sometimes 13 or 14 in February, and never a whole number of weeks. That matters for employees who are not exempt from overtime. The federal rule counts overtime by workweek, so the payroll has to assign each week to a period. For a salaried employee paid semi-monthly, ${h.src('cfr778113', '29 CFR 778.113')} gives the conversion used to find the regular rate: the semi-monthly salary multiplied by 24 and divided by 52 is the weekly equivalent. A ${h.money(2500)} semi-monthly salary is ${h.money(2500 * 24 / 52)} a week, and the hourly regular rate follows from the hours that salary is meant to cover.</p>
<p>For hourly workers, semi-monthly pay means the hours of the period are paid on the period’s payday, with any overtime of a week that ends in the period. The ${h.a('biweekly-pay-calculator', 'paycheck calculator')} shows the same gross pay under each frequency, and the ${h.a('working-days-in-2027', 'working days 2027 page')} counts the weekdays in each half-month if your pay depends on days worked.</p>

<h2>Semi-monthly or biweekly: what changes for you</h2>
<p>For the same salary, the yearly total is identical. What differs is the rhythm: a semi-monthly check is larger, ${h.money(60000 / 24, 'USD')} on a ${h.money(60000)} salary against ${h.money(60000 / 26)} biweekly, but there are two fewer of them, and none of the “third paycheck months” that biweekly earners know. Rent and loan payments due on fixed days line up better with fixed paydays, which is why some employers prefer them; weekly-minded budgets line up better with biweekly pay.</p>
`;
    },
  },
});
