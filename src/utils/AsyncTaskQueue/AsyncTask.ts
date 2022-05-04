import { TypedEmitter } from 'tiny-typed-emitter';

/**
 * Represents the event that can happen on an async task
 */
export interface IAsyncTaskEvents<TSuccess, TError> {
  success: (res: TSuccess) => void;
  error: (error: TError) => void;
}

/**
 * An emittable async task
 * @author Itay Schechner
 * @version 1.4.0
 * @abstract
 * @extends TypedEmitter for the ability to emit events
 */
export abstract class AsyncTask<TSuccess, TError> extends TypedEmitter<IAsyncTaskEvents<TSuccess, TError>> {
  /**
   * Begin the task
   * @returns a promise of the desired success type
   */
  protected abstract beginTask(): Promise<TSuccess>;

  async begin() {
    try {
      const result = await this.beginTask();
      this.emit('success', result);
    } catch (err) {
      this.emit('error', err as unknown as TError);
    }
  }
}
