import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'working-days-in-2027',
  group: 'banking',
  order: 50,
  tool: { kind: 'mini:workdays', props: { y: 2027, m: 0, c: 1 } },
  mini: { kind: 'mini:weekdays', props: { y: 2027, w: 1 } },
  related: ['business-days-calculator', 'how-many-fridays-in-2027', 'federal-pay-calendar-2027', 'semi-monthly-pay-schedule-2027'],
  sources: ['opmHolidays', 'frbHolidays', 'usc6103', 'usc5504'],
  en: {
    slug: 'working-days-in-2027',
    nav: 'Working days in 2027',
    card: 'Working days in 2027 month by month: 261 weekdays, 249 federal working days, 252 bank business days, with the holidays named.',
    title: 'Working Days in 2027: 249 Federal, 252 Bank, by Month',
    description: 'Working days in 2027 by month: 261 weekdays, minus federal holidays for 249 working days, or bank holidays for 252 business days, with work hours per month.',
    h1: 'How many working days are there in 2027?',
    intro: 'Pick a month or the whole year and the holiday calendar: the counter gives working days, holidays and work hours.',
    resume: (h) => {
      const sum = (c: 'fed' | 'federal' | 'weekends') => h.cal.workingDaysByMonth(2027, c).reduce((s, m) => s + m.working, 0);
      return `Year 2027 has ${sum('weekends')} weekdays: 52 full weeks of five days, plus one extra Friday, because the year starts and ends on a Friday. Take out the federal holidays as federal employees observe them and ${sum('federal')} working days remain, or ${sum('federal') * 8} hours at eight a day. Twelve days come out rather than eleven, because New Year’s Day 2028 falls on a Saturday and its day off is ${h.day('2027-12-31')}, while New Year’s Day 2027 itself is a Friday. The bank calendar gives a different number, ${sum('fed')} business days, because the Federal Reserve Banks stay open on the Fridays before Saturday holidays: Juneteenth on ${h.md(h.hol(2027, 'juneteenth').observed)}, Christmas on ${h.md(h.hol(2027, 'christmas').observed)} and ${h.md('2027-12-31')}. On the bank calendar the busiest months have ${Math.max(...h.cal.workingDaysByMonth(2027, 'fed').map((m) => m.working))} business days (${h.cal.workingDaysByMonth(2027, 'fed').filter((m, _, a) => m.working === Math.max(...a.map((x) => x.working))).map((m) => h.cal.MONTHS[m.month - 1]).join(' and ')}) and the shortest ${Math.min(...h.cal.workingDaysByMonth(2027, 'fed').map((m) => m.working))} (${h.cal.workingDaysByMonth(2027, 'fed').filter((m, _, a) => m.working === Math.min(...a.map((x) => x.working))).map((m) => h.cal.MONTHS[m.month - 1]).join(' and ')}). The counter above gives any month for either calendar, and the hours that go with it.`;
    },
    faqs: (h) => [
      { q: 'How many work hours are in 2027?', a: `At eight hours a day, ${h.cal.workingDaysByMonth(2027, 'weekends').reduce((s, m) => s + m.working, 0) * 8} hours of weekdays, or ${h.cal.workingDaysByMonth(2027, 'federal').reduce((s, m) => s + m.working, 0) * 8} hours once federal holidays are taken out. Federal pay does not use the year’s actual hours: it divides the annual rate by 2,087, the average number of paid hours over a 28-year cycle.` },
      { q: 'How many working days are in each month of 2027?', a: `On the federal calendar: ${h.cal.workingDaysByMonth(2027, 'federal').map((m, i) => `${h.cal.MONTHS[i]} ${m.working}`).join(', ').replace(/, ([^,]+)$/, ' and $1')}. The counter at the top of the page gives the same figures, and the bank-calendar figures, for any month you choose.` },
      { q: 'Is December 31, 2027 a working day?', a: 'Not for federal employees: it is the day off for New Year’s Day 2028, which falls on a Saturday. It is a business day for banks, which stay open the Friday before a Saturday holiday, and for most private employers, unless their own holiday calendar gives it as a day off.' },
    ],
    body: (h) => {
      const f = h.cal.workingDaysByMonth(2027, 'federal'), b = h.cal.workingDaysByMonth(2027, 'fed');
      const rows = f.map((m, i) => [h.cal.MONTHS[i], String(m.weekdays), String(m.working), String(b[i].working), m.names.join(', ')]);
      return `
<h2>Working days in 2027, month by month</h2>
<p>The table gives the weekdays of each month, the working days once federal days off are removed, the bank business days once Federal Reserve holidays are removed, and the holidays concerned. Federal days off come from the ${h.src('opmHolidays', 'OPM tables for 2027 and 2028')}; bank holidays from the ${h.src('frbHolidays', 'Federal Reserve schedule')}.</p>
${h.table(['Month', 'Weekdays', 'Federal working days', 'Bank business days', 'Federal days off'], rows, 'Working days in 2027 under each calendar.', ['l', 'r', 'r', 'r', 'l'])}

<h2>Why the totals differ</h2>
<p>The eleven holidays of ${h.src('usc6103', '5 U.S.C. 6103')} do not all land on weekdays. In 2027, Juneteenth (June 19) and Christmas (December 25) fall on Saturdays and Independence Day (July 4) on a Sunday. Federal employees get a weekday off for each: the Friday before a Saturday holiday, the Monday after a Sunday one. The Federal Reserve Banks close only on the Monday after a Sunday holiday. Add the Friday off for New Year’s Day 2028 and the two calendars end three days apart.</p>
<p>Private employers choose their own paid holidays. Many give fewer than eleven; some add the day after Thanksgiving or Christmas Eve. The “weekends only” option of the counter gives the raw weekday count to subtract your own list from.</p>

<h2>Working days and pay</h2>
<p>Salaried pay does not change with the number of working days in a month, but some pay does: daily-rate contracts, per-diem staff, and the hourly employees whose monthly hours follow the calendar. A month of 23 working days pays 184 hours at eight a day, against 152 for a month of 19. Federal pay smooths this by law: ${h.src('usc5504', '5 U.S.C. 5504')} sets the hourly rate at the annual rate divided by 2,087, and every biweekly period pays 80 hours, holidays included.</p>
<p>Counting a weekday instead of all working days is the other common need, for instance Mondays for a weekly meeting or Fridays for a weekly payday. The counter below gives any weekday of any year.</p>
<!--tool:mini:weekdays-->

<h2>Using the count for planning</h2>
<p>Project budgets, staffing plans and service-level targets often run on working days. A team that needs one person every working day of 2027 needs ${h.cal.workingDaysByMonth(2027, 'fed').reduce((s, m) => s + m.working, 0)} person-days on the bank calendar, before vacation and sick leave. A deadline set in working days slips past a holiday: ten working days from ${h.day('2027-11-22')} end on ${h.day(h.cal.addBusinessDays('2027-11-22', 10, 'federal'))} on the federal calendar, because Thanksgiving falls in between.</p>

<h2>From 2026 to 2028</h2>
<p>For comparison, 2026 has ${h.cal.workingDaysByMonth(2026, 'federal').reduce((s, m) => s + m.working, 0)} federal working days and 2028 has ${h.cal.workingDaysByMonth(2028, 'federal').reduce((s, m) => s + m.working, 0)}. Counts between two exact dates, rather than whole months, are the job of the ${h.a('business-days-calculator', 'business days calculator')}; the ${h.a('how-many-fridays-in-2027', 'Fridays in 2027 page')} covers the extra Friday that makes 2027 a 261-weekday year.</p>
`;
    },
  },
});
