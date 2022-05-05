import { IClassesResponse } from '../../../interfaces/class';
import { IChangesResponse, IScheduleResponse } from '../../../interfaces/lesson';
import { fetchDataSource } from '../../datasource';
import { AsyncTask } from '../AsyncTask';

/**
 * Represents an asyncronous task of fetching the iscool servers
 * @author Itay Schechner
 * @version 1.4.0
 */
export class IscoolFetchTask extends AsyncTask<IClassesResponse | IScheduleResponse | IChangesResponse, Error> {
  private params: Parameters<typeof fetchDataSource>;

  /**
   * Initializes a new IscoolFetchTask object.
   * @param params the parameters of the fetchDataSource object
   */
  constructor(...params: Parameters<typeof fetchDataSource>) {
    super();
    this.params = params;
  }

  protected async beginTask(): Promise<IClassesResponse | IScheduleResponse | IChangesResponse> {
    const res = await fetchDataSource<IClassesResponse | IScheduleResponse | IChangesResponse>(...this.params);
    return res;
  }
}
