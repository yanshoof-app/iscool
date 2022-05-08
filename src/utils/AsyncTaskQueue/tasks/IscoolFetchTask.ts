import { IClassesResponse } from '../../../interfaces/class';
import { IChangesResponse, IScheduleResponse } from '../../../interfaces/lesson';
import { fetchDataSource } from '../../datasource';
import { AsyncTask } from './AsyncTask';

/**
 * Represents an asyncronous task of fetching the iscool servers
 * @author Itay Schechner
 * @version 1.4.0
 */
export class IscoolFetchTask<T extends IClassesResponse | IScheduleResponse | IChangesResponse> extends AsyncTask<
  T,
  Error
> {
  private params: Parameters<typeof fetchDataSource>;

  /**
   * Initializes a new IscoolFetchTask object.
   * @param params the parameters of the fetchDataSource object
   */
  constructor(...params: Parameters<typeof fetchDataSource>) {
    super();
    this.params = params;
  }

  protected async beginTask(): Promise<T> {
    const res = await fetchDataSource<T>(...this.params);
    return res;
  }

  get fetchFor() {
    return this.params[0];
  }

  get school() {
    return this.params[1];
  }

  get classId() {
    return this.params[2];
  }
}
