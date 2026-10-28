/** Mini-tools (RECETTE §9.3). Each subject is described once in `lib/mini-specs.ts`. */
export interface MiniInput {
  id: string; label: string;
  def: number;
  unit?: string; max?: number; min?: number; decimals?: number; help?: string;
  options?: Array<{ value: string; label: string }>;
  /** a year: typed without thousands separator */
  year?: boolean;
}
export interface MiniOut { head: [string, string]; rows: Array<[string, string]>; note?: string }
/** `today`: the build day at first render, then the visitor's own date (ISO). */
export interface MiniCtx { today: string }
export interface MiniSpec { title: string; cta: string; ctaPage?: string; inputs: MiniInput[]; run: (v: Record<string, number>, ctx: MiniCtx) => MiniOut }
