import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'direct-deposit-holidays',
  group: 'banking',
  order: 30,
  tool: { kind: 'mini:holidaypay', props: { y: 2026, h: 9 } },
  mini: { kind: 'bizdays', props: { mode: 'add', start: '2026-11-24', n: 2 } },
  related: ['business-days-calculator', 'payroll-calendar-2026', 'how-many-fridays-in-2027', 'home'],
  sources: ['frbHolidays', 'usc6103', 'opmHolidays', 'cfr778106'],
  en: {
    slug: 'direct-deposit-holidays',
    nav: 'Direct deposit holidays',
    card: 'The bank holidays of 2026 and 2027 when direct deposits do not settle, and when a payday that lands on one is paid.',
    title: 'Direct Deposit Holidays 2026 and 2027: Early or Late Pay',
    description: 'Direct deposit holidays for 2026 and 2027: the Federal Reserve closures that hold up payroll, the Saturday holidays when banks stay open, and when pay lands.',
    h1: 'Direct deposit on a holiday: when does pay arrive?',
    intro: 'Pick the year, the holiday and your employer’s rule: the tool gives the date a payday due on that holiday is paid.',
    resume: (h) => {
      const t = h.hol(2026, 'thanksgiving'), x = h.hol(2026, 'christmas');
      return `A direct deposit moves through the ACH network, which the Federal Reserve Banks operate and which does not settle payments on their holidays. When a payday lands on one of those days, the money cannot arrive that day, so the payroll pays on the business day before or after, depending on the employer’s rule. The Federal Reserve closes on the eleven legal public holidays of 5 U.S.C. 6103, with one twist: when a holiday falls on a Sunday, it closes the Monday after; when it falls on a Saturday, it stays open the Friday before. The holidays left in 2026 are Veterans Day on ${h.day(h.hol(2026, 'veterans').date)}, Thanksgiving on ${h.dayNoYear(t.date)} and Christmas on ${h.dayNoYear(x.date)}. A Friday payday on Christmas is usually paid on ${h.day(h.cal.rollToBusinessDay(x.date, 'fed', -1))}. In 2027, Juneteenth and Christmas fall on Saturdays, so the Fridays before them, ${h.md(h.hol(2027, 'juneteenth').observed)} and ${h.md(h.hol(2027, 'christmas').observed)}, are federal days off but normal bank days, and deposits settle as usual.`;
    },
    faqs: (h) => [
      { q: 'Will my direct deposit come early because of Thanksgiving?', a: `Only if your payday falls on Thanksgiving Day, ${h.date(h.hol(2026, 'thanksgiving').date)} in 2026, which is a Thursday. Most payrolls then pay on Wednesday. A Friday payday the day after Thanksgiving is a normal bank day: the Federal Reserve Banks are open, so your deposit arrives on Friday as usual.` },
      { q: 'Do banks process direct deposits on Veterans Day?', a: `No. Veterans Day is a Federal Reserve holiday, so the ACH network does not settle payments that day, even though many bank branches stay open. In 2026 it falls on ${h.day(h.hol(2026, 'veterans').date)}. In 2028 it falls on a Saturday, and the banks then close on no weekday for it.` },
      { q: 'Why did my pay arrive a day late after a holiday weekend?', a: 'If your payday fell on a Monday holiday, such as Memorial Day or Labor Day, and your employer pays the next business day, the deposit settles on Tuesday. Some employers send the payroll file late before a long weekend, which can also delay it. Your employer’s pay policy says which rule it follows.' },
      { q: 'Can my bank post my deposit before payday?', a: 'Some banks make incoming direct deposits available as soon as they receive the payroll file, up to two days before the settlement date. That is a choice of your bank, not a rule of the ACH network, and it can vary from one payday to the next. The settlement date set by your employer is the date you can count on.' },
    ],
    body: (h) => {
      const rows = (y: number) => h.cal.federalHolidays(y).map((x) => [x.name, h.day(x.date), x.fedClosed ? (x.fedClosed === x.date ? 'closed' : `closed ${h.dayNoYear(x.fedClosed)}`) : 'open (Saturday holiday)']);
      return `
<h2>Bank holidays of 2026</h2>
<p>The closures below come from the ${h.src('frbHolidays', 'Federal Reserve Financial Services holiday schedule')}. On those days no ACH payment settles, which is what matters for a direct deposit; bank branches may open or not, at each bank’s choice.</p>
${h.table(['Holiday', 'Date', 'Federal Reserve Banks'], rows(2026), 'Federal Reserve holidays in 2026; a Saturday holiday leaves the Friday before open.', ['l', 'l', 'l'])}

<h2>Bank holidays of 2027</h2>
<p>Three holidays of 2027 fall on weekends. Juneteenth and Christmas are Saturdays, so the banks stay open on Friday; Independence Day is a Sunday, so the banks close on ${h.day(h.hol(2027, 'independence').fedClosed!)}. Federal offices follow a different rule and close on both Fridays, as the ${h.src('opmHolidays', 'OPM tables')} show.</p>
${h.table(['Holiday', 'Date', 'Federal Reserve Banks'], rows(2027), 'Federal Reserve holidays in 2027.', ['l', 'l', 'l'])}

<h2>How a payroll gets to your account</h2>
<p>A payroll by direct deposit is a batch of ACH credits. The employer, or its payroll provider, sends the file to its bank, the bank passes it into the ACH network, and the network settles each credit on the date the file names: the payday. Payroll files are usually sent one or two business days before that date. A holiday therefore matters twice: it cannot be a settlement day, and it does not count as one of the business days the file needs. For the Christmas holiday of 2026, the FedACH schedule stops processing late on ${h.day('2026-12-24')} and resumes on the evening of ${h.dayNoYear('2026-12-27')}, ready for Monday settlement.</p>
<p>That is why a payroll office closes its books earlier in holiday weeks. To check a deadline yourself, count business days back from the payday with the tool below; it skips weekends and Federal Reserve holidays.</p>
<!--tool:bizdays|{"mode":"add","start":"2026-12-28","n":-2}-->

<h2>Before or after: the employer’s rule</h2>
<p>No federal law says which way a payday moves. ${h.src('usc6103', '5 U.S.C. 6103')} fixes the holidays, the Federal Reserve fixes the bank days, and employers write their own rule, nearly always “the business day before” so that pay is never late. Some state laws require payment by a set day; an employer that pays after the holiday has to stay within them. For overtime, ${h.src('cfr778106', '29 CFR 778.106')} expects payment on the regular payday for the workweek, or as soon as practicable when the amount cannot be computed in time.</p>
<p>The ${h.a('home', 'payroll calendar generator')} applies the rule to a whole year, and the ${h.a('business-days-calculator', 'business days calculator')} counts the days between any two dates on the same bank calendar.</p>
`;
    },
  },
});
