import { Queue } from '../utils/queue/Queue';

describe('Tests the queue class', () => {
  const queue = new Queue<number>();

  it('Tests isEmpty and peek on an empty queue', () => {
    expect(queue.isEmpty()).toBe(true);
    expect(queue.peek()).toBeNull();
  });

  it('Adds elements to the queue', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    queue.enqueue(4);
    queue.enqueue(5);
    expect(queue.size).toBe(5);
    expect(queue.toArray()).toStrictEqual([1, 2, 3, 4, 5]);
  });

  it('Tests isEmpty and peek on a full queue', () => {
    expect(queue.isEmpty()).toBe(false);
    expect(queue.peek()).toBe(1);
  });

  it('Tests the dequeue method', () => {
    expect(queue.dequeue()).toBe(1);
    expect(queue.size).toBe(4);
    expect(queue.toArray()).toStrictEqual([2, 3, 4, 5]);
  });
});
