import { IClassLookup } from '@yanshoof/types';
import { fetchDataSource, IscoolClassLookup } from '..';
import { IClassesResponse, IClassIscool } from '../interfaces/class';

const AMI_ASSAF = '460030';

describe('Tests the class lookup object', () => {
  let classLookup: IClassLookup;
  let classes: IClassIscool[];
  it('Fetches test data from the server', async () => {
    const res = await fetchDataSource<IClassesResponse>('classes', AMI_ASSAF, 0);
    classes = res.Classes;
  });
  it('Creates a new class lookup object', async () => {
    classLookup = await IscoolClassLookup.fromSchool(AMI_ASSAF);
    expect(classLookup).toBeDefined();
  });
  it('Tests the grades method', async () => {
    const grades = [...new Set(classes.map(({ Grade }) => Grade))];
    expect(classLookup.grades).toStrictEqual(grades);
  });
  it('Tests the classIds method', async () => {
    const classIds = classes.map(({ Id }) => Id);

    console.log(classLookup.classIds);
    expect(classIds).toStrictEqual(classLookup.classIds.flat().filter((id) => id != IscoolClassLookup.CLASS_NOT_FOUND));
    expect(classLookup.classIds.length).toEqual(classLookup.grades.length);
  });
});
