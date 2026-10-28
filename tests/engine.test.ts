/**
 * Engine checked against the official tables read on 2026-10-28: OPM federal holidays 2026 to 2028,
 * Federal Reserve holiday schedule, OPM leave years, NFC pay period calendar 2027, NIST clock changes,
 * DOL Hours Worked Advisor, 5 U.S.C. 5504.
 */
import { describe, expect, it } from 'vitest';
import * as C from '../src/lib/engine/calendar';
import * as PR from '../src/lib/engine/payroll';
import * as F from '../src/lib/engine/federal';
import * as D from '../src/lib/engine/dst';

const obs = (y: number) => C.federalHolidays(y).map((h) => h.observed);
describe('federal holidays (OPM tables)', () => {
  it('2026 as observed', () => expect(obs(2026)).toEqual(['2026-01-01', '2026-01-19', '2026-02-16', '2026-05-25', '2026-06-19', '2026-07-03', '2026-09-07', '2026-10-12', '2026-11-11', '2026-11-26', '2026-12-25']));
  it('2027 as observed', () => expect(obs(2027)).toEqual(['2027-01-01', '2027-01-18', '2027-02-15', '2027-05-31', '2027-06-18', '2027-07-05', '2027-09-06', '2027-10-11', '2027-11-11', '2027-11-25', '2027-12-24']));
  it('2028 as observed, New Year 2028 taken on Friday, December 31, 2027', () => {
    expect(obs(2028)).toEqual(['2027-12-31', '2028-01-17', '2028-02-21', '2028-05-29', '2028-06-19', '2028-07-04', '2028-09-04', '2028-10-09', '2028-11-10', '2028-11-23', '2028-12-25']);
    expect(C.holidaysInYear(2027, 'federal').map((h) => h.date)).toContain('2027-12-31');
    expect(C.holidaysInYear(2027, 'federal')).toHaveLength(12);
  });
});
describe('Federal Reserve bank holidays', () => {
  it('Saturday holidays close nothing, Sunday holidays close Monday', () => {
    const y = C.federalHolidays(2027);
    expect(y.find((h) => h.key === 'juneteenth')!.fedClosed).toBeNull();
    expect(y.find((h) => h.key === 'christmas')!.fedClosed).toBeNull();
    expect(y.find((h) => h.key === 'independence')!.fedClosed).toBe('2027-07-05');
    expect(C.isBusinessDay('2027-12-24', 'fed')).toBe(true);
    expect(C.isBusinessDay('2027-12-24', 'federal')).toBe(false);
    expect(C.isBusinessDay('2027-12-31', 'fed')).toBe(true);
    expect(C.federalHolidays(2026).find((h) => h.key === 'independence')!.fedClosed).toBeNull();
    expect(C.federalHolidays(2028).find((h) => h.key === 'newYear')!.fedClosed).toBeNull();
    expect(C.federalHolidays(2028).find((h) => h.key === 'veterans')!.fedClosed).toBeNull();
  });
});
describe('counts', () => {
  it('2027 has 53 Fridays and 261 weekdays', () => {
    expect(C.weekdayCounts(2027)[5]).toBe(53);
    expect(C.workingDaysByMonth(2027, 'weekends').reduce((s, m) => s + m.working, 0)).toBe(261);
  });
  it('working days 2027: 249 federal, 252 bank days', () => {
    expect(C.workingDaysByMonth(2027, 'federal').reduce((s, m) => s + m.working, 0)).toBe(249);
    expect(C.workingDaysByMonth(2027, 'fed').reduce((s, m) => s + m.working, 0)).toBe(252);
  });
  it('business days', () => {
    expect(C.businessDaysBetween('2027-12-23', '2027-12-28', 'fed')).toBe(3);
    expect(C.addBusinessDays('2027-07-02', 1, 'fed')).toBe('2027-07-06');
    expect(C.addBusinessDays('2027-07-06', -1, 'fed')).toBe('2027-07-02');
  });
});
describe('pay schedules', () => {
  it('biweekly Fridays in 2027: 27 or 26', () => {
    expect(PR.biweeklySeries(2027, 5).map((s) => [s.first, s.count])).toEqual([['2027-01-01', 27], ['2027-01-08', 26]]);
    expect(PR.biweeklySeries(2026, 5).map((s) => s.count)).toEqual([26, 26]);
  });
  it('the New Year holiday moves the 27th payday out of 2027 with the "before" rule', () => {
    const s = { ...PR.DEFAULT_SCHEDULE, anchor: '2027-01-01' };
    expect(PR.nominalCount(s, 2027)).toBe(27);
    expect(PR.paydays(s, 2027)).toHaveLength(26);
    expect(PR.paydays(s, 2026).at(-1)!.paid).toBe('2026-12-31');
    expect(PR.paydays({ ...s, rule: 'after' }, 2027)).toHaveLength(27);
    expect(PR.paydays({ ...s, cal: 'federal' }, 2027).at(-1)!.paid).toBe('2027-12-30');
  });
  it('semi-monthly 15th and last day', () => {
    const s = { ...PR.DEFAULT_SCHEDULE, freq: 'semimonthly' as const };
    const p = PR.paydays(s, 2027);
    expect(p).toHaveLength(24);
    expect(p.find((x) => x.nominal === '2027-05-15')!.paid).toBe('2027-05-14');
    expect(p.find((x) => x.nominal === '2027-02-28')!.paid).toBe('2027-02-26');
  });
  it('pay period Sunday to Saturday, paid six days after it ends', () => {
    const p = PR.paydays(PR.DEFAULT_SCHEDULE, 2027)[0];
    expect([p.periodStart, p.periodEnd]).toEqual(['2026-12-20', '2027-01-02']);
  });
  it('years with 27 Friday paydays', () => expect(PR.years27(2026, 2040, 5).map((x) => x.year)).toEqual([2027, 2032, 2038]));
  it('federal biweekly pay: annual / 2,087 to the cent, times 80', () => expect(PR.federalBiweekly(75000)).toEqual({ hourly: 35.94, biweekly: 2875.2 }));
  it('ics', () => {
    const t = PR.toIcs(PR.paydays(PR.DEFAULT_SCHEDULE, 2027).slice(0, 2), 'Test', '20261028T000000Z');
    expect(t).toMatch(/^BEGIN:VCALENDAR\r\n/);
    expect(t.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(t).toContain('DTSTART;VALUE=DATE:20270108');
  });
});
describe('federal leave years (OPM, NFC 2027)', () => {
  it('2027: PP01 January 10 to 23, 26 periods', () => {
    const l = F.leaveYear(2027)!;
    expect([l.periods[0].start, l.periods[0].end, l.count, l.end]).toEqual(['2027-01-10', '2027-01-23', 26, '2028-01-08']);
  });
  it('2023 had 27 periods', () => expect(F.leaveYear(2023)!.count).toBe(27));
  it('period of a date', () => expect(F.periodOf('2027-07-04')).toEqual({ year: 2027, period: { n: 13, start: '2027-06-27', end: '2027-07-10' } }));
});
describe('clock changes (NIST)', () => {
  it('dates', () => {
    expect([D.dstStart(2026), D.dstEnd(2026)]).toEqual(['2026-03-08', '2026-11-01']);
    expect([D.dstStart(2027), D.dstEnd(2027)]).toEqual(['2027-03-14', '2027-11-07']);
    expect([D.dstStart(2028), D.dstEnd(2028)]).toEqual(['2028-03-12', '2028-11-05']);
    expect(D.nextChange('2026-10-28')).toEqual({ kind: 'fall', date: '2026-11-01' });
  });
  it('DOL example: 11 p.m. to 7:30 a.m. with a 30-minute break', () => {
    expect(D.shiftHours('23:00', '07:30', 30, 'spring').worked).toBe(7);
    expect(D.shiftHours('23:00', '07:30', 30, 'fall').worked).toBe(9);
    expect(D.shiftHours('03:00', '11:00', 0, 'fall').worked).toBe(8);
  });
  it('overtime over 40', () => expect(D.weekWithChange(32, 9, 20)).toEqual({ total: 41, ot: 1, pay: 40 * 20 + 30 }));
});
