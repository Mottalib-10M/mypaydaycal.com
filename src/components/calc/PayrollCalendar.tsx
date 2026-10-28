/**
 * Payroll calendar generator: frequency, first payday or days of the month, weekend and holiday rule,
 * holiday calendar and year → every payday, the pay period it closes, the ones that moved and why;
 * .ics download and a printable page, both built in the browser (nothing is sent).
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import NumberField from '../ui/NumberField';
import { DateField, PRIVACY } from './fields';
import * as C from '../../lib/engine/calendar';
import * as PR from '../../lib/engine/payroll';

declare const __BUILD_DAY__: string;
const localToday = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
interface Props {
  freq?: PR.Freq; year?: number; anchor?: string; d1?: number; d2?: number; day?: number; rule?: PR.Rule; cal?: C.Cal;
  primary?: boolean; idPrefix?: string; years?: number[];
}
const DAY_OPTS = [...Array.from({ length: 28 }, (_, i) => ({ value: String(i + 1), label: ordinal(i + 1) })), { value: '31', label: 'Last day of the month' }];
function ordinal(n: number) { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`; }

export default function PayrollCalendar({ freq = 'biweekly', year = 2027, anchor = '2027-01-08', d1 = 15, d2 = 31, day = 31, rule = 'before', cal = 'fed', primary = false, idPrefix = 'pc', years = [2026, 2027, 2028] }: Props) {
  const [s, setS] = useState<PR.Schedule>({ ...PR.DEFAULT_SCHEDULE, freq, anchor, d1, d2, day, rule, cal });
  const [y, setY] = useState(year);
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(localToday()), []);
  const set = <K extends keyof PR.Schedule>(k: K) => (v: PR.Schedule[K]) => setS((o) => ({ ...o, [k]: v }));
  const days = useMemo(() => PR.paydays(s, y), [s, y]);
  const movedN = days.filter((p) => p.paid !== p.nominal).length;
  const nominal = PR.nominalCount(s, y);
  const weekly = s.freq === 'weekly' || s.freq === 'biweekly';
  const next = today ? days.find((p) => p.paid >= today) : undefined;
  const fid = (k: string) => `${idPrefix}-${k}`;
  const byMonth = C.MONTHS.map((m, i) => ({ m, list: days.filter((p) => +p.paid.slice(5, 7) === i + 1) }));
  const name = `${PR.FREQ_LABEL[s.freq].split(' (')[0]} payroll calendar ${y}`;

  function download() {
    const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const blob = new Blob([PR.toIcs(days, name, now)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `paydays-${s.freq}-${y}.ics`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function print() {
    const w = window.open('', '_blank');
    if (!w) return;
    const rows = days.map((p, i) => `<tr><td>${i + 1}</td><td>${C.longDate(p.paid)}</td><td>${p.paid === p.nominal ? '' : `moved from ${C.longDate(p.nominal, { weekday: false })} (${p.reason})`}</td>${weekly ? `<td>${C.shortDate(p.periodStart!)} to ${C.shortDate(p.periodEnd!)}</td>` : ''}</tr>`).join('');
    w.document.write(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${name}</title><style>body{font:14px system-ui,sans-serif;margin:24px;color:#111}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #ccc;padding:6px 8px;text-align:left}h1{font-size:20px}</style></head><body><h1>${name}</h1><p>${PR.RULE_LABEL[s.rule]} · ${C.CAL_LABEL[s.cal]}</p><table><thead><tr><th>#</th><th>Payday</th><th>Note</th>${weekly ? '<th>Pay period</th>' : ''}</tr></thead><tbody>${rows}</tbody></table></body></html>`);
    w.document.close(); w.focus(); w.print();
  }

  return (
    <div className="not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <form className="grid content-start gap-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          <SelectField id={fid('freq')} label="Pay frequency" value={s.freq} onChange={(v) => set('freq')(v as PR.Freq)} options={(['weekly', 'biweekly', 'semimonthly', 'monthly'] as PR.Freq[]).map((f) => ({ value: f, label: PR.FREQ_LABEL[f] }))} />
          <SelectField id={fid('year')} label="Year" value={String(y)} onChange={(v) => setY(Number(v))} options={years.map((x) => ({ value: String(x), label: String(x) }))} />
          {weekly && <DateField id={fid('anchor')} label="One payday of the schedule" value={s.anchor} onChange={set('anchor')} help="Any past or future payday: the tool steps 7 or 14 days from it." />}
          {weekly && <NumberField id={fid('lag')} label="Days from end of pay period to payday" value={s.lag} onChange={(v) => set('lag')(Math.min(20, Math.max(0, Math.round(v))))} max={20} tag="en-US" />}
          {s.freq === 'semimonthly' && <SelectField id={fid('d1')} label="First payday of the month" value={String(s.d1)} onChange={(v) => set('d1')(Number(v))} options={DAY_OPTS} />}
          {s.freq === 'semimonthly' && <SelectField id={fid('d2')} label="Second payday" value={String(s.d2)} onChange={(v) => set('d2')(Number(v))} options={DAY_OPTS} />}
          {s.freq === 'monthly' && <SelectField id={fid('day')} label="Payday of the month" value={String(s.day)} onChange={(v) => set('day')(Number(v))} options={DAY_OPTS} />}
          <SelectField id={fid('rule')} label="Payday on a weekend or holiday" value={s.rule} onChange={(v) => set('rule')(v as PR.Rule)} options={(['before', 'after', 'none'] as PR.Rule[]).map((r) => ({ value: r, label: PR.RULE_LABEL[r] }))} />
          <SelectField id={fid('cal')} label="Holidays to skip" value={s.cal} onChange={(v) => set('cal')(v as C.Cal)} options={(['fed', 'federal', 'weekends'] as C.Cal[]).map((c) => ({ value: c, label: C.CAL_LABEL[c] }))} />
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-navy-50 p-4">
          <p className="text-sm font-medium text-navy-600">Paydays in {y}</p>
          <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{days.length}{days.length && days[0] ? <span className="ml-2 text-base font-medium text-navy-700">first {C.longDate(days[0].paid, { year: false })}, last {C.longDate(days[days.length - 1].paid, { year: false })}</span> : null}</p>
          <p className="mt-1 text-sm text-navy-700">
            {movedN ? `${movedN} payday${movedN > 1 ? 's' : ''} moved for a weekend or holiday.` : 'No payday falls on a weekend or holiday.'}
            {weekly && nominal !== days.length ? ` ${nominal} are scheduled in the year; the rule moves ${Math.abs(nominal - days.length)} across New Year.` : ''}
            {next ? ` Next payday: ${C.longDate(next.paid)}, in ${C.daysBetween(today!, next.paid)} day${C.daysBetween(today!, next.paid) === 1 ? '' : 's'}.` : ''}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {byMonth.map(({ m, list }) => (
              <div key={m} className="rounded-md bg-white px-2.5 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-600">{m}</p>
                <ul className="mt-0.5 text-sm text-navy-900">
                  {list.length ? list.map((p) => <li key={p.paid} className="tabular-nums" title={p.reason ? `moved from ${C.longDate(p.nominal)} (${p.reason})` : undefined}>{C.WEEKDAYS[C.dow(p.paid)].slice(0, 3)} {+p.paid.slice(8, 10)}{p.reason ? <span className="ml-1 text-xs text-accent-700">moved from {C.shortDate(p.nominal)}</span> : null}</li>) : <li className="text-navy-500">no payday</li>}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={download} className="rounded-lg bg-accent-700 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-800">Download .ics</button>
            <button type="button" onClick={print} className="rounded-lg border border-navy-300 bg-white px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-navy-100">Print</button>
          </div>
          <p className="mt-2 text-xs text-navy-600">{PRIVACY} The .ics file opens in any calendar app.</p>
        </div>
      </div>
    </div>
  );
}
