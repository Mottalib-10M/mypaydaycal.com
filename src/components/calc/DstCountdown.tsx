/**
 * Live countdown to the next US clock change at 2 a.m. local time, in the visitor's own time zone,
 * with the spring and fall dates of any year. First render = build day (same HTML on server and
 * browser), then the visitor's clock takes over. Nothing is sent: the time zone is read by the browser.
 */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import * as C from '../../lib/engine/calendar';
import * as D from '../../lib/engine/dst';

declare const __BUILD_DAY__: string;
interface Props { year?: number; focus?: 'fall' | 'spring' | 'next'; primary?: boolean; idPrefix?: string }
const pad = (n: number) => String(n).padStart(2, '0');

export default function DstCountdown({ year = 2026, focus = 'next', primary = false, idPrefix = 'dst' }: Props) {
  const [y, setY] = useState(year);
  const [now, setNow] = useState<number | null>(null);
  const [zone, setZone] = useState<{ name: string; observes: boolean } | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    const yy = new Date().getFullYear();
    const jan = new Date(yy, 0, 1).getTimezoneOffset(), jul = new Date(yy, 6, 1).getTimezoneOffset();
    setZone({ name: Intl.DateTimeFormat().resolvedOptions().timeZone || 'your time zone', observes: jan !== jul });
    return () => clearInterval(t);
  }, []);
  const today = now ? (() => { const d = new Date(now); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; })() : __BUILD_DAY__;
  const next = useMemo(() => {
    const n = D.nextChange(today);
    if (focus === 'next') return n;
    const yy = +today.slice(0, 4);
    const d = focus === 'fall' ? (D.dstEnd(yy) >= today ? D.dstEnd(yy) : D.dstEnd(yy + 1)) : (D.dstStart(yy) >= today ? D.dstStart(yy) : D.dstStart(yy + 1));
    return { kind: focus, date: d };
  }, [today, focus]);
  let left: string | null = null, past = false;
  if (now) {
    const [Y, M, Dd] = next.date.split('-').map(Number);
    let ms = new Date(Y, M - 1, Dd, 2, 0, 0).getTime() - now;
    if (ms <= 0) { past = true; ms = 0; }
    const s = Math.floor(ms / 1000);
    left = `${Math.floor(s / 86400)} days ${pad(Math.floor((s % 86400) / 3600))} h ${pad(Math.floor((s % 3600) / 60))} min ${pad(s % 60)} s`;
  }
  const days = C.daysBetween(today, next.date);
  const a = D.dstStart(y), b = D.dstEnd(y);
  return (
    <div className="not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <form className="grid content-start gap-3 md:order-1" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          <SelectField id={`${idPrefix}-year`} label="Show the clock changes of" value={String(y)} onChange={(v) => setY(Number(v))} options={Array.from({ length: 15 }, (_, i) => 2026 + i).map((x) => ({ value: String(x), label: String(x) }))} />
          <table className="w-full text-sm"><tbody className="divide-y divide-navy-200">
            <tr><td className="py-1.5 pr-3 text-navy-600">Spring forward</td><td className="py-1.5 text-right text-navy-900">{C.longDate(a)}</td></tr>
            <tr><td className="py-1.5 pr-3 text-navy-600">Fall back</td><td className="py-1.5 text-right text-navy-900">{C.longDate(b)}</td></tr>
            <tr><td className="py-1.5 pr-3 text-navy-600">Days on daylight time</td><td className="tabular-nums py-1.5 text-right text-navy-900">{C.daysBetween(a, b)}</td></tr>
          </tbody></table>
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-navy-50 p-4 order-first md:order-2">
          <p className="text-sm font-medium text-navy-600">{next.kind === 'fall' ? 'Clocks fall back' : 'Clocks spring forward'} at 2 a.m. on</p>
          <p className="mt-1 text-2xl font-bold text-navy-900 sm:text-3xl">{C.longDate(next.date)}</p>
          <p className="tabular-nums mt-2 text-lg font-semibold text-accent-800">{left ?? (days === 0 ? 'tonight' : `in ${days} day${days === 1 ? '' : 's'}`)}{past ? ' (done)' : ''}</p>
          <p className="mt-2 text-sm text-navy-700">{next.kind === 'fall' ? '2:00 a.m. daylight time becomes 1:00 a.m. standard time: one more hour of sleep, and 1 a.m. to 2 a.m. happens twice.' : '2:00 a.m. standard time becomes 3:00 a.m. daylight time: the night is one hour shorter.'}</p>
          {zone && <p className="mt-2 text-xs text-navy-600">Your device is set to {zone.name}{!/^(America|US|Pacific)\//.test(zone.name) ? ', outside US time zones: its clock changes follow local rules, and the countdown runs to 2 a.m. on your device’s clock on the US date.' : zone.observes ? ', which changes its clocks on these dates.' : ', which does not change its clocks: the countdown shows the date the rest of the country changes.'} Read by your browser, not sent.</p>}
        </div>
      </div>
    </div>
  );
}
