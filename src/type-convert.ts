import {
  IModification,
  LessonModification,
  ILesson,
  ITeacherLesson,
  IChange,
  DayOfWeek,
  HourOfDay,
  ISchoolLookupResult,
  IStudyGroup,
} from '@yanshoof/types';
import { IChangeIscool, ILessonIscool, IStudyGroupIscool } from './interfaces/lesson';
import { ISchoolSearchResultIscool } from './interfaces/school';
import { CLASS_UNAVAILABLE, ONLINE, ONLINE_ASYNCRONOUS } from './strings';
import { IscoolDate } from './utils/IscoolDate';

/**
 * A container class to convert Iscool types to our own
 * @authors Itay Schechner, Itay Oshri
 * @version 1.3.0
 */
export class ISCOOL {
  /**
   * Converts a date to its matching JavaScript Date object.
   * Deprecated - use the IscoolDate class
   * @deprecated
   */
  static toDate(date: string) {
    const milleseconds = date.match(/(\d+)/)[1];
    return new Date(Number(milleseconds));
  }

  /**
   * Returns a string representation of where the lesson will be learnt/
   * @param Te the lesson type, as specified by Iscool - none, online, asyncronous
   * @param Room thr room specified by Iscool
   * @returns a string representing thr (actual) room / Zoom / Async description of the lesson's location
   */
  static toClassroom(Te: string, Room: string): string {
    return Te === ''
      ? Room
      : Te === ONLINE
      ? ONLINE
      : Te === ONLINE_ASYNCRONOUS
      ? ONLINE_ASYNCRONOUS
      : CLASS_UNAVAILABLE;
  }

  /**
   * Converts an iscool study group object to our own. Covers edge cases from the iscool API.
   * @param ob the object to convery
   * @returns its representation mapped to studyGroup
   */
  static toStudyGroup(ob: IStudyGroupIscool | undefined | string): IStudyGroup {
    if (!ob || typeof ob !== 'object') return {} as IStudyGroup;
    return { subject: ob.Subject, teacher: ob.Teacher };
  }

  /**
   * Represents a representation of the change type and data in a compact way.
   * @param change the change object, as specified by Iscool
   * @returns its matching modification object
   */
  static toModification(change?: IChangeIscool): IModification {
    switch (change.ChangeType) {
      case 'FreeLesson':
        return { modification: LessonModification.Canceled };
      case 'Exam':
        return { modification: LessonModification.Exam };
      case 'NewTeacher':
        return {
          modification: LessonModification.NewTeacher,
          modData: change.NewTeacher,
        };
      case 'NewRoom':
        return {
          modification: LessonModification.NewRoom,
          modData: change.NewRoom,
        };
      case 'NewHour':
        return {
          modification: LessonModification.NewHour,
          modData: change.NewHour,
        };
      case 'Addition':
        return {
          modification: LessonModification.Other,
          modData: change.FixType,
        };
      default:
        return {
          modification: LessonModification.Other,
          modData: `${change.ChangeType} ${change.FixType}`,
        };
    }
  }

  /**
   * Returns a representation of an Iscool lesson in an ILesson format.
   * @param lesson the iscool lesson
   * @returns its representation in an ILesson format
   */
  static toLesson({ Te, Room, ...studyGroup }: ILessonIscool): ILesson {
    return {
      ...ISCOOL.toStudyGroup(studyGroup),
      class: ISCOOL.toClassroom(Te, Room),
    };
  }

  /**
   * Returns a representation of an Iscool lesson in an ITeacherLesson format
   * @param param0 the iscool lesson
   * @returns its representation in an ITeacherLesson format
   */
  static toTeacherLesson({ Subject, Te, Room }: ILessonIscool): ITeacherLesson {
    return {
      subject: Subject,
      class: ISCOOL.toClassroom(Te, Room),
    };
  }

  /**
   * Converts an Iscool search result to a ISchoolLookupResult format
   * @param param0 the search result to convert
   * @returns its representation in the specified format
   */
  static toSchoolLookupResult({ name, semel }: ISchoolSearchResultIscool): ISchoolLookupResult {
    return {
      name,
      symbol: semel,
    };
  }

  /**
   * Converts an Iscool change object to ours
   * @param change the change given by Iscool
   * @returns its matching IChange representation
   */
  static toChange(change: IChangeIscool): IChange {
    return {
      ...ISCOOL.toStudyGroup(change.StudyGroup),
      day: new IscoolDate(change.Date).day,
      hour: change.Hour as HourOfDay,
      ...this.toModification(change),
    };
  }

  /**
   * Converts an Iscool event object to ours
   * Deprecated - toChange now supports studyGroupless changes
   * @deprecated
   */
  static toEvent(event: IChangeIscool): IChange {
    return {
      day: new IscoolDate(event.Date).day,
      hour: event.Hour as HourOfDay,
      ...this.toModification(event),
    } as IChange;
  }
}
