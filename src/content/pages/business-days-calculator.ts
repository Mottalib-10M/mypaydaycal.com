import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'business-days-calculator',
  group: 'banking',
  order: 40,
  tool: { kind: 'bizdays', props: { start: '2026-11-02', end: '2026-12-31' } },
  mini: { kind: 'mini:workdays', props: { y: 2027, m: 0, c: 0 } },
  related: ['working-days-in-2027', 'direct-deposit-holidays', 'home', 'payroll-calendar-2026'],
  sources: ['frbHolidays', 'opmHolidays', 'usc6103'],
  en: {
    slug: 'business-days-calculator',
    nav: 'Business days calculator',
    card: 'Business days between two dates, or the date N business days away, skipping weekends and bank or federal holidays.',
    title: 'Business Days Calculator: Bank and Federal Holidays Out',
    description: 'Business days calculator: count the business days between two dates or add business days to a date, skipping weekends and Federal Reserve or federal holidays.',
    h1: 'Business days calculator with US holidays',
    intro: 'Count the business days between two dates, or find the date a number of business days away, with bank or federal holidays taken out.',
    resume: (h) => {
      const n = h.cal.businessDaysBetween('2026-11-02', '2026-12-31', 'fed', true, true);
      return `A business day, for payroll and banking, is a weekday that is not a holiday of the calendar you follow. In the United States that calendar is usually the Federal Reserve’s, because it decides when payments settle; for federal deadlines it is the list of federal days off. The two differ only when a holiday falls on a Saturday: the banks stay open the Friday before, federal offices do not. The calculator counts from the day after the start date to the end date, as you would count the days you wait, and you can tick a box to include the start. From ${h.day('2026-11-02')} to ${h.day('2026-12-31')} inclusive it finds ${n} bank business days, because Veterans Day, Thanksgiving and Christmas fall on weekdays. The second mode adds or subtracts business days: two bank business days before ${h.day('2026-12-28')} is ${h.day(h.cal.addBusinessDays('2026-12-28', -2, 'fed'))}, the kind of deadline a payroll file must meet before a Monday payday.`;
    },
    faqs: (h) => [
      { q: 'Does a business day count include the start date?', a: 'By default, no: the calculator counts the days after the start date up to and including the end date, which answers “how many business days until”. Tick “Count the start date too” to count both ends, which answers “how many business days in this period”. Contracts and notices usually say which reading applies.' },
      { q: 'Is Saturday a business day for banks?', a: 'No. The Federal Reserve’s payment services settle on weekdays only, and an ACH payment due on a Saturday is processed on the next business day. Some banks open their branches on Saturday morning, but deposits and transfers received then are treated as received on the next business day.' },
      { q: 'Which holidays should I exclude from a business day count?', a: `For pay and bank transfers, the Federal Reserve holidays: the eleven legal public holidays, with Sunday holidays moved to Monday and Saturday holidays not moved. For federal deadlines, the federal days off, which move Saturday holidays to Friday. In 2027 the two calendars differ by ${h.cal.workingDaysByMonth(2027, 'fed').reduce((s, m) => s + m.working, 0) - h.cal.workingDaysByMonth(2027, 'federal').reduce((s, m) => s + m.working, 0)} days.` },
    ],
    body: (h) => {
      const sum = (y: number, c: 'fed' | 'federal' | 'weekends') => h.cal.workingDaysByMonth(y, c).reduce((s, m) => s + m.working, 0);
      return `
<h2>Bank business days or federal working days</h2>
<p>The calculator offers three calendars. “Bank days” follows the ${h.src('frbHolidays', 'Federal Reserve holiday schedule')}, the one that governs direct deposits and wire and ACH transfers. “Federal holidays as observed” follows the ${h.src('opmHolidays', 'OPM table of federal days off')}, the right choice for deadlines counted by federal agencies. “Weekends only” ignores holidays, for a quick count or for an employer that works on holidays.</p>
${h.table(['Year', 'Weekdays', 'Bank business days', 'Federal working days'], [2026, 2027, 2028].map((y) => [String(y), String(sum(y, 'weekends')), String(sum(y, 'fed')), String(sum(y, 'federal'))]), 'Business days per calendar year under each calendar.', ['l', 'r', 'r', 'r'])}
<p>Federal working days are fewer than bank days in years with Saturday holidays, because federal employees take the Friday off while the banks open. In 2027, Juneteenth and Christmas fall on Saturdays, and New Year’s Day 2028 too, so its day off, ${h.day('2027-12-31')}, comes out of 2027.</p>

<h2>Counting rules that change the answer</h2>
<ul>
<li><strong>Start date.</strong> Counting from the day after the start is the usual way to answer “how many business days until”. If the task starts the same day, include it.</li>
<li><strong>End date.</strong> The end date is counted when it is a business day. If it falls on a weekend or a holiday, it adds nothing, and a deadline on that day usually moves to the next business day.</li>
<li><strong>Holiday rule.</strong> A holiday on a Sunday is a Monday off for banks and federal offices. A holiday on a Saturday is a Friday off for federal offices only.</li>
<li><strong>State and local holidays.</strong> Some states close their offices on days such as Cesar Chavez Day or the day after Thanksgiving. Banks follow the Federal Reserve, so those days are still bank business days.</li>
</ul>

<h2>Business days in payroll</h2>
<p>Payrolls count business days backward from payday. A provider that needs the payroll two business days before settlement wants it by Wednesday for a Friday payday, and by the Tuesday before a Friday after a Thursday holiday. Pay periods themselves are counted in calendar days, so a business-day count is only needed for deadlines and for employees paid per working day. The mini tool below counts working days in any month of 2026 to 2030.</p>
<!--tool:mini:workdays-->
<p>The holidays themselves come from ${h.src('usc6103', '5 U.S.C. 6103')}: New Year’s Day, Martin Luther King Jr.’s Birthday, Washington’s Birthday, Memorial Day, Juneteenth, Independence Day, Labor Day, Columbus Day, Veterans Day, Thanksgiving Day and Christmas Day. The calculator computes their dates for any year from the rules in the law, so it gives the right answer for years whose official tables are not yet published.</p>

<h2>Examples worth checking</h2>
<p>Three counts come up every year. From the day after Thanksgiving to Christmas Eve, a classic year-end window, 2026 has ${h.cal.businessDaysBetween(h.cal.addDays(h.hol(2026, 'thanksgiving').date, 1), '2026-12-24', 'fed', true, true)} bank business days. The ten business days often allowed for a final paycheck or a document request, counted from ${h.day('2026-12-21')}, end on ${h.day(h.cal.addBusinessDays('2026-12-21', 10, 'fed'))} once Christmas and New Year’s Day are skipped. And a thirty-calendar-day notice is not the same as thirty business days, which last about six weeks.</p>

<h2>Related counts</h2>
<p>The ${h.a('working-days-in-2027', 'working days 2027 page')} gives the count month by month, and the ${h.a('direct-deposit-holidays', 'direct deposit holidays page')} lists the closures with the date a payday due on each is paid.</p>
`;
    },
  },
});
