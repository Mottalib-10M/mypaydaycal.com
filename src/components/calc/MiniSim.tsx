/**
 * Page mini-tool (RECETTE §9.3): one to three fields, the figure of the page's subject in large type,
 * two to four lines of detail and a link to the full tool. Figures come from the engines through
 * `lib/mini-specs.ts`. First render = build day (§17.5), then the visitor's own date; `data-chrome`:
 * the widget's labels count neither in words nor in page comparison.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { getSpec } from '../../lib/mini-specs';
declare const __BUILD_DAY__: string;
const localToday = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

interface Props { kind: string; href?: string; defaults?: Record<string, number>; primary?: boolean; idPrefix?: string }

export default function MiniSim({ kind, href, defaults = {}, primary = false, idPrefix = 'm' }: Props) {
  const spec = getSpec(kind);
  const [today, setToday] = useState(__BUILD_DAY__);
  useEffect(() => setToday(localToday()), []);
  const [v, setV] = useState<Record<string, number>>(() => Object.fromEntries(spec.inputs.map((i) => [i.id, defaults[i.id] ?? i.def])));
  const out = useMemo(() => spec.run(v, { today }), [v, spec, today]);
  const set = (id: string) => (x: number) => setV((o) => ({ ...o, [id]: x }));
  const fid = (i: string) => `${idPrefix}-${kind}-${i}`;
  return (
    <div data-chrome data-mini={kind} className={`not-prose rechner-mini rounded-xl border border-accent-200 bg-white p-4 sm:p-5 ${primary ? 'my-2' : 'my-8'}`}>
      <p className="text-base font-semibold text-navy-900">{spec.title}</p>
      <div className="mt-3 grid gap-5 sm:grid-cols-2">
        <form className="grid content-start gap-3" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          {spec.inputs.map((i) => i.options
            ? <SelectField key={i.id} id={fid(i.id)} label={i.label} value={String(v[i.id])} onChange={(x) => set(i.id)(Number(x))} options={i.options} help={i.help} />
            : <NumberField key={i.id} id={fid(i.id)} label={i.label} value={v[i.id]} onChange={set(i.id)} unit={i.unit} max={i.max} min={i.min ?? 0} decimals={i.decimals} help={i.help} tag="en-US" grouping={!i.year} />)}
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-navy-50 p-4">
          <p className="text-sm font-medium text-navy-600">{out.head[0]}</p>
          <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{out.head[1]}</p>
          <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
            {out.rows.map(([l, x]) => <tr key={l}><td className="py-1.5 pr-3 text-navy-600">{l}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{x}</td></tr>)}
          </tbody></table>
          {out.note && <p className="mt-2 text-xs text-navy-600">{out.note}</p>}
        </div>
      </div>
      {href && spec.cta && <a href={href} className="mt-4 inline-block text-sm font-medium text-accent-700 hover:underline">{spec.cta} →</a>}
    </div>
  );
}
