import type { Locale } from './routes';
const en = {
  updatedOn: 'Dates checked on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Holiday rules and pay calendars read by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Common questions', relatedCalculators: 'Next steps', sourcesTitle: 'Official sources behind this page', writtenBy: 'Written by',
  asOf: 'US pay calendar rules', lastUpdated: 'read in the US Code, OPM and Federal Reserve tables, last updated on',
  footerValidated: 'Every holiday, pay period and clock change is computed from a rule that links to the text it was read in',
  footerBrowser: 'Tools run in your browser · nothing you type is sent or stored · free, no account, nothing for sale',
  footerDisclaimer: 'My Payday Cal is an independent site published by Radif Partners. It is not a payroll provider, a bank, the Office of Personnel Management, the Federal Reserve or the Department of Labor. The dates it computes follow the rules you choose and the published holiday schedules; your employer and your bank set the actual payday and deposit time. The results are for guidance and do not replace your employer’s pay calendar or legal advice.',
  footerPopular: 'Tools',
  notFound: 'There is no page at this address. The payroll calendar generator is on the home page.',
  readMore: 'Read more', back: 'Home',
  independent: 'Independent site, not OPM or a federal payroll office. Official pay dates are those your payroll provider publishes.',
};
export function t(_lang: Locale = 'en') { return en; }
