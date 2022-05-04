import { AsyncTask } from './AsyncTask';
import { Queue } from './queue/Queue';

/**
 * An abstraction of a queue of requests
 * @author Itay Schechner
 * @version 1.4.0
 */
export abstract class AsyncTaskQueue<TSuccess, TError> {
  private queue: Queue<AsyncTask<TSuccess, TError>>;
  private isExecuting: boolean;

  /**
   * Construct a new queue
   */
  constructor() {
    this.queue = new Queue();
    this.isExecuting = false;
  }

  /**
   * Fire before task enqueue
   * @param task the task to be enqueued
   * @throws if task should not be enqueued
   */
  protected abstract onBeforeTaskEnqueue(task: AsyncTask<TSuccess, TError>): Promise<void>;

  /**
   * Fire on task errors
   * @param err the error given from the task
   */
  protected abstract onTaskError(err: TError): void;

  /**
   * Fire before task execution begins
   */
  protected abstract onBeforeTaskBegin(): Promise<void>;

  /**
   * Enqueue a new task.
   * @param task the task to enqueue
   */
  public enqueue(task: AsyncTask<TSuccess, TError>) {
    this.onBeforeTaskEnqueue(task);
    this.queue.enqueue(task);
    task.on('error', (err) => {
      this.onTaskError(err);
    });
  }

  /**
   * Execute all tasks, if haven't already
   */
  public async execute() {
    if (this.isExecuting) return;
    this.isExecuting = true;
    while (!this.queue.isEmpty()) {
      this.onBeforeTaskBegin();
      await this.queue.dequeue().begin();
    }
    this.isExecuting = false;
  }
}
