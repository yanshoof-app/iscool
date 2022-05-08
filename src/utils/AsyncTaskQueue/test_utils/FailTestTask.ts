import { SleepTestTask } from './SleepTestTask';

/**
 * Represents a failing test task
 */
export class FailTestTask extends SleepTestTask {
  /**
   * Initialize a new failing tasl
   * @param delay the delay before failing
   */
  constructor(delay: number) {
    super(delay);
  }

  protected async beginTask(): Promise<number> {
    await this.sleep();
    throw new Error('Task failed');
  }
}
