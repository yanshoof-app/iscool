/**
 * Represents an error caused by suceeeding an aborted task
 */
export class TaskShouldNotExecuteError extends Error {
  static get errorName() {
    return 'TaskShouldNotExecuteError';
  }

  static isTaskShouldNotExecuteError(err: unknown): err is TaskShouldNotExecuteError {
    return err instanceof Error && err.name === TaskShouldNotExecuteError.errorName;
  }

  constructor(message?: string) {
    super(message);
    this.name = TaskShouldNotExecuteError.errorName;
  }
}
