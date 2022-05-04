import { AsyncTaskQueueTestImpl } from '../utils/AsyncTaskQueue/AsyncTaskQueueTestImpl';
import { SleepTestTask } from '../utils/AsyncTaskQueue/tasks/SleepTestTask';

const tasks = [100, 200, 300, 400, 500].map((d) => new SleepTestTask(d));

describe('Tests the async task queue method', () => {
  jest.setTimeout(100_000);
  let queue: AsyncTaskQueueTestImpl;
  it('Creates 5 successful tasks and executes them', async () => {
    queue = new AsyncTaskQueueTestImpl();
    tasks.forEach((task) => queue.enqueue(task));
    expect(queue.size).toBe(tasks.length);
    expect(queue.begunCount).toBe(0);
    expect(queue.enqueuedCount).toBe(tasks.length);
    await queue.execute();
    expect(queue.size).toBe(0);
    expect(queue.begunCount).toBe(tasks.length);
    expect(queue.errorCount).toBe(0);
  });
});
