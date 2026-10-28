import { definePage } from '../../lib/guide-types';

export default definePage({
  id: '27-pay-periods',
  group: 'periods',
  order: 30,
  tool: { kind: 'mini:years27', props: { w: 5 } },
  mini: { kind: 'paycheck', props: { freq: 'biweekly' } },
  related: ['how-many-pay-periods-in-2027', 'biweekly-pay-calculator', 'biweekly-pay-schedule-2027', 'federal-pay-calendar-2027'],
  sources: ['opm27', 'opmLeaveYear', 'usc5504', 'cfr778113'],
  en: {
    slug: '27-pay-periods',
    nav: '27 pay periods',
    card: 'Why some years carry 27 biweekly paydays, which years they are for each weekday, and how employers pay the extra check.',
    title: '27 Pay Periods: Which Years, Which Paydays, Which Pay',
    description: '27 pay periods in a year: why a biweekly payroll gets an extra payday every 11 years or so, the next years for each weekday, and how the salary is divided.',
    h1: '27 pay periods: when does a year have an extra paycheck?',
    intro: 'Choose your payday: the finder lists the next years in which a biweekly series on that weekday has 27 scheduled dates.',
    resume: (h) => {
      const f = h.pay.years27(2026, 2060, 5);
      return `A biweekly payroll pays every 14 days, which is 26 paydays in 364 days. A year is one or two days longer, so the schedule slides one or two days earlier in the calendar every year, and about every eleven years a given series has a payday on January 1, or on January 2 in a leap year; with two series per weekday, it happens to one of them every five or six years. That year carries 27 paydays. For Friday payrolls, the scheduled years after 2026 are ${f.slice(0, 4).map((x) => x.year).join(', ')}, each for one of the two Friday series only: in 2027 the series that starts on ${h.md(f[0].first)}. Whether the extra check is really paid in that calendar year depends on the holiday rule, because January 1 is New Year’s Day and a payroll that pays early puts it in December. For a salaried employee the question is then the divisor: an employer that divides the salary by 26 pays a 27th check of the same size, about ${h.pct(1 / 26, 1)} more gross that year; one that divides by 27 keeps the yearly total and shrinks every check.`;
    },
    faqs: (h) => [
      { q: 'Do I get paid more in a year with 27 paychecks?', a: 'If you are paid by the hour, you are paid for the hours worked, and a 27th payday simply pays two more weeks of work. If you are salaried and your employer divides the salary by 26, the year’s gross is higher by one paycheck. If it divides by 27 that year, each check is smaller and the year totals your salary.' },
      { q: 'Can my employer reduce my paycheck in a 27-pay year?', a: 'An employer can choose to divide an annual salary by the number of paydays in the year, which makes each check smaller, but it should tell employees in advance and follow its pay policy and any contract. For nonexempt workers the federal minimum wage and overtime rules apply per workweek, whatever the divisor.' },
      { q: 'Do budgets and benefits change in a 27-pay year?', a: 'Deductions set per paycheck, like a 401(k) percentage, run 27 times, while those capped per year, like a flexible spending account election, may be spread over 27 checks instead of 26. Payroll offices usually announce how they handle each deduction. A budget built on monthly bills gains three months with three paychecks instead of two.' },
    ],
    body: (h) => {
      const rows = [1, 2, 3, 4, 5].map((w) => [h.cal.WEEKDAYS[w], h.pay.years27(2026, 2045, w).map((x) => String(x.year)).join(', ')]);
      return `
<h2>Years with 27 paydays for each weekday</h2>
<p>The table lists the years from 2026 to 2045 in which one of the two biweekly series on each weekday has 27 scheduled paydays. Only one series out of two is concerned each time: the one whose first payday of the year is January 1, or January 2 in a leap year.</p>
${h.table(['Payday', 'Years with a 27-date series, 2026 to 2045'], rows, 'Computed from the calendar; dates before any holiday move.', ['l', 'l'])}
<p>The gaps are uneven, five or six years, because leap days move the schedule two days at once and the weekday of January 1 cycles over 28 years. Knowing which of the two series your employer runs is enough to know your own years: type any of your paydays into the ${h.a('home', 'payroll calendar')} and change the year.</p>

<h2>The holiday rule decides the calendar year</h2>
<p>A 27th scheduled payday is always on January 1 or 2. January 1 is New Year’s Day, and when it is a weekday the banks are closed. A payroll that pays the business day before puts that check on December 31 of the year before; the 27-date year then has 26 paydays, and the previous year has 27. That is what happens with the Friday series of 2027: its New Year’s payday moves into 2026, so 2026 gets the extra check. A payroll that pays the business day after keeps all 27 in the year. The ${h.a('biweekly-pay-schedule-2027', 'biweekly 2027 schedule')} shows both cases.</p>

<h2>How the salary is divided</h2>
<p>Federal employees have a rule written in law. Under ${h.src('usc5504', '5 U.S.C. 5504')}, biweekly pay is the hourly rate times 80 hours, and the hourly rate is the annual rate divided by 2,087, so a federal paycheck does not depend on how many paydays the year has. In leave year 2023, which had 27 pay periods, OPM’s ${h.src('opm27', 'memorandum CPM 2023-11')} noted that employees would earn leave for all 27 periods and that most would still see 26 paydays in calendar year 2023.</p>
<p>Private employers choose. Dividing by 26 every year is the simplest and keeps every check identical; the year with 27 checks costs the employer one more payroll. Dividing by 27 in that year keeps the yearly cost at the salary, but each check drops by about ${h.pct(1 / 27, 1)}, and employees need notice. For nonexempt salaried staff, ${h.src('cfr778113', '29 CFR 778.113')} still sets the regular rate from the weekly equivalent of the salary, whatever the divisor. The calculator below shows both methods on your own salary.</p>
<!--tool:paycheck|{"freq":"biweekly"}-->

<h2>Planning for the extra check</h2>
<p>Employees on a 26-divisor payroll see an extra check, which is welcome but changes withholding and annual caps. Employers set aside the cost of the extra payroll, about one twenty-sixth of the yearly salary bill, over the years before it comes. The next scheduled 27-date years are listed above; the ${h.src('opmLeaveYear', 'OPM table')} shows the federal leave years up to 2030, none of which has 27 pay periods.</p>
`;
    },
  },
});
