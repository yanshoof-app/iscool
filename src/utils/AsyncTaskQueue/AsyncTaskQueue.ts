import { ListenerSignature, TypedEmitter } from 'tiny-typed-emitter';
import { TaskShouldNotExecuteError } from '../../errors/taskShouldNotExecute';
import { AsyncTask } from './tasks/AsyncTask';
import { Queue } from './queue/Queue';
/**
 * An abstraction of a queue of requests
 * @author Itay Schechner
 * @version 1.4.0
 */
export abstract class AsyncTaskQueue<
  TSuccess,
  TError,
  TEvents extends ListenerSignature<TEvents> = object,
  TTask extends AsyncTask<TSuccess, TError> = AsyncTask<TSuccess, TError>,
> extends TypedEmitter<TEvents> {
  protected queue: Queue<TTask>;
  private isExecuting: boolean;

  /**
   * Construct a new queue
   */
  constructor() {
    super();
    this.queue = new Queue();
    this.isExecuting = false;
  }

  /**
   * Fire before task enqueue
   * @param task the task to be enqueued
   * @throws if task should not be enqueued
   */
  protected abstract onBeforeTaskEnqueue(task: TTask): void;

  /**
   * Fire before task execution begins
   * @param task the task to be executed
   * @throws {TaskShouldNotExecuteError} if should not execute
   */
  protected abstract onBeforeTaskBegin(task: TTask): Promise<void>;

  /**
   * Fires on task errors
   * @param task the task failed
   * @param err the error given from the task
   */
  protected abstract onTaskError(task: TTask, err: TError): void;

  /**
   * Fire on task completion
   * @param task the task succeeses
   * @param res the result given from the task
   */
  protected abstract onTaskSuccess(task: TTask, res: TSuccess): void;

  /**
   * Enqueue a new task.
   * @param task the task to enqueue
   * @throws if can't enqueue task
   */
  public enqueue(task: TTask) {
    this.onBeforeTaskEnqueue(task); // might throw error
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
      try {
        const nextTask = this.queue.dequeue();
        await this.onBeforeTaskBegin(nextTask);
        await nextTask.begin();
      } catch (err) {
        if (TaskShouldNotExecuteError.isTaskShouldNotExecuteError(err)) continue;
        throw err;
      }
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
