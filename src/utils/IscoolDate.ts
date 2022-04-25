import { DayOfWeek } from '@yanshoof/types';
import { IrrelevantDateException } from '../errors/date';
import { IChangeIscool } from '../interfaces/lesson';

/**
 * Represents a date as given by Iscool
 * @author Itay Schechner
 * @version 1.3.0
 */
export class IscoolDate {
  private date: Date;
  readonly isRelevant;

  /**
   * Constructs a new iscool date within a range
   * @param iscoolDate the date string as sent by iscool
   * @param relevantFrom the minimum date
   * @param relevantUntil the maximum date
   */
  constructor(iscoolDate: string, relevantFrom?: Date, relevantUntil?: Date) {
    const milleseconds = iscoolDate.match(/(\d+)/)[1];
    this.date = new Date(Number(milleseconds));
    if (relevantFrom && relevantUntil) this.isRelevant = this.isBefore(relevantUntil) && this.isAfter(relevantFrom);
    else this.isRelevant = true;
  }

  /**
   * Returns the day of the week
   * @throw if irrelevant
   */
  get day(): DayOfWeek {
    if (!this.isRelevant) throw new IrrelevantDateException();
    return this.date.getDay() as DayOfWeek;
  }

  /**
   * Calls for `date.getTime()` on the date
   */
  get time(): number {
    return this.date.getTime();
  }

  /**
   * Check if before a given date
   * @return true if before, false otherwise
   */
  public isBefore(other: Date) {
    return this.date <= other;
  }

  /**
   * Check if before a given date
   * @return true if before, false otherwise
   */
  public isAfter(other: Date) {
    return this.date >= other;
  }

  /**
   * Filters changes by date
   * @param changes the changes to filter
   * @param lastUpdateTime the start of the date range
   * @param relevantUntil the end of the date range
   * @returns an array of relevant changes
   */
  static newChanges(changes: IChangeIscool[], lastUpdateTime: Date, relevantUntil: Date) {
    return changes.filter(({ Date }) => {
      const date = new IscoolDate(Date, lastUpdateTime, relevantUntil);
      return date.isRelevant;
    });
  }
}
