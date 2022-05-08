import { AsyncTask } from './AsyncTask';
import { Queue } from './queue/Queue';

/**
 * An abstraction of a queue of requests
 * @author Itay Schechner
 * @version 1.4.0
 */
export abstract class AsyncTaskQueue<TSuccess, TError> {
  protected queue: Queue<AsyncTask<TSuccess, TError>>;
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
  protected abstract onBeforeTaskEnqueue(task: AsyncTask<TSuccess, TError>): void;

  /**
   * Fire before task execution begins
   */
  protected abstract onBeforeTaskBegin(): Promise<void>;

  /**
   * Fires on task errors
   * @param task the task failed
   * @param err the error given from the task
   */
  protected abstract onTaskError(task: AsyncTask<TSuccess, TError>, err: TError): void;

  /**
   * Fire on task completion
   * @param task the task succeeses
   * @param res the result given from the task
   */
  protected abstract onTaskSuccess(task: AsyncTask<TSuccess, TError>, res: TSuccess): void;

  /**
   * Enqueue a new task.
   * @param task the task to enqueue
   */
  public enqueue(task: AsyncTask<TSuccess, TError>) {
    this.onBeforeTaskEnqueue(task);
    this.queue.enqueue(task);
    task.on('error', (err) => {
      this.onTaskError(task, err);
    });
    task.on('success', (res) => {
      this.onTaskSuccess(task, res);
    });
  }

  /**
   * Execute all tasks, if haven't already
   */
  public async execute() {
    if (this.isExecuting) return;
    this.isExecuting = true;
    while (!this.queue.isEmpty()) {
      await this.onBeforeTaskBegin();
      await this.queue.dequeue().begin();
    }
    this.isExecuting = false;
  }

  /**
   * Get the size of the queue
   */
  get size() {
    return this.queue.size;
  }
}
