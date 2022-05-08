import { ListenerSignature } from 'tiny-typed-emitter';
import { TaskShouldNotExecuteError } from '../../errors/taskShouldNotExecute';
import { AsyncTaskQueue } from './AsyncTaskQueue';
import { AbortableTask } from './tasks/AbortableTask';

/**
 * Represents a queue of abortable tasks
 * @author Itay Schechner
 * @version 1.4.0
 */
export abstract class AbortableTaskQueue<
  TSuccess,
  TError,
  TEvents extends ListenerSignature<TEvents> = object,
> extends AsyncTaskQueue<TSuccess, TError, TEvents, AbortableTask<TSuccess, TError>> {
  /** Fires before task begins, if not aborted */
  protected abstract onBeforeUnabortedTaskBegin(): Promise<void>;

  protected async onBeforeTaskBegin(task: AbortableTask<TSuccess, TError>): Promise<void> {
    if (task.isAborted) throw new TaskShouldNotExecuteError('Task Aborted');
    await this.onBeforeUnabortedTaskBegin();
  }
}
