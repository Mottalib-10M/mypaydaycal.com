/** Formatting for the en-US pages (RECETTE §4: one locale). */
export type L = 'en';
const TAG = 'en-US';
export const langTag = (_lang: L = 'en') => TAG;
const cache = new Map<string, Intl.NumberFormat>();
function nf(o: Intl.NumberFormatOptions) {
  const k = JSON.stringify(o);
  if (!cache.has(k)) cache.set(k, new Intl.NumberFormat(TAG, o));
  return cache.get(k)!;
}
export const formatNumberL = (v: number, _lang: L = 'en', d = 0) => nf({ minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
/** $1,709 ; cents only when the amount has them ($115.50). */
export const money = (v: number, _cur: 'USD' = 'USD', _lang: L = 'en') => {
  const cents = Math.round(v * 100) % 100 !== 0;
  return `$${formatNumberL(v, 'en', cents ? 2 : 0)}`;
};
/** A coin's metal value: dollars and cents from 10 cents up ($0.68, $41.20), else cents with one
 * decimal (1.6¢, 0.6¢), so that a zinc penny does not read "$0.01". */
export const usd = (v: number) => (Math.abs(v) >= 0.1 ? `$${formatNumberL(v, 'en', 2)}` : `${formatNumberL(v * 100, 'en', v * 100 >= 10 ? 0 : 1)}¢`);
/** A price with cents always ($54.26, $6.54). */
export const price = (v: number) => `$${formatNumberL(v, 'en', 2)}`;
export const pct = (v: number, _lang: L = 'en', d = 0) => `${formatNumberL(v * 100, 'en', d)}%`;
/** "2026-10-24" → "October 24, 2026" (UTC, never shifts a day). */
export const dateL = (iso: string, _lang: L = 'en') => new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString(TAG, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
/** "2026-09" → "September 2026". */
export const monthL = (ym: string) => new Date(`${ym}-01T00:00:00Z`).toLocaleDateString(TAG, { month: 'long', year: 'numeric', timeZone: 'UTC' });
/** A year, never grouped (1982, not 1,982). */
export const yearL = (y: number) => String(y);
