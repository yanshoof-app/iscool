/**
 * Represents the class type as given by iscool
 */
export interface IClassIscool {
  Id: number;
  Grade: number;
  Number: number;
  // Name: string;
}

/**
 * Checks if a given object is an instance of IClassIscool
 * @param obj the object to check
 * @returns true if all fields of the IClassIscool interface are present in the object
 */
export function isIscoolClass(obj: unknown): obj is IClassIscool {
  return typeof obj === 'object' && 'Id' in obj && 'Grade' in obj && 'Number' in obj;
}

/**
 * The response received from Iscool when fetching for classes
 */
export interface IClassesResponse {
  ClassId: number; // why tho??
  Classes: IClassIscool[];
  Status: string;
}
