import { IscoolDate } from '../utils/IscoolDate';

const midnight = new Date();
midnight.setHours(0, 0, 0, 0);
const nextMidnight = new Date();
nextMidnight.setHours(23, 59, 59, 999);
const year2000 = new Date();
year2000.setFullYear(2000);
const year3000 = new Date();
year3000.setFullYear(3000);

const date = new Date();
const dateStr = `Date(${date.getTime()})`;

describe('Tests the iscool date class', () => {
  it('Converts an iscool date string to actual date', () => {
    expect(new IscoolDate(dateStr).time).toEqual(date.getTime());
  });
  it('Converts a day within range', () => {
    expect(new IscoolDate(dateStr, midnight, nextMidnight).isRelevant).toBe(true);
    expect(new IscoolDate(dateStr, year2000, year3000).isRelevant).toBe(true);
    expect(new IscoolDate(dateStr, year2000, midnight).isRelevant).toBe(false);
    expect(new IscoolDate(dateStr, nextMidnight, year3000).isRelevant).toBe(false);
  });
});
