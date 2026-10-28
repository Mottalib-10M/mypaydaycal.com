/**
 * Federal pay periods: biweekly, Sunday to Saturday, numbered from the first full pay period of the
 * calendar year (5 CFR 630.201). The leave-year start dates are those of the OPM fact sheet, stored
 * in params-2026.json; a leave year has 26 periods, or 27 when 378 days separate two starts (2023).
 */
import { type ISO, addDays, daysBetween } from './calendar';
import P from '../../data/params-2026.json';

const STARTS = P.leaveYears.starts as Record<string, ISO>;
export const LEAVE_YEARS = Object.keys(STARTS).map(Number).filter((y) => STARTS[String(y + 1)]);
export interface PayPeriod { n: number; start: ISO; end: ISO }
export function leaveYear(y: number) {
  const start = STARTS[String(y)], next = STARTS[String(y + 1)];
  if (!start || !next) return null;
  const count = daysBetween(start, next) / 14;
  const periods: PayPeriod[] = Array.from({ length: count }, (_, i) => ({ n: i + 1, start: addDays(start, 14 * i), end: addDays(start, 14 * i + 13) }));
  return { year: y, start, end: addDays(next, -1), count, periods, useOrLose: (P.leaveYears.useOrLose as Record<string, ISO>)[String(y)] ?? null };
}
/** The leave year and pay period that contain a date. */
export function periodOf(d: ISO) {
  for (const y of LEAVE_YEARS) {
    const ly = leaveYear(y)!;
    if (d >= ly.start && d <= ly.end) return { year: y, period: ly.periods.find((p) => d >= p.start && d <= p.end)! };
  }
  return null;
}
