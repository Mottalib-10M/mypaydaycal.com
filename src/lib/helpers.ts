/**
 * Writing helpers handed to every page: links, dates in words, tables, and the engines themselves,
 * so that every date and count in a page is computed from the rules of params-2026.json and never typed.
 */
import { route, ROUTES, type Locale } from '../i18n/routes';
import { formatNumberL, money, pct, dateL } from './format-l';
import * as C from './engine/calendar';
import * as PR from './engine/payroll';
import * as F from './engine/federal';
import * as D from './engine/dst';
import P from '../data/params-2026.json';

export type SourceKey = keyof typeof P.sources;
const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');
export function table(headers: string[], rows: Array<Array<string | number>>, caption: string | undefined, align: Array<'l' | 'r'>) {
  const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
  return `<div class="not-prose my-6 overflow-x-auto"><table class="journal w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-700 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatNumberL(c)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

export function helpers(lang: Locale = 'en', strict = false) {
  const a = (id: string, text: string) => {
    if (!ROUTES.some((r) => r.id === id)) { if (strict && id !== 'home') throw new Error(`Unknown page id in a link: ${id}`); return text; }
    return `<a href="${route(id, lang)}">${text}</a>`;
  };
  const ext = (url: string, text: string) => `<a href="${url}" target="_blank" rel="nofollow noopener noreferrer">${text}</a>`;
  const src = (k: SourceKey, text: string) => ext(P.sources[k].url, text);
  const num = (n: number, d = 0) => formatNumberL(n, 'en', d);
  /** "2027-01-01" → "January 1, 2027". */
  const date = (iso: string) => dateL(iso);
  /** "2027-01-01" → "Friday, January 1, 2027". */
  const day = (iso: string) => C.longDate(iso);
  /** "2027-01-01" → "Friday, January 1" (year left out). */
  const dayNoYear = (iso: string) => C.longDate(iso, { year: false });
  /** "2027-01-01" → "January 1" (no weekday, no year). */
  const md = (iso: string) => C.longDate(iso, { weekday: false, year: false });
  const wd = (iso: string) => C.WEEKDAYS[C.dow(iso)];
  /** One holiday of a year by key. */
  const hol = (y: number, key: string) => C.federalHolidays(y).find((x) => x.key === key)!;
  /** Holidays of a year: date, OPM day off, Federal Reserve closure. */
  const holidayTable = (y: number, caption?: string) => table(['Holiday', 'Date in law', 'Federal day off', 'Fed banks closed'],
    C.federalHolidays(y).map((x) => [x.name, day(x.date), x.observed === x.date ? 'same day' : dayNoYear(x.observed), x.fedClosed ? (x.fedClosed === x.date ? 'same day' : dayNoYear(x.fedClosed)) : 'open (Saturday holiday)']),
    caption, ['l', 'l', 'l', 'l']);
  /** A schedule with defaults. */
  const sched = (o: Partial<PR.Schedule>): PR.Schedule => ({ ...PR.DEFAULT_SCHEDULE, ...o });
  /** Paydays of a schedule in a year as a table (paid date, scheduled date, why it moved). */
  const payTable = (s: PR.Schedule, y: number, caption?: string, withPeriod = false) => {
    const ps = PR.paydays(s, y);
    const head = ['#', 'Paid on', 'Scheduled', 'Why it moved'];
    if (withPeriod) head.push('Pay period');
    return table(head, ps.map((p, i) => {
      const r: Array<string | number> = [String(i + 1), day(p.paid), p.nominal === p.paid ? 'same day' : C.longDate(p.nominal, { year: C.yearOf(p.nominal) !== y }), p.reason ?? ''];
      if (withPeriod) r.push(p.periodStart ? `${C.shortDate(p.periodStart)} to ${C.shortDate(p.periodEnd!)}` : '');
      return r;
    }), caption, ['r', 'l', 'l', 'l', 'l']);
  };
  /** Paydays of a schedule that moved in a year: "Friday, December 24 (Christmas Day)". */
  const moved = (s: PR.Schedule, y: number) => PR.paydays(s, y).filter((p) => p.paid !== p.nominal);
  const ly = (y: number) => F.leaveYear(y)!;
  return {
    lang, a, ext, src, num, money, pct: (x: number, d = 0) => pct(x, 'en', d), P,
    date, day, dayNoYear, md, wd, hol, holidayTable, sched, payTable, moved, ly,
    cal: C, pay: PR, fed: F, dst: D,
    table: (h: string[], r: Array<Array<string | number>>, c?: string, al: Array<'l' | 'r'> = []) => table(h, r, c, al),
  };
}
export type Helpers = ReturnType<typeof helpers>;
