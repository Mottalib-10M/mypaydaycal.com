import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'biweekly-pay-schedule-2027',
  group: 'schedules',
  order: 20,
  tool: { kind: 'payroll', props: { year: 2027, freq: 'biweekly', anchor: '2027-01-01', years: [2027, 2028] } },
  mini: { kind: 'mini:payperiods', props: { y: 2027, w: 5 } },
  related: ['how-many-pay-periods-in-2027', '27-pay-periods', 'biweekly-pay-calculator', 'home'],
  sources: ['usc6103', 'frbHolidays', 'opmHolidays', 'cfr778104'],
  en: {
    slug: 'biweekly-pay-schedule-2027',
    nav: 'Biweekly pay schedule 2027',
    card: 'Every other Friday in 2027, both series: the one that starts on New Year’s Day and the one that starts a week later.',
    title: 'Biweekly Pay Schedule 2027: Both Friday Series, Dated',
    description: 'Biweekly pay schedule 2027: both every-other-Friday series with all dates, the New Year’s Day payday, 26 or 27 checks, and the holidays that move a deposit.',
    h1: 'Biweekly pay schedule 2027: which Fridays are paydays?',
    intro: 'Enter one payday you already have: the schedule steps 14 days at a time through 2027 and moves the dates that land on a bank holiday.',
    resume: (h) => {
      const [s1, s2] = h.pay.biweeklySeries(2027, 5);
      const a = h.sched({ anchor: s1.first }), b = h.sched({ anchor: s2.first });
      return `There are two biweekly Friday schedules in 2027 and you are on one of them. Year 2027 starts on a ${h.wd('2027-01-01')}, so it holds ${h.cal.weekdayCounts(2027)[5]} Fridays: one series pays on ${h.md(s1.first)}, ${h.md(h.cal.addDays(s1.first, 14))} and every other Friday to ${h.md(s1.last)}, ${s1.count} dates in all; the other pays on ${h.md(s2.first)} and every other Friday to ${h.md(s2.last)}, ${s2.count} dates. The first series is the one that can give 27 paychecks, but its first payday is New Year’s Day, when banks are closed. Most payrolls pay it on ${h.day(h.pay.paydays(a, 2026).at(-1)!.paid)}, so it counts in 2026, and 2027 keeps ${h.pay.paydays(a, 2027).length} paydays. If your employer pays the next business day instead, the check arrives on ${h.day(h.cal.rollToBusinessDay('2027-01-01', 'fed', 1))} and 2027 has ${h.pay.paydays(h.sched({ anchor: s1.first, rule: 'after' }), 2027).length}. The second series has ${h.pay.paydays(b, 2027).length} paydays whatever the rule. To know your series, find any 2027 payday on your pay stub or in your employer’s portal and type it into the schedule.`;
    },
    faqs: (h) => [
      { q: 'Is Christmas Eve 2027 a payday for biweekly Friday pay?', a: `It is for the series that starts on ${h.md('2027-01-08')}. Christmas Day 2027 is a Saturday, so federal offices close on ${h.day('2027-12-24')}, but the Federal Reserve Banks stay open that Friday and a direct deposit can settle. Employers that follow the federal calendar may pay on ${h.dayNoYear('2027-12-23')} instead.` },
      { q: 'How do I find out which Friday series I am on?', a: 'Look at a recent pay stub or your payroll portal for the date of your last check, then count forward in steps of two weeks. If one of your 2027 paydays is January 8 or January 22, you are on the second series; if it is January 15 or January 29, you are on the first, the one that can reach 27 paydays.' },
      { q: 'Does a biweekly schedule always pay on a Friday?', a: 'No. Friday is the most common payday, but a payroll can run on any weekday, every 14 days. A Thursday or a Wednesday series gives different counts: in 2027 neither has 27 dates, because only Friday occurs 53 times that year. The mini tool below counts paydays for any weekday and year.' },
    ],
    body: (h) => {
      const [s1, s2] = h.pay.biweeklySeries(2027, 5);
      const b = h.sched({ anchor: s2.first });
      return `
<h2>The two Friday series of 2027</h2>
<p>A biweekly payroll pays every 14 days, so in a year of 52 weeks and one day it lands on 26 dates, or 27 when its first payday is the first day of the year. In 2027 the extra day is a Friday, which is why only the Friday series that starts on ${h.day(s1.first)} reaches ${s1.count} scheduled dates. The other one, which starts on ${h.day(s2.first)}, keeps ${s2.count}. The table below is that second series, with the dates as paid when a bank holiday gets in the way.</p>
${h.payTable(b, 2027, `Biweekly Friday paydays in 2027 from ${h.md(s2.first)}, bank holidays from the ${h.src('frbHolidays', 'Federal Reserve schedule')}; pay periods end the Saturday before.`, true)}
<p>No payday of this series moves in 2027 under the bank calendar. The two federal holidays that fall on Fridays, Juneteenth observed on ${h.dayNoYear(h.hol(2027, 'juneteenth').observed)} and Christmas observed on ${h.dayNoYear(h.hol(2027, 'christmas').observed)}, are days when federal offices close but banks stay open, because the holidays themselves fall on Saturdays. Choose “Federal holidays as observed” in the generator and those two paydays move to the Thursday before.</p>

<h2>The series that starts on New Year’s Day</h2>
<p>The first series has its first scheduled payday on ${h.day(s1.first)}, a legal public holiday under ${h.src('usc6103', '5 U.S.C. 6103')}, and its last on ${h.day(s1.last)}. Its 27 dates are a calendar fact; how many of them are paid in 2027 depends on the payroll rule for holidays.</p>
<ul>
<li>Paid the business day before: the New Year’s payday is paid on ${h.day(h.cal.rollToBusinessDay('2027-01-01', 'fed', -1))}, it belongs to 2026, and 2027 has ${h.pay.paydays(h.sched({ anchor: s1.first }), 2027).length} paydays.</li>
<li>Paid the next business day: it is paid on ${h.day(h.cal.rollToBusinessDay('2027-01-01', 'fed', 1))} and 2027 has ${h.pay.paydays(h.sched({ anchor: s1.first, rule: 'after' }), 2027).length} paydays.</li>
<li>Federal holiday calendar: the last payday, ${h.day(s1.last)}, is also a federal holiday, the day off for New Year’s Day 2028 listed by ${h.src('opmHolidays', 'OPM')}; the banks are open, but a payroll that follows the federal calendar pays it on ${h.dayNoYear(h.cal.rollToBusinessDay(s1.last, 'federal', -1))}.</li>
</ul>
<p>Those differences change the year’s W-2 wages, which count pay when it is received, but not the salary for the work done. The ${h.a('27-pay-periods', '27 pay periods page')} explains how employers handle the extra check and the ${h.a('how-many-pay-periods-in-2027', 'pay periods 2027 page')} gives the count for every weekday.</p>
<!--tool:mini:payperiods-->

<h2>Pay periods behind the paydays</h2>
<p>Each biweekly payday pays a pay period of two workweeks. Under the federal overtime rules ${h.src('cfr778104', 'each workweek stands alone')}: overtime is counted week by week, never averaged over the two weeks, even when both are paid together. A common pattern, used in the table, is a Sunday to Saturday period paid on the Friday six days after it ends, which leaves a week for timesheets and the payroll run. Your employer’s delay may be shorter or longer; the generator takes any number of days from 0 to 20 and shows each period next to its payday when you print the schedule.</p>
<p>A biweekly schedule never needs to change from one year to the next: it just keeps stepping. That is why the same Friday series reads differently from year to year, with 26 paydays in most years and 27 in some, and why the ${h.a('payroll-calendar-2028', '2028 calendar')} begins exactly two weeks after the last 2027 payday.</p>
`;
    },
  },
});
