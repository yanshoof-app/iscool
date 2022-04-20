import { DayOfWeek, HourOfDay } from '@yanshoof/types';

export interface IStudyGroupIscool {
  Teacher: string;
  Subject: string;
}

export interface ILessonIscool extends IStudyGroupIscool {
  Room: string;
  Note: string;
  Te: string; // zoom or asyncronous
}

export interface ILessonArrMemberIscool {
  Day: DayOfWeek;
  Hour: HourOfDay;
  Lessons: ILessonIscool[];
}

type IscoolChangeType = 'FreeLesson' | 'Exam' | 'NewTeacher' | 'NewRoom' | 'NewHour' | 'Addition';

/**
 * Represents changes as sent by Iscool
 */
export interface IChangeIscool {
  Date: string; // why tho??
  Hour: HourOfDay;
  ChangeType: IscoolChangeType;
  FixType: string;
  StudyGroup: IStudyGroupIscool;
  NewRoom: string;
  NewTeacher: string;
  NewHour: HourOfDay;
}

export interface IChangesResponse {
  ClassId: number;
  Changes: IChangeIscool[];
  Status: string;
}

export interface IScheduleResponse {
  ClassId: number;
  Schedule: ILessonArrMemberIscool[];
  Status: string;
}
