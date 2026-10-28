/**
 * Business-day calculator: count the business days between two dates, or add business days to a date,
 * skipping weekends and the holidays of the chosen calendar (Federal Reserve bank days by default).
 */
import { useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import NumberField from '../ui/NumberField';
import { DateField, PRIVACY } from './fields';
import * as C from '../../lib/engine/calendar';

declare const __BUILD_DAY__: string;
interface Props { start?: string; end?: string; n?: number; mode?: 'count' | 'add'; cal?: C.Cal; primary?: boolean; idPrefix?: string }

export default function BusinessDays({ start, end, n = 10, mode = 'count', cal = 'fed', primary = false, idPrefix = 'bd' }: Props) {
  const d0 = start ?? __BUILD_DAY__;
  const [m, setM] = useState(mode);
  const [a, setA] = useState(d0);
  const [b, setB] = useState(end ?? C.addDays(d0, 30));
  const [k, setK] = useState(n);
  const [c, setC] = useState<C.Cal>(cal);
  const [incStart, setInc] = useState(false);
  const fid = (x: string) => `${idPrefix}-${x}`;
  const out = useMemo(() => {
    const from = a <= b ? a : b, to = a <= b ? b : a;
    if (m === 'count') {
      const days = C.businessDaysBetween(from, to, c, incStart, true);
      const cal = C.daysBetween(from, to) + (incStart ? 1 : 0);
      const hol: Array<{ date: string; name: string }> = [];
      for (let d = C.addDays(from, incStart ? 0 : 1); d <= to; d = C.addDays(d, 1)) { const h = C.holidayOn(d, c); if (h && !C.isWeekend(d)) hol.push({ date: d, name: h }); }
      return { head: ['Business days', String(days)], rows: [['Calendar days', String(cal)], ['Weekend days', String(cal - days - hol.length)], ['Holidays on a weekday', String(hol.length)]] as Array<[string, string]>, hol };
    }
    const r = C.addBusinessDays(a, k, c);
    const hol: Array<{ date: string; name: string }> = [];
    const lo = k >= 0 ? C.addDays(a, 1) : r, hi = k >= 0 ? r : C.addDays(a, -1);
    for (let d = lo; d <= hi; d = C.addDays(d, 1)) { const h = C.holidayOn(d, c); if (h && !C.isWeekend(d)) hol.push({ date: d, name: h }); }
    return { head: [`${Math.abs(k)} business day${Math.abs(k) === 1 ? '' : 's'} ${k >= 0 ? 'after' : 'before'} ${C.longDate(a, { weekday: false })}`, C.longDate(r)], rows: [['Calendar days', String(Math.abs(C.daysBetween(a, r)))], ['Holidays skipped', String(hol.length)]] as Array<[string, string]>, hol };
  }, [m, a, b, k, c, incStart]);
  return (
    <div className="not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <form className="grid content-start gap-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          <SelectField id={fid('mode')} label="What to work out" value={m} onChange={(v) => setM(v as 'count' | 'add')} options={[{ value: 'count', label: 'Business days between two dates' }, { value: 'add', label: 'Date after N business days' }]} />
          <SelectField id={fid('cal')} label="Days off" value={c} onChange={(v) => setC(v as C.Cal)} options={(['fed', 'federal', 'weekends'] as C.Cal[]).map((x) => ({ value: x, label: C.CAL_LABEL[x] }))} />
          <DateField id={fid('a')} label="Start date" value={a} onChange={setA} />
          {m === 'count'
            ? <DateField id={fid('b')} label="End date" value={b} onChange={setB} help="Counted in the result." />
            : <NumberField id={fid('n')} label="Business days to add" value={k} onChange={(v) => setK(Math.max(-400, Math.min(400, Math.round(v))))} min={-400} max={400} tag="en-US" help="A minus sign counts back." />}
          {m === 'count' && <label className="flex items-center gap-2 text-sm text-navy-700 sm:col-span-2"><input type="checkbox" checked={incStart} onChange={(e) => setInc(e.target.checked)} className="h-4 w-4" /> Count the start date too</label>}
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-navy-50 p-4">
          <p className="text-sm font-medium text-navy-600">{out.head[0]}</p>
          <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{out.head[1]}</p>
          <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
            {out.rows.map(([l, x]) => <tr key={l}><td className="py-1.5 pr-3 text-navy-600">{l}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{x}</td></tr>)}
          </tbody></table>
          {out.hol.length > 0 && <p className="mt-2 text-sm text-navy-700">Skipped: {out.hol.slice(0, 6).map((h) => `${h.name} (${C.shortDate(h.date)})`).join(', ')}{out.hol.length > 6 ? ` and ${out.hol.length - 6} more` : ''}.</p>}
          <p className="mt-2 text-xs text-navy-600">{PRIVACY}</p>
        </div>
      </div>
    </div>
  );
}
