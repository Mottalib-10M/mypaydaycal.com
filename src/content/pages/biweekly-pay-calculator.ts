import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'biweekly-pay-calculator',
  group: 'periods',
  order: 40,
  tool: { kind: 'paycheck', props: { freq: 'biweekly' } },
  mini: { kind: 'mini:payperiods', props: { y: 2027, w: 5 } },
  related: ['27-pay-periods', 'semi-monthly-pay-schedule-2027', 'how-many-pay-periods-in-2027', 'home'],
  sources: ['cfr778113', 'cfr778104', 'usc5504'],
  en: {
    slug: 'biweekly-pay-calculator',
    nav: 'Biweekly pay calculator',
    card: 'Salary or hourly rate to gross pay per paycheck: weekly, biweekly, semi-monthly and monthly, with the 27-paycheck case.',
    title: 'Biweekly Pay Calculator: Gross Pay per Paycheck, Any Rate',
    description: 'Biweekly pay calculator: turn an annual salary or hourly rate into gross pay per paycheck for biweekly, weekly, semi-monthly and monthly pay, 27-check years.',
    h1: 'Biweekly pay calculator: what is each paycheck?',
    intro: 'Type a salary or an hourly rate and pick the frequency: the calculator gives the gross amount of one paycheck and the same pay on the other schedules.',
    resume: (h) => `Biweekly gross pay is the annual salary divided by 26, the number of paydays in a standard year, or the hourly rate times the hours of two weeks. A ${h.money(60000)} salary gives ${h.money(60000 / 26)} every other week, against ${h.money(60000 / 24)} semi-monthly, ${h.money(60000 / 52)} weekly and ${h.money(60000 / 12)} monthly: the same year cut into different slices. Paid ${h.money(25)} an hour for 40 hours a week, you earn ${h.money(25 * 80)} per biweekly paycheck, and ${h.money(25 * 40 * 52)} over 52 weeks. Those figures are gross pay, before federal and state income tax, Social Security and Medicare, benefits and retirement contributions, which this calculator leaves out on purpose, because they depend on your W-4 and your state. Two cases change the biweekly figure. In a year with 27 paydays, a salaried employee is paid either one check more, if the employer divides by 26, or slightly less on each check, if it divides by 27. Federal employees follow a rule of their own: annual rate divided by 2,087 hours, times 80.`,
    faqs: (h) => [
      { q: 'How do I convert an hourly wage to biweekly pay?', a: `Multiply the hourly rate by the hours you work in two weeks. At ${h.money(18)} an hour and 40 hours a week, that is ${h.money(18)} times 80, or ${h.money(18 * 80)} gross. If some weeks run over 40 hours, the extra hours of that week are paid at one and a half times the rate, week by week, not averaged over the two weeks.` },
      { q: 'Is a biweekly paycheck half of a monthly paycheck?', a: `No, it is a little less. A month is on average 4.33 weeks, so two weeks are about 46% of a month. On a ${h.money(60000)} salary the monthly check is ${h.money(5000)} and the biweekly check ${h.money(60000 / 26)}. Over the year the two schedules pay the same, because biweekly pay has 26 checks and monthly pay 12.` },
      { q: 'Why does my paycheck show less than the calculator?', a: 'The calculator gives gross pay. Your net paycheck is gross pay minus federal income tax withholding, Social Security and Medicare, state and sometimes local income tax, health premiums, retirement contributions and any garnishment. Those depend on your W-4, your state and your benefit choices, which is why the result here is the gross line of your pay stub.' },
    ],
    body: (h) => {
      const rows = (['weekly', 'biweekly', 'semimonthly', 'monthly'] as const).map((f) => [h.pay.FREQ_LABEL[f], String(h.pay.PERIODS[f]), h.money(h.pay.perPaycheck(50000, f)), h.money(h.pay.perPaycheck(75000, f)), h.money(h.pay.perPaycheck(100000, f))]);
      return `
<h2>Salary per paycheck at a glance</h2>
<p>The table divides three round salaries by the standard number of paydays of each frequency. The calculator at the top does the same for any figure, and the yearly line in its result lets you check the conversion both ways.</p>
${h.table(['Frequency', 'Paydays', '$50,000', '$75,000', '$100,000'], rows, 'Gross pay per paycheck, before taxes and deductions, in a year with the standard number of paydays.', ['l', 'r', 'r', 'r', 'r'])}

<h2>From an hourly rate</h2>
<p>For hourly pay, the paycheck follows the hours. A biweekly check pays two workweeks, so it is the rate times the hours of both weeks. Overtime is the one trap: under ${h.src('cfr778104', '29 CFR 778.104')}, each workweek stands alone, and hours over 40 in a week are paid at time and a half for that week. Working 45 hours one week and 35 the next gives 80 hours, but 5 of them are overtime; averaging the two weeks to 40 would be wrong.</p>
<p>Semi-monthly and monthly checks do not hold a whole number of weeks. The calculator uses the yearly equivalent, 52 weeks of your usual hours, divided by 24 or 12. That is the same arithmetic the federal regulations use in ${h.src('cfr778113', '29 CFR 778.113')} to turn a monthly or semi-monthly salary into a weekly one: multiply by 12 or 24 and divide by 52. A worker paid by the hour on a semi-monthly schedule is in practice paid for the hours of each period, which vary a little from one period to the next.</p>

<h2>Salaried pay in a 27-payday year</h2>
<p>Choose “27 (a 27-payday year)” in the calculator to see both employer methods. Dividing by 26 keeps your check identical and adds one more to the year. Dividing by 27 lowers each check so the year’s total stays at your salary. Neither method changes what you earn for the work done; it changes how the money is spread over calendar years. The finder below shows which years bring 27 paydays to a given Friday series.</p>
<!--tool:mini:payperiods-->
<p>Federal employees are covered by ${h.src('usc5504', '5 U.S.C. 5504')}: the hourly rate is the annual rate divided by 2,087 hours, rounded to the nearest cent, and a biweekly check pays 80 hours at that rate, whatever the number of paydays. The ${h.a('federal-pay-calendar-2027', 'federal pay calendar')} has a converter for that rule.</p>

<h2>Biweekly or semi-monthly?</h2>
<p>For the employee the difference is rhythm, not money. Biweekly pay comes on the same weekday every other week, and two months a year bring three paychecks. Semi-monthly pay comes on two fixed dates, so each check is larger and lines up with bills due on fixed days. The ${h.a('semi-monthly-pay-schedule-2027', 'semi-monthly schedule')} and the ${h.a('biweekly-pay-schedule-2027', 'biweekly schedule')} date every payday of 2027 if you want to compare them month by month. A change of frequency during the year, for example from semi-monthly to biweekly, usually means one short or one long period at the switch, which the payroll office announces in advance.</p>
`;
    },
  },
});
