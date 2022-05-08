import { TaskShouldNotExecuteError } from '../../../errors/taskShouldNotExecute';
import { AsyncTask } from './AsyncTask';

/**
 * Represents an async task that can be aborted
 * @author Itay Schechner
 * @version 1.4.0
 */
export abstract class AbortableTask<TSuccess, TError> extends AsyncTask<TSuccess, TError> {
  private aborted: boolean;
  private success: boolean;

  constructor() {
    super();
    this.aborted = false;
    this.success = false;
    this.on('success', () => {
      this.success = true;
    });
  }

  /**
   * Begin the task
   * @returns — a promise of the desired success type
   */
  protected abstract beginTaskWhenNotAborted(): Promise<TSuccess>;

  protected async beginTask(): Promise<TSuccess> {
    if (this.aborted) throw new TaskShouldNotExecuteError('Task aborted');
    return await this.beginTaskWhenNotAborted();
  }

  /** returns whether or not the task is aborted */
  get isAborted() {
    return this.aborted;
  }

  /** returns whether or not the task is completed */
  get isSuccessful() {
    return this.success;
  }

  /**
   * Abort a task
   */
  public abort() {
    this.aborted = true;
  }
}
