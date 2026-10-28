/**
 * Federal pay periods of a leave year (OPM leave-year dates, biweekly Sunday to Saturday), the period
 * that contains a date, and the use-or-lose date. Pay dates are not invented: each payroll provider
 * publishes its own.
 */
import { useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { DateField, PRIVACY } from './fields';
import * as C from '../../lib/engine/calendar';
import * as F from '../../lib/engine/federal';

interface Props { year?: number; date?: string; primary?: boolean; idPrefix?: string }

export default function FederalPeriods({ year = 2027, date, primary = false, idPrefix = 'fp' }: Props) {
  const [y, setY] = useState(year);
  const [d, setD] = useState(date ?? `${year}-07-04`);
  const fid = (x: string) => `${idPrefix}-${x}`;
  const ly = useMemo(() => F.leaveYear(y)!, [y]);
  const at = useMemo(() => F.periodOf(d), [d]);
  return (
    <div className="not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <form className="grid content-start gap-3" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          <SelectField id={fid('year')} label="Leave year" value={String(y)} onChange={(v) => setY(Number(v))} options={F.LEAVE_YEARS.filter((x) => x >= 2026).map((x) => ({ value: String(x), label: String(x) }))} />
          <DateField id={fid('date')} label="Which pay period is this date in?" value={d} onChange={setD} />
          <p className="rounded-md bg-navy-50 p-3 text-sm text-navy-800">{at ? <>Pay period <strong>{at.period.n}</strong> of leave year {at.year}: {C.longDate(at.period.start, { year: false })} to {C.longDate(at.period.end)}.</> : 'Outside the leave years published by OPM (2023 to 2030).'}</p>
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-navy-50 p-4">
          <p className="text-sm font-medium text-navy-600">Leave year {y}: {C.longDate(ly.start, { weekday: false })} to {C.longDate(ly.end, { weekday: false })}</p>
          <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{ly.count} pay periods</p>
          {ly.useOrLose && <p className="mt-1 text-sm text-navy-700">Use-or-lose annual leave must be scheduled by {C.longDate(ly.useOrLose)}.</p>}
          <ol className="mt-3 grid grid-cols-1 gap-1 text-sm sm:grid-cols-2 xl:grid-cols-3">
            {ly.periods.map((p) => <li key={p.n} className={`tabular-nums rounded px-2 py-1 ${at && at.year === y && at.period.n === p.n ? 'bg-accent-100 font-semibold text-navy-900' : 'bg-white text-navy-800'}`}>PP {String(p.n).padStart(2, '0')}: {C.shortDate(p.start)} to {C.shortDate(p.end)}</li>)}
          </ol>
          <p className="mt-2 text-xs text-navy-600">Sunday to Saturday, two weeks each. Your payday follows each period by the delay your payroll provider publishes. {PRIVACY}</p>
        </div>
      </div>
    </div>
  );
}
