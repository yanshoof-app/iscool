import axios from 'axios';
import { HTTPError } from '../errors/http';

export type FetchFor = 'schedule' | 'changes' | 'classes';

/**
 * Build a fetch URL.
 * @param fetchFor the purpose of the fetch: schedule, changes or classes
 * @param schoolId the id of the school whose the data is requested for
 * @param classId the id of the class whose data is requested for, defaults to 0
 * @returns the url made of those
 */
export function buildFetchUrl(fetchFor: FetchFor, schoolId: string | number, classId: string | number = '0') {
  if (!process.env.BASE_URL) throw new Error('Error: missing environment variable BASE_URL');
  if (!process.env.TOKEN) throw new Error('Error: missing environment variable TOKEN');
  return `https://${process.env.BASE_URL}/api/student/${schoolId}/0/${fetchFor}/?token=${process.env.TOKEN}&clsId=${classId}`;
}

/**
 * Request data from the Iscool API.
 * @param fetchFor the purpose of the fetch: schedule, changes or classes
 * @param schoolId the id of the school whose the data is requested for
 * @param classId the id of the class whose data is requested for, defaults to 0
 * @returns the url made of those
 * @throws error if anything has failed during the request
 * @example
 * try {
 *  const { Classes } = fetchDataSource<IClassesResponse>('classes', school)
 * }
 */
export async function fetchDataSource<T extends {}>(
  fetchFor: FetchFor,
  schoolId: string | number,
  classId: string | number,
) {
  const url = buildFetchUrl(fetchFor, schoolId, classId);
  try {
    const res = await axios.get<T>(url);
    return res.data;
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      (err as any).response &&
      'status' in (err as any).response
    )
      throw new HTTPError((err as any).response.status, 'Error fetching iscool servers');
    throw new Error('Unknown error');
  }
}
