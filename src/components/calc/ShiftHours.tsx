/**
 * Overnight shift across a clock change: hours actually worked (DOL Hours Worked Advisor), the week's
 * total and the hours over 40 paid at time and a half (29 CFR 778.104, 778.106).
 */
import { useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import NumberField from '../ui/NumberField';
import { inputCls, PRIVACY } from './fields';
import * as C from '../../lib/engine/calendar';
import * as D from '../../lib/engine/dst';

interface Props { kind?: 'spring' | 'fall'; year?: number; primary?: boolean; idPrefix?: string }
const usd = (v: number) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const h1 = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 2 });

function TimeField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid min-w-0 grid-rows-subgrid row-span-3 content-start gap-y-0">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <input id={id} type="time" value={value} onChange={(e) => { if (/^\d{2}:\d{2}$/.test(e.target.value)) onChange(e.target.value); }} className={inputCls} />
      <span />
    </div>
  );
}

export default function ShiftHours({ kind = 'fall', year = 2026, primary = false, idPrefix = 'sh' }: Props) {
  const [k, setK] = useState<'spring' | 'fall'>(kind);
  const [y, setY] = useState(year);
  const [start, setStart] = useState('23:00');
  const [end, setEnd] = useState('07:30');
  const [brk, setBrk] = useState(30);
  const [other, setOther] = useState(32);
  const [rate, setRate] = useState(20);
  const fid = (x: string) => `${idPrefix}-${x}`;
  const r = useMemo(() => {
    const s = D.shiftHours(start, end, brk, k);
    const w = D.weekWithChange(other, s.worked, rate);
    const usual = D.weekWithChange(other, s.scheduled, rate);
    return { s, w, usual };
  }, [k, start, end, brk, other, rate]);
  const night = k === 'spring' ? D.dstStart(y) : D.dstEnd(y);
  return (
    <div className="not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <form className="grid content-start gap-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          <SelectField id={fid('kind')} label="Clock change" value={k} onChange={(v) => setK(v as 'spring' | 'fall')} options={[{ value: 'fall', label: 'Fall back (November)' }, { value: 'spring', label: 'Spring forward (March)' }]} />
          <SelectField id={fid('year')} label="Year" value={String(y)} onChange={(v) => setY(Number(v))} options={[2026, 2027, 2028].map((x) => ({ value: String(x), label: String(x) }))} />
          <TimeField id={fid('start')} label="Shift starts (night before)" value={start} onChange={setStart} />
          <TimeField id={fid('end')} label="Shift ends (morning)" value={end} onChange={setEnd} />
          <NumberField id={fid('brk')} label="Unpaid break" value={brk} onChange={(v) => setBrk(Math.max(0, Math.min(240, Math.round(v))))} unit="min" max={240} tag="en-US" />
          <NumberField id={fid('other')} label="Other hours that workweek" value={other} onChange={(v) => setOther(Math.max(0, Math.min(120, v)))} unit="h" max={120} decimals={1} tag="en-US" />
          <NumberField id={fid('rate')} label="Hourly rate" value={rate} onChange={(v) => setRate(Math.max(0, Math.min(1000, v)))} unit="$" max={1000} decimals={2} tag="en-US" />
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-navy-50 p-4">
          <p className="text-sm font-medium text-navy-600">Hours worked on the night of {C.longDate(C.addDays(night, -1), { year: false })} to {C.longDate(night, { weekday: false })}</p>
          <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{h1(r.s.worked)} h</p>
          <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
            <tr><td className="py-1.5 pr-3 text-navy-600">Same shift on an ordinary night</td><td className="tabular-nums py-1.5 text-right text-navy-900">{h1(r.s.scheduled)} h</td></tr>
            <tr><td className="py-1.5 pr-3 text-navy-600">Workweek total</td><td className="tabular-nums py-1.5 text-right text-navy-900">{h1(r.w.total)} h</td></tr>
            <tr><td className="py-1.5 pr-3 text-navy-600">Overtime hours (over 40)</td><td className="tabular-nums py-1.5 text-right text-navy-900">{h1(r.w.ot)} h</td></tr>
            <tr><td className="py-1.5 pr-3 text-navy-600">Gross pay for the week</td><td className="tabular-nums py-1.5 text-right text-navy-900">{usd(r.w.pay)}</td></tr>
            <tr><td className="py-1.5 pr-3 text-navy-600">Difference with an ordinary week</td><td className="tabular-nums py-1.5 text-right text-navy-900">{r.w.pay - r.usual.pay >= 0 ? '+' : '−'}{usd(Math.abs(r.w.pay - r.usual.pay))}</td></tr>
          </tbody></table>
          <p className="mt-2 text-xs text-navy-600">{r.s.crosses ? (k === 'fall' ? 'The shift is on duty when 2 a.m. becomes 1 a.m.: one more hour worked.' : 'The shift is on duty when 2 a.m. becomes 3 a.m.: one hour less worked.') : 'This shift is not on duty at 2 a.m.: the clock change does not alter its hours.'} Federal overtime rule; some states add daily overtime. {PRIVACY}</p>
        </div>
      </div>
    </div>
  );
}
