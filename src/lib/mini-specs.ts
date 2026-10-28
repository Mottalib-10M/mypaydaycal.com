/**
 * Mini-tools of the pages (RECETTE §9.3): one subject = one calculation, always through the engines
 * (`lib/engine/*.ts`) and params-2026.json, never a second formula.
 */
import type { MiniSpec } from './mini-types';
import { formatNumberL } from './format-l';
import * as C from './engine/calendar';
import * as PR from './engine/payroll';
import * as F from './engine/federal';
import * as D from './engine/dst';
import P from '../data/params-2026.json';

const n0 = (v: number) => formatNumberL(v);
const usd = (v: number) => `$${formatNumberL(v, 'en', 2)}`;
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Math.round(Number.isFinite(x) ? x : a)));
const years = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => ({ value: String(a + i), label: String(a + i) }));
const WORKDAYS = [1, 2, 3, 4, 5].map((w) => ({ value: String(w), label: C.WEEKDAYS[w] }));
const ALLDAYS = C.WEEKDAYS.map((w, i) => ({ value: String(i), label: w }));
const CALS: C.Cal[] = ['fed', 'federal', 'weekends'];
const calOpts = CALS.map((c, i) => ({ value: String(i), label: C.CAL_LABEL[c] }));
const FREQS: PR.Freq[] = ['weekly', 'biweekly', 'semimonthly', 'monthly'];
const freqOpts = FREQS.map((f, i) => ({ value: String(i), label: PR.FREQ_LABEL[f] }));
const HOLS = P.holidays.list;
const day = (d: string) => C.longDate(d);
const dayNY = (d: string) => C.longDate(d, { year: false });

const SPECS: Record<string, () => MiniSpec> = {
  /** Biweekly paydays in a year for a payday weekday: the two possible series. */
  payperiods: () => ({
    title: 'How many biweekly paydays in a year?', cta: 'Build the full calendar', ctaPage: 'biweekly-pay-schedule-2027',
    inputs: [
      { id: 'y', label: 'Year', def: 2027, options: years(2026, 2035) },
      { id: 'w', label: 'Payday', def: 5, options: WORKDAYS },
    ],
    run: (v) => {
      const y = clamp(v.y, 2026, 2035), w = clamp(v.w, 1, 5);
      const s = PR.biweeklySeries(y, w);
      const max = Math.max(...s.map((x) => x.count));
      return {
        head: [`Every other ${C.WEEKDAYS[w]} in ${y}`, max === 27 ? '26 or 27 paydays' : '26 paydays'],
        rows: s.map((x) => [`Series starting ${dayNY(x.first)}`, `${x.count} paydays, last ${C.longDate(x.last, { year: false })}`] as [string, string]),
        note: `Dates as scheduled, before any holiday move. Weekly pay gives ${C.weekdayCounts(y)[w]} ${C.WEEKDAYS[w]}s in ${y}.`,
      };
    },
  }),
  /** How many times a weekday occurs in a year. */
  weekdays: () => ({
    title: 'Count a weekday in any year', cta: 'Paydays that fall in a year', ctaPage: 'how-many-pay-periods-in-2027',
    inputs: [
      { id: 'y', label: 'Year', def: 2027, options: years(2026, 2035) },
      { id: 'w', label: 'Day of the week', def: 5, options: ALLDAYS },
    ],
    run: (v) => {
      const y = clamp(v.y, 2026, 2035), w = clamp(v.w, 0, 6);
      const ds = C.weekdayDates(y, w);
      const five = C.MONTHS.filter((_, i) => ds.filter((d) => +d.slice(5, 7) === i + 1).length === 5);
      return {
        head: [`${C.WEEKDAYS[w]}s in ${y}`, n0(ds.length)],
        rows: [['First', day(ds[0])], ['Last', day(ds[ds.length - 1])], [`Months with five ${C.WEEKDAYS[w]}s`, five.length ? `${five.length}: ${five.join(', ')}` : 'none']],
        note: `${y} has ${C.isLeap(y) ? 366 : 365} days: 52 weeks and ${C.isLeap(y) ? 2 : 1} extra day${C.isLeap(y) ? 's' : ''}, so ${C.isLeap(y) ? 'two weekdays' : 'one weekday'} occur${C.isLeap(y) ? '' : 's'} 53 times.`,
      };
    },
  }),
  /** Working days in a year or a month, for a holiday calendar. */
  workdays: () => ({
    title: 'Working days in a month or a year', cta: 'Count business days between two dates', ctaPage: 'business-days-calculator',
    inputs: [
      { id: 'y', label: 'Year', def: 2027, options: years(2026, 2030) },
      { id: 'm', label: 'Month', def: 0, options: [{ value: '0', label: 'Whole year' }, ...C.MONTHS.map((m, i) => ({ value: String(i + 1), label: m }))] },
      { id: 'c', label: 'Holidays', def: 1, options: calOpts },
    ],
    run: (v) => {
      const y = clamp(v.y, 2026, 2030), m = clamp(v.m, 0, 12), cal = CALS[clamp(v.c, 0, 2)];
      const all = C.workingDaysByMonth(y, cal);
      const sel = m ? [all[m - 1]] : all;
      const sum = (k: 'weekdays' | 'holidays' | 'working') => sel.reduce((s, x) => s + x[k], 0);
      const names = sel.flatMap((x) => x.names);
      return {
        head: [`Working days in ${m ? `${C.MONTHS[m - 1]} ` : ''}${y}`, n0(sum('working'))],
        rows: [['Weekdays, Monday to Friday', n0(sum('weekdays'))], ['Holidays on a weekday', n0(sum('holidays'))], ['Working hours at 8 a day', n0(sum('working') * 8)]],
        note: names.length ? `Holidays taken out: ${names.slice(0, 4).join(', ')}${names.length > 4 ? ` and ${names.length - 4} more` : ''}.` : 'No holiday falls on a weekday in this period.',
      };
    },
  }),
  /** A holiday of a year: day off, bank closure and where a payday on it goes. */
  holidaypay: () => ({
    title: 'Payday on a holiday: when does the money arrive?', cta: 'Count bank days to a deposit', ctaPage: 'business-days-calculator',
    inputs: [
      { id: 'y', label: 'Year', def: 2027, options: years(2026, 2030) },
      { id: 'h', label: 'Holiday', def: 10, options: HOLS.map((x, i) => ({ value: String(i), label: x.name })) },
      { id: 'r', label: 'Your employer’s rule', def: 0, options: [{ value: '0', label: 'Pay the business day before' }, { value: '1', label: 'Pay the next business day' }] },
    ],
    run: (v) => {
      const y = clamp(v.y, 2026, 2030), k = clamp(v.h, 0, HOLS.length - 1), r = clamp(v.r, 0, 1);
      const x = C.federalHolidays(y)[k];
      const bankDay = x.fedClosed;
      const target = bankDay ?? x.date;
      const paid = C.rollToBusinessDay(target, 'fed', r === 0 ? -1 : 1);
      return {
        head: [`A payday due on ${dayNY(target)} is paid`, day(paid)],
        rows: [['Date in law', day(x.date)], ['Federal Reserve Banks', bankDay ? `closed ${dayNY(bankDay)}` : 'open: Saturday holiday, no weekday closure'], ['Federal employees’ day off', dayNY(x.observed)]],
        note: 'Bank days follow the Federal Reserve holiday schedule. Your employer’s payroll policy decides whether pay comes before or after.',
      };
    },
  }),
  /** Gross pay per paycheck from an annual salary, by frequency. */
  perpaycheck: () => ({
    title: 'Gross pay per paycheck', cta: 'Hourly, salary and 27-paycheck years', ctaPage: 'biweekly-pay-calculator',
    inputs: [
      { id: 'a', label: 'Annual salary', def: 60000, unit: '$', max: 5_000_000 },
      { id: 'f', label: 'Pay frequency', def: 1, options: freqOpts },
    ],
    run: (v) => {
      const a = clamp(v.a, 0, 5_000_000), f = FREQS[clamp(v.f, 0, 3)];
      return {
        head: [`${PR.FREQ_LABEL[f]}: gross per paycheck`, usd(PR.perPaycheck(a, f))],
        rows: FREQS.filter((x) => x !== f).map((x) => [`${PR.FREQ_LABEL[x]} (${PR.PERIODS[x]} a year)`, usd(PR.perPaycheck(a, x))] as [string, string]),
        note: 'Before taxes and deductions, in a year with the standard number of paydays.',
      };
    },
  }),
  /** Federal employees: annual rate to hourly and biweekly under 5 U.S.C. 5504. */
  fedbiweekly: () => ({
    title: 'Federal biweekly pay from an annual rate', cta: 'Federal pay periods 2027', ctaPage: 'federal-pay-calendar-2027',
    inputs: [{ id: 'a', label: 'Annual rate of basic pay', def: 75000, unit: '$', max: 500_000 }],
    run: (v) => {
      const a = clamp(v.a, 0, 500_000);
      const f = PR.federalBiweekly(a);
      return {
        head: ['Gross biweekly pay (80 hours)', usd(f.biweekly)],
        rows: [['Hourly rate (annual ÷ 2,087)', usd(f.hourly)], ['26 pay periods', usd(f.biweekly * 26)], ['27 pay periods', usd(f.biweekly * 27)]],
        note: 'Rounded to the nearest cent as 5 U.S.C. 5504 requires; before deductions.',
      };
    },
  }),
  /** Federal leave year: periods and the use-or-lose date. */
  leaveyear: () => ({
    title: 'Federal leave year at a glance', cta: 'Every pay period of the year', ctaPage: 'federal-pay-calendar-2027',
    inputs: [{ id: 'y', label: 'Leave year', def: 2027, options: years(2026, 2030) }],
    run: (v) => {
      const y = clamp(v.y, 2026, 2030);
      const l = F.leaveYear(y)!;
      return {
        head: [`Pay periods in leave year ${y}`, n0(l.count)],
        rows: [['Starts', day(l.start)], ['Ends', day(l.end)], ['Pay period 1', `${dayNY(l.periods[0].start)} to ${dayNY(l.periods[0].end)}`], ['Schedule annual leave by', l.useOrLose ? day(l.useOrLose) : 'not published']],
        note: 'From the OPM leave year table; pay dates themselves are set by each payroll provider.',
      };
    },
  }),
  /** Years with 27 biweekly paydays. */
  years27: () => ({
    title: 'Next years with 27 biweekly paydays', cta: 'Why some years have 27', ctaPage: '27-pay-periods',
    inputs: [{ id: 'w', label: 'Payday', def: 5, options: WORKDAYS }],
    run: (v) => {
      const w = clamp(v.w, 1, 5);
      const list = PR.years27(2026, 2060, w);
      return {
        head: [`Next 27-payday year, every other ${C.WEEKDAYS[w]}`, String(list[0]?.year ?? 'none')],
        rows: list.slice(0, 4).map((x) => [String(x.year), `if the first payday is ${dayNY(x.first)}`] as [string, string]),
        note: 'Counted on scheduled dates. A holiday rule can push the first or last payday into the next or previous year.',
      };
    },
  }),
  /** Semi-monthly paydays of a month. */
  semimonthly: () => ({
    title: 'Semi-monthly paydays of a month', cta: 'The whole year', ctaPage: 'semi-monthly-pay-schedule-2027',
    inputs: [
      { id: 'y', label: 'Year', def: 2027, options: years(2026, 2030) },
      { id: 'm', label: 'Month', def: 12, options: C.MONTHS.map((m, i) => ({ value: String(i + 1), label: m })) },
      { id: 'r', label: 'If it falls on a weekend or holiday', def: 0, options: [{ value: '0', label: 'Pay the business day before' }, { value: '1', label: 'Pay the next business day' }] },
    ],
    run: (v) => {
      const y = clamp(v.y, 2026, 2030), m = clamp(v.m, 1, 12), r = clamp(v.r, 0, 1);
      const s: PR.Schedule = { ...PR.DEFAULT_SCHEDULE, freq: 'semimonthly', d1: 15, d2: 31, rule: r === 0 ? 'before' : 'after' };
      const all = PR.paydays(s, y).concat(PR.paydays(s, y + 1));
      const mm = String(m).padStart(2, '0');
      const ps = all.filter((p) => p.nominal.slice(0, 7) === `${y}-${mm}`);
      return {
        head: [`Paydays for ${C.MONTHS[m - 1]} ${y}`, ps.map((p) => C.shortDate(p.paid)).join(' and ')],
        rows: ps.map((p) => [`Due ${C.longDate(p.nominal, { year: false })}`, p.paid === p.nominal ? 'paid that day' : `paid ${day(p.paid)} (${p.reason})`] as [string, string]),
        note: 'The 15th and the last day of the month; bank holidays from the Federal Reserve schedule.',
      };
    },
  }),
  /** Clock change dates of a year. */
  dstdates: () => ({
    title: 'Clock changes of any year', cta: 'Live countdown to the next change', ctaPage: 'when-does-daylight-saving-time-end',
    inputs: [{ id: 'y', label: 'Year', def: 2027, options: years(2026, 2040) }],
    run: (v) => {
      const y = clamp(v.y, 2026, 2040);
      const a = D.dstStart(y), b = D.dstEnd(y);
      return {
        head: [`Clocks fall back in ${y}`, day(b)],
        rows: [['Spring forward, 2 a.m. becomes 3 a.m.', day(a)], ['Fall back, 2 a.m. becomes 1 a.m.', day(b)], ['Days on daylight time', n0(C.daysBetween(a, b))]],
        note: 'Second Sunday of March and first Sunday of November under 15 U.S.C. 260a, unless Congress changes the law.',
      };
    },
  }),
  /** Hours worked on an overnight shift on a change night. */
  shiftnight: () => ({
    title: 'Hours worked across a clock change', cta: 'Overtime for that week', ctaPage: 'daylight-saving-time-night-shift-pay',
    inputs: [
      { id: 'h', label: 'Shift length on the clock', def: 8, unit: 'h', max: 16, decimals: 1 },
      { id: 'k', label: 'Night', def: 1, options: [{ value: '0', label: 'Spring forward (March)' }, { value: '1', label: 'Fall back (November)' }] },
    ],
    run: (v) => {
      const h = Math.max(0, Math.min(16, Number(v.h) || 0)), k = clamp(v.k, 0, 1);
      const worked = h + (k === 0 ? -1 : 1);
      return {
        head: ['Hours actually worked', formatNumberL(Math.max(0, worked), 'en', 1)],
        rows: [['Shift on the clock', formatNumberL(h, 'en', 1)], ['Change', k === 0 ? 'one hour less' : 'one extra hour']],
        note: 'For a shift on duty across 2 a.m. The Department of Labor counts the hours actually worked.',
      };
    },
  }),
};
export const SPEC_IDS = Object.keys(SPECS);
export function getSpec(id: string): MiniSpec {
  const f = SPECS[id];
  if (!f) throw new Error(`Unknown mini spec: ${id}`);
  return f();
}
