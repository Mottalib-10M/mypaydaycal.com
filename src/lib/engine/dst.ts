/**
 * Daylight saving time under 15 U.S.C. 260a(a): clocks go forward at 2 a.m. on the second Sunday of
 * March and back at 2 a.m. on the first Sunday of November (rules in params-2026.json).
 * Hours worked on an overnight shift follow the DOL Hours Worked Advisor: 7 hours on the spring
 * night for an 8-hour shift, 9 on the fall night.
 */
import { type ISO, nthWeekday } from './calendar';
import P from '../../data/params-2026.json';

const D = P.dst;
export const dstStart = (y: number): ISO => nthWeekday(y, D.startMonth, D.startWeekday, D.startN);
export const dstEnd = (y: number): ISO => nthWeekday(y, D.endMonth, D.endWeekday, D.endN);
/** The next clock change on or after a date (the change day itself counts until it has passed). */
export function nextChange(today: ISO): { kind: 'spring' | 'fall'; date: ISO } {
  const y = +today.slice(0, 4);
  const list = [y, y + 1].flatMap((yy) => [{ kind: 'spring' as const, date: dstStart(yy) }, { kind: 'fall' as const, date: dstEnd(yy) }]);
  return list.find((c) => c.date >= today)!;
}
/** Minutes from "HH:MM". */
const mins = (t: string) => { const [h, m] = t.split(':').map(Number); return (h || 0) * 60 + (m || 0); };
/**
 * Hours actually worked on a shift that starts the evening before a change night (or on it) and
 * ends the next morning: the clock hours between start and end, minus the unpaid break, minus one
 * hour in spring or plus one in fall when the shift is on duty across 2 a.m.
 */
export function shiftHours(start: string, end: string, breakMin: number, kind: 'spring' | 'fall' | 'none') {
  let s = mins(start), e = mins(end);
  if (e <= s) e += 24 * 60; // ends the next day
  const scheduled = (e - s - breakMin) / 60;
  const two = (s <= 2 * 60 ? 2 * 60 : 26 * 60);
  const crosses = s < two && e > two;
  const delta = kind === 'none' || !crosses ? 0 : kind === 'spring' ? -1 : 1;
  return { scheduled, worked: scheduled + delta, delta, crosses };
}
/** Weekly hours and overtime hours (over 40 in the workweek, 29 CFR 778.104) when a change night adds or removes an hour. */
export function weekWithChange(otherHours: number, shift: number, rate: number) {
  const total = otherHours + shift;
  const ot = Math.max(0, total - P.flsa.overtimeAfter);
  const straight = total - ot;
  return { total, ot, pay: straight * rate + ot * rate * P.flsa.overtimeRate };
}
