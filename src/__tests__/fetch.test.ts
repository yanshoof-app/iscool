import axios from 'axios';
import { fetchDataSource, fetchSchoolsWithQuery } from '..';
import { IClassesResponse, isIscoolClass } from '../interfaces/class';
import { IChangesResponse, IScheduleResponse } from '../interfaces/lesson';

axios.defaults.adapter = axios.defaults.adapter = require('axios/lib/adapters/http');

const AMI_ASSAF_SYMBOL = '460030';

describe('fetches data from iscool servers', () => {
  it('fetches classes', async () => {
    const result = await fetchDataSource<IClassesResponse>('classes', AMI_ASSAF_SYMBOL, 0);
    expect(result.Status).toBe('success');
    expect(isIscoolClass(result.Classes[0])).toBe(true);
  });
  it('fetches schedule', async () => {
    const result = await fetchDataSource<IScheduleResponse>('schedule', AMI_ASSAF_SYMBOL, 28);
    expect(result.Status).toBe('success');
    expect(result.Schedule.length).toBeTruthy();
    expect(result.Schedule[0].Lessons.length).toBeTruthy();
  });
  it('fetches changes', async () => {
    const result = await fetchDataSource<IChangesResponse>('changes', AMI_ASSAF_SYMBOL, 28);
    expect(result.Status).toBe('success');
    expect(result.Changes.length).toBeDefined();
  });
  it('fetches schools', async () => {
    const result = await fetchSchoolsWithQuery(AMI_ASSAF_SYMBOL);
    expect(result.Status).toBe('success');
    expect(result.Schools).toBeDefined();
    expect(result.Schools.length).toBe(1);
    expect(result.Schools[0].name).toBe('עמי אסף בית ברל');
  });
});
