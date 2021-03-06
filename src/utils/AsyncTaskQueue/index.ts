import { HTTPError } from '../../errors/http';
import { IscoolServerException } from '../../errors/iscoolServer';
import { IClassesResponse } from '../../interfaces/class';
import { IChangesResponse, IScheduleResponse } from '../../interfaces/lesson';
import { AbortableTaskQueue } from './AbortableTaskQueue';
import { IscoolFetchTask } from './tasks/IscoolFetchTask';

interface IEvents {
  sleep: (time: number) => void;
}

/**
 * An implementation of a queue of Iscool Requests
 * @author Itay Schechner
 * @version 1.4.0
 */
export class IscoolRequestQueue extends AbortableTaskQueue<
  IClassesResponse | IScheduleResponse | IChangesResponse,
  Error,
  IEvents,
  IscoolFetchTask<IClassesResponse | IScheduleResponse | IChangesResponse>
> {
  public static MAX_DELAY_TRESHOLD = 60_000; // 60 seconds of waiting
  public static DELAY_INTERVAL = 100; // 100ms of waiting
  public static SUCCESS_INTERVAL = 2; // 2 tasks to take down delay

  /**
   * Represents a delay between requests, in milliseconds
   */
  private delay: number;

  /**
   * Represents the number of requests blocked so far
   */
  private countBlocked = 0;

  /**
   * Represents the number of successful requests so far
   */
  private countSuccessful = 0;

  /**
   * Constructs a new Iscool Request Queue.
   */
  constructor() {
    super();
    this.delay = 0;
  }

  private async sleep() {
    return new Promise((resolve) => {
      setTimeout(resolve, this.delay);
    });
  }

  protected onBeforeTaskEnqueue(): void {
    if (this.delay * this.size > IscoolRequestQueue.MAX_DELAY_TRESHOLD)
      throw new IscoolServerException('Iscool servers too busy');
  }

  protected async onBeforeUnabortedTaskBegin(): Promise<void> {
    if (this.delay) {
      this.emit('sleep', this.delay);
      await this.sleep();
    }
  }

  protected onTaskError(
    task: IscoolFetchTask<IClassesResponse | IScheduleResponse | IChangesResponse>,
    err: Error,
  ): void {
    this.countSuccessful = 0;
    if (HTTPError.isHTTPError(err) && err.code === HTTPError.TOO_MANY_REQUESTS) {
      // iscool servers are blocking us
      this.countBlocked++;
      this.delay += this.countBlocked * IscoolRequestQueue.DELAY_INTERVAL; // delay increases by n^2 over time
      // add failed request back to the queue
      this.queue.enqueue(task);
    } else throw err;
  }

  protected onTaskSuccess(): void {
    this.countSuccessful++;
    this.countBlocked = 0;
    const delayToSubtract =
      (this.countSuccessful / IscoolRequestQueue.SUCCESS_INTERVAL) * IscoolRequestQueue.DELAY_INTERVAL;
    if (delayToSubtract <= this.delay) this.delay -= delayToSubtract;
    else this.delay = 0;

    // reset delay when queue is empty
    if (!this.size) this.delay = 0;
  }
}
