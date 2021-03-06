import { AsyncTask } from '../tasks/AsyncTask';

/**
 * Represents a sleep async task
 */
export class SleepTestTask extends AsyncTask<number, Error> {
  private delay: number;

  /**
   * Construct a new test task
   * @param delay the milliseconds the task will take
   */
  constructor(delay: number) {
    super();
    this.delay = delay;
  }

  protected async sleep() {
    return new Promise((resolve) => {
      setTimeout(resolve, this.delay);
    });
  }

  protected async beginTask(): Promise<number> {
    await this.sleep();
    return this.delay;
  }
}
