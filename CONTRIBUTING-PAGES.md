# Adding or editing a page

One page = one file `src/content/pages/<id>.ts` exporting `definePage({...})` (types in
`src/lib/guide-types.ts`). The file name must equal `id`. Model: `biweekly-pay-schedule-2027.ts`. The page
is built at `/en/<en.slug>/`; menus, footer, home lists, llms.txt and sitemap follow by themselves.
English only (en-US).

## Fields

- `group`: `schedules`, `periods`, `banking` or `clocks`; `order`: position in its group.
- `tool`: the main tool, shown right under the H1 (first screen, RECETTE §5):
  - `{ kind: 'payroll', props?: { freq, year, anchor, d1, d2, day, rule, cal, years } }` (payroll calendar generator)
  - `{ kind: 'bizdays', props?: { start, end, n, mode, cal } }` (business days)
  - `{ kind: 'dst', props?: { year, focus } }` (clock change countdown)
  - `{ kind: 'shift', props?: { kind, year } }` (night shift across a clock change)
  - `{ kind: 'paycheck', props?: { mode, freq } }` (gross pay per paycheck)
  - `{ kind: 'fedpp', props?: { year, date } }` (federal pay periods)
  - `{ kind: 'mini:<spec>' }`, specs in `src/lib/mini-specs.ts`.
- `mini`: a second tool under the citable block (same kinds).
- In a body, `<!--tool:mini:workdays-->` or `<!--tool:bizdays|{"mode":"add"}-->` places a tool between paragraphs.
- `related`: 3–5 page ids. `sources`: keys of `src/data/params-2026.json` → `sources`.
- `demarche: true` shows the “independent, not OPM” line under the H1 (federal pages).

## Text rules (checked by `npx vitest run tests/pages.test.ts`, then `npm run check`)

- `title` 50–60 characters, key term first ("Payroll Calendar 2026: …"), never "How…", "When…", "US…" first.
- `description` 150–160 characters.
- `resume(h)`: ONE paragraph (no tags but links) of at least 120 words answering the page's query with dates.
- `faqs(h)`: 3–5 questions unique across the site, each answer 42–88 words, plain text.
- `body(h)`: HTML with at least three `<h2>` sections; resume + body at least 650 words. No `<h1>`.
- No em dash; US spelling; dates in words ("January 8, 2027"), never ISO dates in text.
- Links only to official sources (`h.src(key, text)`) and internal pages (`h.a(id, text)`). Never a payroll
  vendor, pay stub seller, bank brand or another site; never mention a search engine.

## Dates

Never type a date or a count: compute it through `h` (`src/lib/helpers.ts`): `h.day(iso)`, `h.date(iso)`,
`h.md(iso)`, `h.hol(year, key)`, `h.holidayTable(year)`, `h.sched({...})`, `h.payTable(schedule, year)`,
`h.moved(schedule, year)`, `h.ly(year)` (federal leave year), and the engines `h.cal`, `h.pay`, `h.fed`, `h.dst`.

## Rules data

`src/data/params-2026.json` holds every rule (holiday rules, observance, leave years, 5 U.S.C. 5504 figures,
daylight saving time, FLSA overtime) with its source and the date it was read (`retrieved_at`).
`tests/engine.test.ts` compares the engine with the OPM, Federal Reserve, NFC and NIST tables: when a rule
changes, update the file, then the test with the new official table.
