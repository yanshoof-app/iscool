/**
 * A Classical queue, implemented with TypeScript
 * @author Itay Schechner
 * @version 1.4.0
 */
import { LinkedList } from './LinkedList';

export class Queue<T = unknown> {
  private linkedList: LinkedList<T>;

  /**
   * Construct an empty queue
   */
  constructor() {
    this.linkedList = new LinkedList();
  }

  /**
   * Check if empty
   * @returns true if empty, false otherwise
   */
  isEmpty() {
    return !this.linkedList.head;
  }

  /**
   * Return first element of the queue without deleting it
   * @returns the first element of the queue
   */
  peek() {
    if (!this.linkedList.head) return null;
    return this.linkedList.head.value;
  }

  /**
   * Add a value to the end of a queue
   * @param value the value to add
   */
  enqueue(value: T) {
    this.linkedList.append(value);
  }

  /**
   * Get the first element of the queue
   * @returns the first value of the queue
   */
  dequeue() {
    const removedHead = this.linkedList.deleteHead();
    return removedHead ? removedHead.value : null;
  }

  /**
   * Add elements to the queue
   * @param array the array to turn into list
   */
  fromArray(array: T[]) {
    this.linkedList.fromArray(array);
  }

  /**
   * Converts to an array
   * @returns an array with the ququ object
   */
  toArray() {
    return this.linkedList.toArray();
  }

  /**
   * Get the number of elements in the queue
   */
  get size() {
    return this.linkedList.size;
  }
}
