import axios from 'axios';
import { ISchoolSearchRepsonse } from '../interfaces/school';

/**
 * Fetches searching for schools (a different URL query from the rest of the fetches, and only used in this context)
 * @param query the query to search
 * @returns an object returned by the iScool server
 * @example
 * const schoolLookup = SchoolLookup.buildFromQuery(460030); // results: [{ name: "עמי אסף בית ברל", symbol = 460030 }]
 */
export async function fetchSchoolsWithQuery(query: string | number) {
  const url = `https://${process.env.BASE_URL}/api/school/search/?token=${process.env.TOKEN}&name=${encodeURIComponent(
    query,
  )}`;
  const res = await axios.get<ISchoolSearchRepsonse>(url);

  if (res.status !== 200) throw new Error('Error fetching iscool server for school search');
  return res.data;
}
