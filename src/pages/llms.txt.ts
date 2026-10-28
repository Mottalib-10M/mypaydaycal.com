/** llms.txt (RECETTE §21), generated at build from the page registry: always in sync with the site. */
import { PAGES } from '../lib/guides';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS_ORDER, groupLabel } from '../i18n/nav';
import params from '../data/params-2026.json';

const words = (iso: string) => new Date(iso.slice(0, 10) + 'T12:00:00Z').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`,
    '',
    `> Free tools to lay out US paydays: a payroll calendar generator for weekly, biweekly, semi-monthly and monthly schedules (weekend and holiday rule, .ics export, printable list) for 2026, 2027 and 2028; pay periods per year and 27-payday years; gross pay per paycheck by frequency; federal pay periods and leave years from OPM; Federal Reserve bank holidays and their effect on direct deposit; business days between dates; daylight saving time dates under 15 U.S.C. 260a with a live countdown and the hours worked on an overnight shift. Independent site, not a payroll provider, a bank, OPM or the Department of Labor. Tools run in the browser. Published by Radif Partners. Last updated ${words(LAST_UPDATED)}.`,
    '',
    '## Data',
    `- Holidays computed from 5 U.S.C. 6103 with the OPM observance rule (Saturday to Friday, Sunday to Monday) and the Federal Reserve rule (Saturday holiday: banks open Friday; Sunday holiday: closed Monday), checked against the OPM and Federal Reserve tables; leave years from the OPM fact sheet; clock changes from 15 U.S.C. 260a; all read ${words(params.retrieved_at)}. US government works, not reproduced.`,
    '',
    `- [Payroll calendar 2027 generator](${SITE_URL}${route('home', 'en')}): every payday of a schedule, moved for weekends and bank holidays`,
    '',
    ...GROUPS_ORDER.flatMap((g) => [`## ${groupLabel(g)}`, ...PAGES.filter((p) => p.group === g).map((p) => `- [${p.en.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.en.card}`), '']),
    '## About',
    `- [Method and sources](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
