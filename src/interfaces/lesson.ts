import { DayOfWeek, HourOfDay } from '@yanshoof/types';

/**
 * Represents study groups as sent by the iscool servers
 */
export interface IStudyGroupIscool {
  Teacher: string;
  Subject: string;
}

/**
 * Represents lessons as sent by the iscool servers
 */
export interface ILessonIscool extends IStudyGroupIscool {
  Room: string;
  Note: string;
  Te: string; // zoom or asyncronous
}

/**
 * Represents multiple lessons taking place at the same time,
 * along with the day and hour of the timetable they take place in.
 */
export interface ILessonArrMemberIscool {
  Day: DayOfWeek;
  Hour: HourOfDay;
  Lessons: ILessonIscool[];
}

type IscoolChangeType = 'FreeLesson' | 'Exam' | 'NewTeacher' | 'NewRoom' | 'NewHour' | 'Addition';

/**
 * Represents an object with an iscool date
 */
export interface IWithDate {
  Date: string;
}

/**
 * Represents changes as sent by Iscool
 */
export interface IChangeIscool extends IWithDate {
  Hour: HourOfDay;
  ChangeType: IscoolChangeType;
  FixType: string;
  StudyGroup: IStudyGroupIscool;
  NewRoom: string;
  NewTeacher: string;
  NewHour: HourOfDay;
}

/**
 * Represents a response of changes sent by iscool
 */
export interface IChangesResponse {
  ClassId: number;
  Changes: IChangeIscool[];
  Status: string;
}

/**
 * Represents a response of schedule sent by iscool
 */
export interface IScheduleResponse {
  ClassId: number;
  Schedule: ILessonArrMemberIscool[];
  Status: string;
}
