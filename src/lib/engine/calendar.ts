/**
 * Calendar engine: dates as ISO strings (YYYY-MM-DD), computed in UTC so that a date never shifts
 * with the visitor's time zone. Holidays come from the rules of 5 U.S.C. 6103 stored in
 * params-2026.json; observance follows OPM (Saturday → Friday, Sunday → Monday) and the Federal
 * Reserve Banks (Saturday → no weekday closure, Sunday → Monday). Tests compare the output with the
 * OPM and Federal Reserve tables read on 2026-10-28.
 */
import P from '../../data/params-2026.json';

export type ISO = string;
const DAY = 86_400_000;
export const toUTC = (iso: ISO) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
export const fromUTC = (t: number): ISO => new Date(t).toISOString().slice(0, 10);
export const iso = (y: number, m: number, d: number): ISO => fromUTC(Date.UTC(y, m - 1, d));
export const addDays = (d: ISO, n: number): ISO => fromUTC(toUTC(d) + n * DAY);
/** 0 = Sunday … 6 = Saturday. */
export const dow = (d: ISO) => new Date(toUTC(d)).getUTCDay();
export const daysBetween = (a: ISO, b: ISO) => Math.round((toUTC(b) - toUTC(a)) / DAY);
export const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();
export const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
export const yearOf = (d: ISO) => +d.slice(0, 4);
export const isWeekend = (d: ISO) => dow(d) === 0 || dow(d) === 6;

/** n-th weekday of a month (n = 1 … 5), e.g. the third Monday of January. */
export function nthWeekday(y: number, m: number, weekday: number, n: number): ISO {
  const first = iso(y, m, 1);
  const shift = (weekday - dow(first) + 7) % 7;
  return addDays(first, shift + 7 * (n - 1));
}
/** Last given weekday of a month, e.g. the last Monday of May. */
export function lastWeekday(y: number, m: number, weekday: number): ISO {
  const last = iso(y, m, daysInMonth(y, m));
  return addDays(last, -((dow(last) - weekday + 7) % 7));
}

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** "2027-01-01" → "Friday, January 1, 2027" (or without weekday / year). */
export function longDate(d: ISO, opts: { weekday?: boolean; year?: boolean } = {}) {
  const { weekday = true, year = true } = opts;
  const s = `${MONTHS[+d.slice(5, 7) - 1]} ${+d.slice(8, 10)}${year ? `, ${d.slice(0, 4)}` : ''}`;
  return weekday ? `${WEEKDAYS[dow(d)]}, ${s}` : s;
}
export const shortDate = (d: ISO) => `${MONTHS[+d.slice(5, 7) - 1].slice(0, 3)} ${+d.slice(8, 10)}`;

/* ------------------------------------------------------------------ holidays */
type HRule = (typeof P.holidays.list)[number];
export interface Holiday {
  key: string; name: string;
  /** The date set by 5 U.S.C. 6103(a). */
  date: ISO;
  /** The weekday on which most federal employees take it (OPM). */
  observed: ISO;
  /** The weekday on which Federal Reserve Banks close, or null when they stay open (Saturday holiday). */
  fedClosed: ISO | null;
}
function ruleDate(r: HRule, y: number): ISO {
  if (r.rule === 'fixed') return iso(y, r.month, (r as { day: number }).day);
  if (r.rule === 'last') return lastWeekday(y, r.month, (r as { weekday: number }).weekday);
  return nthWeekday(y, r.month, (r as { weekday: number }).weekday, (r as { n: number }).n);
}
/** The eleven legal public holidays whose date falls in year y. */
export function federalHolidays(y: number): Holiday[] {
  return P.holidays.list.map((r) => {
    const date = ruleDate(r, y);
    const w = dow(date);
    const observed = w === 6 ? addDays(date, -1) : w === 0 ? addDays(date, 1) : date;
    const fedClosed = w === 6 ? null : w === 0 ? addDays(date, 1) : date;
    return { key: r.key, name: r.name, date, observed, fedClosed };
  });
}
export type Cal = 'fed' | 'federal' | 'weekends';
export const CAL_LABEL: Record<Cal, string> = {
  fed: 'Bank days (Federal Reserve holidays)',
  federal: 'Federal holidays as observed (OPM)',
  weekends: 'Weekends only',
};
const closedCache = new Map<string, Map<ISO, string>>();
/** Weekday closures of a calendar for years y-1 … y+1, with the holiday's name. */
export function closures(cal: Cal, y: number): Map<ISO, string> {
  const k = `${cal}-${y}`;
  if (closedCache.has(k)) return closedCache.get(k)!;
  const m = new Map<ISO, string>();
  if (cal !== 'weekends') {
    for (const yy of [y - 1, y, y + 1]) for (const h of federalHolidays(yy)) {
      const d = cal === 'fed' ? h.fedClosed : h.observed;
      if (d && !isWeekend(d)) m.set(d, h.name + (d !== h.date ? ' (observed)' : ''));
    }
  }
  closedCache.set(k, m);
  return m;
}
export function holidayOn(d: ISO, cal: Cal): string | null {
  return closures(cal, yearOf(d)).get(d) ?? null;
}
export const isBusinessDay = (d: ISO, cal: Cal) => !isWeekend(d) && !holidayOn(d, cal);
/** Previous (dir -1) or next (dir +1) business day, the date itself if it already is one. */
export function rollToBusinessDay(d: ISO, cal: Cal, dir: 1 | -1): ISO {
  let x = d;
  while (!isBusinessDay(x, cal)) x = addDays(x, dir);
  return x;
}
/** Holidays (observed) that fall in a calendar year on a weekday, for a calendar. */
export function holidaysInYear(y: number, cal: Exclude<Cal, 'weekends'>) {
  const out: Array<{ date: ISO; name: string }> = [];
  for (const [d, name] of closures(cal, y)) if (yearOf(d) === y) out.push({ date: d, name });
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

/* ------------------------------------------------------------- business days */
/** Business days from a to b. By default a is excluded and b included (days you wait). */
export function businessDaysBetween(a: ISO, b: ISO, cal: Cal, includeStart = false, includeEnd = true) {
  if (a > b) return -businessDaysBetween(b, a, cal, includeEnd, includeStart);
  let n = 0;
  for (let d = a; d <= b; d = addDays(d, 1)) {
    if ((d === a && !includeStart) || (d === b && !includeEnd)) continue;
    if (isBusinessDay(d, cal)) n++;
  }
  return n;
}
/** The date n business days after (or before, n < 0) a date, the date itself not counted. */
export function addBusinessDays(a: ISO, n: number, cal: Cal): ISO {
  const step = n < 0 ? -1 : 1;
  let d = a, left = Math.abs(Math.trunc(n));
  while (left > 0) { d = addDays(d, step); if (isBusinessDay(d, cal)) left--; }
  return d;
}
export interface MonthCount { month: number; days: number; weekdays: number; holidays: number; working: number; names: string[] }
/** Weekdays, holidays on weekdays and working days per month of a year. */
export function workingDaysByMonth(y: number, cal: Cal): MonthCount[] {
  return MONTHS.map((_, i) => {
    const m = i + 1, n = daysInMonth(y, m);
    let weekdays = 0, holidays = 0; const names: string[] = [];
    for (let d = 1; d <= n; d++) {
      const x = iso(y, m, d);
      if (isWeekend(x)) continue;
      weekdays++;
      const h = holidayOn(x, cal);
      if (h) { holidays++; names.push(h); }
    }
    return { month: m, days: n, weekdays, holidays, working: weekdays - holidays, names };
  });
}
/** How many times each weekday occurs in a year (index 0 = Sunday). */
export function weekdayCounts(y: number): number[] {
  const c = [0, 0, 0, 0, 0, 0, 0];
  for (let d = iso(y, 1, 1); yearOf(d) === y; d = addDays(d, 1)) c[dow(d)]++;
  return c;
}
/** Every date of a weekday in a year, e.g. all Fridays of 2027. */
export function weekdayDates(y: number, weekday: number): ISO[] {
  const out: ISO[] = [];
  let d = iso(y, 1, 1);
  d = addDays(d, (weekday - dow(d) + 7) % 7);
  for (; yearOf(d) === y; d = addDays(d, 7)) out.push(d);
  return out;
}
