import { LessonModification } from '@yanshoof/types';
import { IChangeIscool } from '../interfaces/lesson';
import { ONLINE } from '../strings';
import { ISCOOL } from '../type-convert';

const date = `Date(${new Date().getTime()})`;
const change = {
  StudyGroup: { Subject: 'sub', Teacher: 'tea' },
  ChangeType: 'FreeLesson',
  Date: date,
  Hour: 1,
} as unknown as IChangeIscool;
const event = { ChangeType: '', FixType: 'Special event', Date: date, Hour: 1 } as unknown as IChangeIscool;

describe('converts types', () => {
  it('Converts an iscool date string to actual date', () => {
    const date = new Date();
    const dateStr = `Date(${date.getTime()})`;
    expect(ISCOOL.toDate(dateStr).getTime()).toEqual(date.getTime());
  });
  it('Gets the classroom from an iscool lesson', () => {
    const Te = ONLINE,
      room = 'י7';
    expect(ISCOOL.toClassroom(Te, room)).toBe(Te);
    expect(ISCOOL.toClassroom('', room)).toBe(room);
  });
  it('Converts changes to yanshoof modifications', () => {
    expect(ISCOOL.toModification(change).modification).toBe(LessonModification.Canceled);
    expect(ISCOOL.toModification(event).modification).toBe(LessonModification.Other);
  });
  it('Converts iscool changes to changes', () => {
    expect(ISCOOL.toChange(change).day).toBe(new Date().getDay());
    expect(ISCOOL.toChange(change).subject).toBe(change.StudyGroup.Subject);
  });
  it('Converts iscool changes to events', () => {
    expect(ISCOOL.toEvent(event).day).toBe(new Date().getDay());
    expect(ISCOOL.toEvent(event).subject).toBeUndefined();
  });
});
