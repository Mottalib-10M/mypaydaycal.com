import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'payroll-calendar-2026',
  group: 'schedules',
  order: 10,
  tool: { kind: 'payroll', props: { year: 2026, anchor: '2026-01-09', years: [2026, 2027] } },
  mini: { kind: 'mini:holidaypay', props: { y: 2026, h: 10 } },
  related: ['home', 'how-many-pay-periods-in-2026', 'direct-deposit-holidays', 'federal-pay-calendar-2026'],
  sources: ['usc6103', 'opmHolidays', 'frbHolidays', 'cfr778106'],
  en: {
    slug: 'payroll-calendar-2026',
    nav: 'Payroll calendar 2026',
    card: 'The paydays left in 2026 for any schedule, with the Juneteenth, Christmas and New Year moves that land in the last weeks.',
    title: 'Payroll Calendar 2026: Paydays Left and Holiday Moves',
    description: 'Payroll calendar 2026 for weekly, biweekly, semi-monthly and monthly pay: every payday with weekend and bank holiday moves, plus an .ics file for your calendar.',
    h1: 'Payroll calendar 2026: when are the remaining paydays?',
    intro: 'Pick your pay frequency and one payday you already know: the calendar lists every 2026 payday, flags the ones a weekend or holiday moves, and exports them.',
    resume: (h) => {
      const a = h.sched({ anchor: '2026-01-02' }), b = h.sched({ anchor: '2026-01-09' });
      const pa = h.pay.paydays(a, 2026), pb = h.pay.paydays(b, 2026);
      const xmas = h.hol(2026, 'christmas'), ny = h.hol(2027, 'newYear');
      return `A 2026 payroll calendar is a list of dates set by two choices: how often you are paid and what your employer does when a payday lands on a day the banks are closed. Calendar year 2026 begins on a ${h.wd('2026-01-01')} and ends on a ${h.wd('2026-12-31')}, so a biweekly Friday schedule comes in two versions. One paid on ${h.md('2026-01-02')} reaches ${h.md(pa.at(-1)!.nominal)} on paper, but ${h.day(ny.date)} is a federal holiday, and a payroll that pays the business day before puts that check on ${h.day(pa.at(-1)!.paid)}: ${pa.length} paydays inside 2026. The other, paid on ${h.md('2026-01-09')}, has ${pb.length} paydays and meets ${xmas.name} on ${h.day(xmas.date)}, paid on ${h.dayNoYear(pb.at(-1)!.paid)}. Semi-monthly pay on the 15th and the last day of the month moves ${h.moved(h.sched({ freq: 'semimonthly' }), 2026).length} times in the year for weekends alone. The generator above applies the Federal Reserve holiday schedule, or the federal one if you prefer, to any schedule you enter.`;
    },
    faqs: (h) => [
      { q: 'Why does my biweekly schedule show 27 paydays in 2026?', a: `If your Fridays fall on ${h.md('2026-01-02')}, ${h.md('2026-01-16')} and so on, the 27th scheduled date is ${h.day('2027-01-01')}, which is New Year’s Day. A payroll that pays the business day before moves that check to ${h.md('2026-12-31')}, so it counts in your 2026 wages. The other Friday series has 26 paydays only.` },
      { q: 'Is Juneteenth 2026 a payroll holiday?', a: `Juneteenth National Independence Day falls on ${h.day(h.hol(2026, 'juneteenth').date)}. The Federal Reserve Banks close that day, so a direct deposit due on it is usually paid on ${h.dayNoYear(h.cal.rollToBusinessDay(h.hol(2026, 'juneteenth').date, 'fed', -1))} or on the next business day, depending on your employer’s policy.` },
      { q: 'What happens to a payday on July 4, 2026?', a: `Independence Day 2026 is a ${h.wd(h.hol(2026, 'independence').date)}, a weekend day, so no payday is scheduled on it by a Monday to Friday payroll. Federal employees take ${h.day(h.hol(2026, 'independence').observed)} off, but the Federal Reserve Banks stay open that Friday, as their holiday schedule states for any Saturday holiday.` },
      { q: 'Does federal law say when a payday must move?', a: 'No federal rule sets the direction. The Fair Labor Standards Act asks for wages on the regular payday for the workweek, and states set how often employees must be paid. Moving a payday to the business day before or after a closure is the employer’s policy, often written in the handbook. The calendar lets you test both.' },
    ],
    body: (h) => {
      const b = h.sched({ anchor: '2026-01-09' });
      return `
<h2>The 2026 dates that move paydays</h2>
<p>Two calendars matter for pay. The first is the list of legal public holidays in ${h.src('usc6103', '5 U.S.C. 6103')}: eleven days, five on a fixed date and six on a given weekday of a month. The second is the bank calendar, because a direct deposit settles only on a day the Federal Reserve Banks process payments. Their ${h.src('frbHolidays', 'holiday schedule')} follows the same eleven days with one difference: when a holiday falls on a Saturday, the banks open on the Friday before. In 2026 that happens once, for Independence Day.</p>
${h.holidayTable(2026, `Holidays of 2026 under 5 U.S.C. 6103, with the federal day off from ${h.src('opmHolidays', 'OPM')} and the closure days of the ${h.src('frbHolidays', 'Federal Reserve Banks')}.`)}
<p>For payroll the right-hand column is the one that counts: those are the weekdays when no direct deposit can settle. A paper check can still be handed out on a bank holiday, but most employees are paid by deposit, and the employer has to send the payroll file to its bank a business day or two ahead of the payday, so the payroll office works to the same calendar.</p>

<h2>Biweekly 2026, payday by payday</h2>
<p>The table lists the second Friday series of the year, the one that starts on ${h.day('2026-01-09')}. Every date is a Friday except where a holiday moved it, and each payday closes a two-week pay period that ends the Saturday before, six days earlier. Use the generator at the top for your own first payday and pay period delay.</p>
${h.payTable(b, 2026, `Biweekly Friday paydays in 2026 from ${h.md('2026-01-09')}, moved to the business day before a bank holiday.`)}
<p>Only ${h.moved(b, 2026).length === 1 ? 'one payday moves' : `${h.moved(b, 2026).length} paydays move`} in this series, because the other ten holidays fall on days with no payday. The first series, from ${h.md('2026-01-02')}, meets Juneteenth on ${h.day(h.hol(2026, 'juneteenth').date)} and New Year’s Day 2027, which is why it ends the year with an extra check.</p>

<h2>Semi-monthly and monthly pay in 2026</h2>
<p>Pay on fixed days of the month meets weekends far more often than holidays. With paydays on the 15th and the last day, ${h.moved(h.sched({ freq: 'semimonthly' }), 2026).length} of the 24 dates of 2026 fall on a Saturday or a Sunday, and the usual policy moves them to the Friday before. A monthly payroll on the last day of the month moves ${h.moved(h.sched({ freq: 'monthly' }), 2026).length} times. The frequency menu of the generator switches to these schedules, and the ${h.a('semi-monthly-pay-schedule-2027', 'semi-monthly page')} covers the choice of days in detail.</p>
<p>A schedule on the 1st and the 15th meets more holidays than one on the 15th and the last day, because New Year’s Day sits on the 1st. Whatever days you choose, the calendar counts 24 paydays a year for twice-monthly pay and 12 for monthly pay; only the weekly and biweekly schedules can gain a payday in a year.</p>

<h2>When the money arrives</h2>
<p>The payday is the date your employer settles the payment, and banks usually make a direct deposit available that day. When a payday is moved to the business day before a holiday, the deposit simply arrives earlier. When it is moved after, it arrives later, and the ${h.src('cfr778106', 'overtime rule of 29 CFR 778.106')} still expects overtime pay on the regular payday or as soon as practicable after it. The mini tool below shows, for any holiday of 2026 and either rule, the date a payday due on the holiday is actually paid.</p>
<!--tool:mini:holidaypay-->
<p>For the rest of the year at a glance, the ${h.a('direct-deposit-holidays', 'direct deposit holidays page')} lists the bank closures of 2026 and 2027, and the ${h.a('how-many-pay-periods-in-2026', 'pay periods 2026 page')} counts what each schedule pays in the year.</p>
`;
    },
  },
});
