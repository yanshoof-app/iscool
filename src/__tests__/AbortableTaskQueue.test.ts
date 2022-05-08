import { AbortableTaskQueueTestImpl } from '../utils/AsyncTaskQueue/test_utils/AbortableTaskQueueTestImpl';
import { AbortableSleepTestTask } from '../utils/AsyncTaskQueue/test_utils/AbortableSleepTestTask';

describe('Tests the async task queue method', () => {
  jest.setTimeout(100_000);

  let queue: AbortableTaskQueueTestImpl;
  let tasks: AbortableSleepTestTask[];

  beforeEach(() => {
    queue = new AbortableTaskQueueTestImpl();
    tasks = [100, 200, 300, 400, 500].map((d) => new AbortableSleepTestTask(d));
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

  it('Aborts a task', async () => {
    tasks.forEach((task) => queue.enqueue(task));
    tasks[0].on('success', () => {
      tasks[2].abort();
    });
    expect(queue.size).toBe(tasks.length);
    expect(queue.begunCount).toBe(0);
    expect(queue.enqueuedCount).toBe(tasks.length);
    await queue.execute();
    expect(queue.size).toBe(0);
    expect(queue.begunCount).toBe(tasks.length - 1);
    expect(queue.errorCount).toBe(0);
  });
});
