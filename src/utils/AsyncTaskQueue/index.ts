import { HTTPError } from '../../errors/http';
import { IscoolServerException } from '../../errors/iscoolServer';
import { IClassesResponse } from '../../interfaces/class';
import { IChangesResponse, IScheduleResponse } from '../../interfaces/lesson';
import { AbortableTaskQueue } from './AbortableTaskQueue';
import DelayManager from './DelayManager';
import { IscoolFetchTask } from './tasks/IscoolFetchTask';

interface IEvents {
  sleep: (time: number) => void;
}

/**
 * An implementation of a queue of Iscool Requests
 * @author Itay Schechner
 * @version 1.5.0
 */
export class IscoolRequestQueue extends AbortableTaskQueue<
  IClassesResponse | IScheduleResponse | IChangesResponse,
  Error,
  IEvents,
  IscoolFetchTask<IClassesResponse | IScheduleResponse | IChangesResponse>
> {
  public static MAX_DELAY_TRESHOLD = 60_000; // 60 seconds of waiting

  /**
   * Constructs a new Iscool Request Queue.
   */
  constructor() {
    super();
    DelayManager.reset();
  }

  private async sleep() {
    return new Promise((resolve) => {
      setTimeout(resolve, DelayManager.currentRandomizedDelay);
    });
  }

  protected onBeforeTaskEnqueue(): void {
    if (DelayManager.currentDelay * this.size > IscoolRequestQueue.MAX_DELAY_TRESHOLD)
      throw new IscoolServerException('Iscool servers too busy');
  }

  protected async onBeforeUnabortedTaskBegin(): Promise<void> {
    if (DelayManager.currentDelay) {
      this.emit('sleep', DelayManager.currentDelay);
      await this.sleep();
    }
  }

  protected onTaskError(
    task: IscoolFetchTask<IClassesResponse | IScheduleResponse | IChangesResponse>,
    err: Error,
  ): void {
    if (HTTPError.isHTTPError(err) && err.code === HTTPError.TOO_MANY_REQUESTS) {
      // iscool servers are blocking us
      DelayManager.increaseDelay();
      // add failed request back to the queue
      this.queue.enqueue(task);
    } else throw err;
  }

  protected onTaskSuccess(): void {
    DelayManager.decreaseDelay();
  }
}
