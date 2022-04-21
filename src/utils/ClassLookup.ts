import { IClassLookup } from '@yanshoof/types';
import { IClassesResponse, IClassIscool } from '../interfaces/class';
import { fetchDataSource } from './datasource';

/**
 * Represents a class lookup object created from iscool
 * @author Itay Schechner
 * @version 1.2.0
 * @implements IClassLookup
 */
export class IscoolClassLookup implements IClassLookup {
  /**
   * Constructs a new IscoolClassLookup object from school
   * @param schoolSymbol the school whose classes are required
   * @returns an IscoolClassLookup object
   * @example
   * const { grades, classes } = await IscoolClassLookup.fromSchool(school);
   */
  public static async fromSchool(schoolSymbol: string): Promise<IscoolClassLookup> {
    const { Classes } = await fetchDataSource<IClassesResponse>('classes', schoolSymbol, 0);
    return new IscoolClassLookup(Classes);
  }

  static readonly CLASS_NOT_FOUND = -1;
  private gradeMap: Map<number, number[]>;

  /**
   * Initialize a class lookup from Iscool classes
   * @param classes the array of Iscool classes to create a class lookup from
   * @example
   * const classLookup = new ClassLookup(Classes)
   */
  constructor(classes: IClassIscool[]) {
    let grades = classes.map(({ Grade }) => Grade);
    const classNums = classes.map(({ Number: classNum }) => classNum);

    grades = [...new Set(grades)]; // unique values only
    const maxClassNum = Math.max(...classNums);
    this.gradeMap = new Map(grades.map((grd) => [grd, new Array(maxClassNum).fill(IscoolClassLookup.CLASS_NOT_FOUND)]));
    classes.forEach(({ Grade, Number: classNum, Id }) => this.setId(Grade, classNum, Id));
  }

  private setId(grade: number, classNum: number, id: number) {
    this.gradeMap.get(grade)[classNum - 1] = id;
  }

  get classIds(): number[][] {
    let arr: number[][] = [];
    for (let [, classIds] of this.gradeMap) arr.push(classIds);
    return arr;
  }
  get grades(): number[] {
    return [...this.gradeMap.keys()];
  }

  /**
   * Count the number of grades
   * @returns the number of grades in the class lookup object
   */
  get gradeSize(): number {
    return this.gradeMap.size;
  }
}
