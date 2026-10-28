/**
 * Pay schedule engine. A schedule gives nominal paydays (every 7 or 14 days from an anchor payday,
 * two set days a month, or one day a month); each nominal payday that is not a business day is moved
 * to the previous or next business day, or left as is, according to the employer's rule. No law
 * fixes that rule: the FLSA asks for a regular payday (29 CFR 778.106) and states set their own
 * frequencies, so the rule is an input.
 */
import { type ISO, type Cal, addDays, daysBetween, daysInMonth, dow, iso, isBusinessDay, holidayOn, isWeekend, yearOf, WEEKDAYS, rollToBusinessDay } from './calendar';
import P from '../../data/params-2026.json';

export type Freq = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
export type Rule = 'before' | 'after' | 'none';
export const FREQ_LABEL: Record<Freq, string> = { weekly: 'Weekly', biweekly: 'Biweekly (every 2 weeks)', semimonthly: 'Semi-monthly (twice a month)', monthly: 'Monthly' };
export const RULE_LABEL: Record<Rule, string> = { before: 'Pay the business day before', after: 'Pay the next business day', none: 'Keep the date' };
/** Paychecks in a standard year, the divisors used to turn a salary into a paycheck. */
export const PERIODS: Record<Freq, number> = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 };

export interface Schedule {
  freq: Freq;
  /** Weekly / biweekly: any payday of the series. */
  anchor: ISO;
  /** Semi-monthly: the two days of the month (31 = last day). */
  d1: number; d2: number;
  /** Monthly: day of the month (31 = last day). */
  day: number;
  rule: Rule;
  cal: Cal;
  /** Weekly / biweekly: days between the end of the pay period and payday (0 to 20). */
  lag: number;
}
export const DEFAULT_SCHEDULE: Schedule = { freq: 'biweekly', anchor: '2027-01-08', d1: 15, d2: 31, day: 31, rule: 'before', cal: 'fed', lag: 6 };

export interface Payday {
  /** The date the schedule calls for. */
  nominal: ISO;
  /** The date the money is paid after the weekend and holiday rule. */
  paid: ISO;
  /** Why it moved: "Saturday", "Christmas Day"…, or null. */
  reason: string | null;
  /** Weekly / biweekly: pay period covered. */
  periodStart?: ISO; periodEnd?: ISO;
}
const clampDay = (y: number, m: number, d: number) => iso(y, m, Math.min(d, daysInMonth(y, m)));

/** Nominal paydays between two dates (inclusive). */
export function nominalDates(s: Schedule, from: ISO, to: ISO): ISO[] {
  const out: ISO[] = [];
  if (s.freq === 'weekly' || s.freq === 'biweekly') {
    const step = s.freq === 'weekly' ? 7 : 14;
    const k0 = Math.ceil(daysBetween(s.anchor, from) / step);
    for (let d = addDays(s.anchor, k0 * step); d <= to; d = addDays(d, step)) out.push(d);
    return out;
  }
  for (let y = yearOf(from); y <= yearOf(to); y++) for (let m = 1; m <= 12; m++) {
    const days = s.freq === 'monthly' ? [s.day] : [...new Set([s.d1, s.d2])].sort((a, b) => a - b);
    for (const d of days) { const x = clampDay(y, m, d); if (x >= from && x <= to) out.push(x); }
  }
  return out.sort();
}
function move(d: ISO, s: Schedule): { paid: ISO; reason: string | null } {
  if (s.rule === 'none' || isBusinessDay(d, s.cal)) return { paid: d, reason: null };
  const reason = isWeekend(d) ? WEEKDAYS[dow(d)] : holidayOn(d, s.cal);
  return { paid: rollToBusinessDay(d, s.cal, s.rule === 'before' ? -1 : 1), reason };
}
/** Paydays whose PAID date falls in year y (what lands in that year's W-2 wages). */
export function paydays(s: Schedule, y: number): Payday[] {
  const nom = nominalDates(s, iso(y - 1, 12, 1), iso(y + 1, 1, 31));
  const step = s.freq === 'weekly' ? 7 : s.freq === 'biweekly' ? 14 : 0;
  return nom.map((n) => {
    const { paid, reason } = move(n, s);
    const p: Payday = { nominal: n, paid, reason };
    if (step) { p.periodEnd = addDays(n, -s.lag); p.periodStart = addDays(p.periodEnd, -(step - 1)); }
    return p;
  }).filter((p) => yearOf(p.paid) === y);
}
/** Nominal paydays in a year (before any move): 26 or 27 for a biweekly schedule. */
export const nominalCount = (s: Schedule, y: number) => nominalDates(s, iso(y, 1, 1), iso(y, 12, 31)).length;

/** The two biweekly series that pay on a weekday in year y, and how many paydays each has. */
export function biweeklySeries(y: number, weekday: number) {
  const jan1 = iso(y, 1, 1);
  const first = addDays(jan1, (weekday - dow(jan1) + 7) % 7);
  return [first, addDays(first, 7)].map((a) => {
    const s: Schedule = { ...DEFAULT_SCHEDULE, freq: 'biweekly', anchor: a, rule: 'none' };
    const ds = nominalDates(s, jan1, iso(y, 12, 31));
    return { first: ds[0], last: ds[ds.length - 1], count: ds.length };
  });
}
/** Years from y0 to y1 with a 27-payday biweekly series, and the first payday of that series. */
export function years27(y0: number, y1: number, weekday: number) {
  const out: Array<{ year: number; first: ISO }> = [];
  for (let y = y0; y <= y1; y++) for (const s of biweeklySeries(y, weekday)) if (s.count === 27) out.push({ year: y, first: s.first });
  return out;
}

/* ------------------------------------------------------------------ amounts */
export const round2 = (x: number) => Math.round(x * 100 + 1e-9) / 100;
/** Gross pay per paycheck from an annual salary in a standard year. */
export const perPaycheck = (annual: number, f: Freq) => annual / PERIODS[f];
/** Gross pay per paycheck from an hourly rate (FLSA weekly equivalents, 29 CFR 778.113). */
export function hourlyPaycheck(rate: number, hoursPerWeek: number, f: Freq) {
  const weekly = rate * hoursPerWeek;
  return f === 'weekly' ? weekly : f === 'biweekly' ? weekly * 2 : f === 'semimonthly' ? (weekly * 52) / 24 : (weekly * 52) / 12;
}
/** What a salaried employee is paid in a year with n biweekly paydays, by employer method. */
export function salaryInYear(annual: number, paychecks: number, method: 'per26' | 'spread') {
  const each = method === 'per26' ? annual / 26 : annual / paychecks;
  return { each, total: each * paychecks, extra: each * paychecks - annual };
}
/** Federal employees: hourly = annual / 2,087 to the nearest cent, biweekly = hourly × 80 (5 U.S.C. 5504). */
export function federalBiweekly(annual: number) {
  const hourly = round2(annual / P.federalPay.hoursDivisor);
  return { hourly, biweekly: round2(hourly * P.federalPay.biweeklyHours) };
}

/* ----------------------------------------------------------------- .ics file */
/** An iCalendar file with one all-day event per payday (RFC 5545), built in the browser. */
export function toIcs(days: Payday[], name: string, stamp: string): string {
  const esc = (t: string) => t.replace(/[\\;,]/g, (c) => `\\${c}`);
  const d8 = (d: ISO) => d.replace(/-/g, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Radif Partners//US Payroll Calendar//EN', 'CALSCALE:GREGORIAN', `X-WR-CALNAME:${esc(name)}`];
  for (const p of days) {
    lines.push('BEGIN:VEVENT', `UID:${d8(p.paid)}-${d8(p.nominal)}@us-payroll-calendar`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${d8(p.paid)}`, `DTEND;VALUE=DATE:${d8(addDays(p.paid, 1))}`, `SUMMARY:${esc('Payday')}`);
    const desc = [p.reason ? `Moved from ${p.nominal} (${p.reason})` : '', p.periodStart ? `Pay period ${p.periodStart} to ${p.periodEnd}` : ''].filter(Boolean).join('. ');
    if (desc) lines.push(`DESCRIPTION:${esc(desc)}`);
    lines.push('TRANSP:TRANSPARENT', 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}
