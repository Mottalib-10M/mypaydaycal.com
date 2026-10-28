/**
 * Gross pay per paycheck from an annual salary or an hourly rate, for each pay frequency, and what a
 * 27-payday year does to a salary divided by 26. No tax is computed: gross pay only.
 */
import { useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import NumberField from '../ui/NumberField';
import { PRIVACY } from './fields';
import * as PR from '../../lib/engine/payroll';

interface Props { mode?: 'salary' | 'hourly'; freq?: PR.Freq; primary?: boolean; idPrefix?: string }
const usd = (v: number) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const FREQS: PR.Freq[] = ['weekly', 'biweekly', 'semimonthly', 'monthly'];

export default function PaycheckCalc({ mode = 'salary', freq = 'biweekly', primary = false, idPrefix = 'pk' }: Props) {
  const [m, setM] = useState(mode);
  const [annual, setAnnual] = useState(60000);
  const [rate, setRate] = useState(25);
  const [hours, setHours] = useState(40);
  const [f, setF] = useState<PR.Freq>(freq);
  const [n27, setN27] = useState<'26' | '27'>('26');
  const [method, setMethod] = useState<'per26' | 'spread'>('per26');
  const fid = (x: string) => `${idPrefix}-${x}`;
  const r = useMemo(() => {
    const per = (x: PR.Freq) => (m === 'salary' ? PR.perPaycheck(annual, x) : PR.hourlyPaycheck(rate, hours, x));
    const yearly = m === 'salary' ? annual : rate * hours * 52;
    const y27 = PR.salaryInYear(yearly, n27 === '27' ? 27 : 26, method);
    return { per, yearly, y27 };
  }, [m, annual, rate, hours, n27, method]);
  return (
    <div className="not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <form className="grid content-start gap-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          <SelectField id={fid('mode')} label="I am paid" value={m} onChange={(v) => setM(v as 'salary' | 'hourly')} options={[{ value: 'salary', label: 'A yearly salary' }, { value: 'hourly', label: 'By the hour' }]} />
          <SelectField id={fid('freq')} label="Pay frequency" value={f} onChange={(v) => setF(v as PR.Freq)} options={FREQS.map((x) => ({ value: x, label: PR.FREQ_LABEL[x] }))} />
          {m === 'salary'
            ? <NumberField id={fid('annual')} label="Annual salary" value={annual} onChange={(v) => setAnnual(Math.max(0, Math.min(5_000_000, v)))} unit="$" max={5_000_000} tag="en-US" />
            : <NumberField id={fid('rate')} label="Hourly rate" value={rate} onChange={(v) => setRate(Math.max(0, Math.min(2000, v)))} unit="$" max={2000} decimals={2} tag="en-US" />}
          {m === 'hourly' && <NumberField id={fid('hours')} label="Hours a week" value={hours} onChange={(v) => setHours(Math.max(0, Math.min(80, v)))} unit="h" max={80} decimals={1} tag="en-US" />}
          {f === 'biweekly' && <SelectField id={fid('n')} label="Paydays this year" value={n27} onChange={(v) => setN27(v as '26' | '27')} options={[{ value: '26', label: '26 (most years)' }, { value: '27', label: '27 (a 27-payday year)' }]} />}
          {f === 'biweekly' && n27 === '27' && m === 'salary' && <SelectField id={fid('method')} label="Your employer pays" value={method} onChange={(v) => setMethod(v as 'per26' | 'spread')} options={[{ value: 'per26', label: 'Salary ÷ 26 every payday' }, { value: 'spread', label: 'Salary ÷ 27 that year' }]} />}
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-navy-50 p-4">
          <p className="text-sm font-medium text-navy-600">Gross pay per paycheck, {PR.FREQ_LABEL[f].split(' (')[0].toLowerCase()}</p>
          <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{usd(f === 'biweekly' && n27 === '27' && m === 'salary' ? r.y27.each : r.per(f))}</p>
          <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
            {FREQS.filter((x) => x !== f).map((x) => <tr key={x}><td className="py-1.5 pr-3 text-navy-600">{PR.FREQ_LABEL[x].split(' (')[0]}, {PR.PERIODS[x]} a year</td><td className="tabular-nums py-1.5 text-right text-navy-900">{usd(r.per(x))}</td></tr>)}
            <tr><td className="py-1.5 pr-3 text-navy-600">Yearly gross{m === 'hourly' ? ' (52 weeks)' : ''}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{usd(r.yearly)}</td></tr>
            {f === 'biweekly' && n27 === '27' && <tr><td className="py-1.5 pr-3 text-navy-600">Paid over the 27 paydays</td><td className="tabular-nums py-1.5 text-right text-navy-900">{usd(m === 'salary' ? r.y27.total : r.per('biweekly') * 27)}</td></tr>}
          </tbody></table>
          <p className="mt-2 text-xs text-navy-600">{f === 'biweekly' && n27 === '27' ? (m === 'hourly' ? 'Paid by the hour, you are paid for the hours of 27 periods: 54 weeks of work land in the year.' : method === 'per26' ? `Divided by 26, the 27th paycheck adds ${usd(r.y27.extra)} to the year.` : 'Divided by 27, each paycheck is smaller and the year totals the salary.') : 'Gross pay before taxes and deductions.'} Semi-monthly and monthly hourly figures use 52 weeks a year (29 CFR 778.113). {PRIVACY}</p>
        </div>
      </div>
    </div>
  );
}
