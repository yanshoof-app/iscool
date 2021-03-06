/**
 * Represents a school lookup array member
 */
export interface ISchoolSearchResultIscool {
  name: string;
  semel: number; // school id in hebrew for some reason
  // code: number
}

/**
 * Represents the school search result from iscool
 */
export interface ISchoolSearchRepsonse {
  Status: string;
  Schools: ISchoolSearchResultIscool[];
}
