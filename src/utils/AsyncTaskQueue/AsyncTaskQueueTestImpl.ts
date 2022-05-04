import { AsyncTask } from './AsyncTask';
import { AsyncTaskQueue } from './AsyncTaskQueue';

/**
 * A test implementation of the async task queue
 */
export class AsyncTaskQueueTestImpl extends AsyncTaskQueue<number, Error> {
  public enqueuedCount;
  public begunCount;
  public errorCount;

  constructor() {
    super();
    this.enqueuedCount = 0;
    this.begunCount = 0;
    this.errorCount = 0;
  }

  protected onBeforeTaskEnqueue(): void {
    console.log(
      'Enqueuing task. Queue size: %d, Enqueued: %d, Begun: %d',
      this.size,
      ++this.enqueuedCount,
      this.begunCount,
    );
  }

  protected async onBeforeTaskBegin(): Promise<void> {
    console.log(
      'Beginning task. Queue size: %d, Enqueued: %d, Begun: %d',
      this.size,
      this.enqueuedCount,
      ++this.begunCount,
    );
  }

  protected onTaskError(_task: AsyncTask<number, Error>, err: Error): void {
    console.log('Task failed. Error:', err.message);
    this.errorCount++;
  }

  protected onTaskSuccess(_task: AsyncTask<number, Error>, res: number): void {
    console.log('Task successful! Result:', res);
  }
}
