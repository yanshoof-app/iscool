import { AsyncTaskQueueTestImpl } from '../utils/AsyncTaskQueue/test_utils/AsyncTaskQueueTestImpl';
import { SleepTestTask } from '../utils/AsyncTaskQueue/test_utils/SleepTestTask';
import { FailTestTask } from '../utils/AsyncTaskQueue/test_utils/FailTestTask';

describe('Tests the async task queue method', () => {
  jest.setTimeout(100_000);

  let queue: AsyncTaskQueueTestImpl;
  let tasks: SleepTestTask[];

  beforeEach(() => {
    queue = new AsyncTaskQueueTestImpl();
    tasks = [100, 200, 300, 400, 500].map((d) => new SleepTestTask(d));
  });

  it('Creates 5 successful tasks and executes them', async () => {
    tasks.forEach((task) => queue.enqueue(task));
    expect(queue.size).toBe(tasks.length);
    expect(queue.begunCount).toBe(0);
    expect(queue.enqueuedCount).toBe(tasks.length);
    await queue.execute();
    expect(queue.size).toBe(0);
    expect(queue.begunCount).toBe(tasks.length);
    expect(queue.errorCount).toBe(0);
  });

  it('Adds tasks while queue is executing', async () => {
    queue.enqueue(tasks[0]);
    queue.enqueue(tasks[1]);
    queue.enqueue(tasks[2]);
    tasks[2].on('success', () => {
      queue.enqueue(tasks[4]);
      expect(queue.enqueuedCount).toBe(5);
      expect(queue.begunCount).toBe(3);
    });
    queue.enqueue(tasks[3]);
    expect(queue.enqueuedCount).toBe(4);
    await queue.execute();
    expect(queue.begunCount).toBe(5);
  });

  it('Adds tasks with a problematic one', async () => {
    queue.enqueue(tasks[0]);
    queue.enqueue(tasks[1]);
    queue.enqueue(tasks[2]);
    queue.enqueue(new FailTestTask(100));
    queue.enqueue(tasks[3]);
    queue.enqueue(tasks[4]);

    expect(queue.enqueuedCount).toBe(6);
    await queue.execute();

    expect(queue.begunCount).toBe(6);
    expect(queue.errorCount).toBe(1);
  });
});
