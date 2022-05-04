/**
 * Represents a linked list node
 */
class LinkedListNode<T = unknown> {
  public value: T;
  public next: LinkedListNode<T> | null;
  constructor(value: T, next: LinkedListNode | null = null) {
    this.value = value;
    this.next = next as LinkedListNode<T> | null;
  }
}

/**
 * A Classical linked list, implemented with TypeScript
 * @author Itay Schechner
 * @version 1.4.0
 */
export class LinkedList<T = unknown> {
  public head: LinkedListNode<T> | null;
  public tail: LinkedListNode<T> | null;
  private elementCount;

  /**
   * Construct an empty list
   */
  constructor() {
    this.head = null;
    this.tail = null;
    this.elementCount = 0;
  }

  /**
   * Add to the beginning of a list
   * @param value the value to add
   * @returns the list object for optional chaning
   */
  prepend(value: T) {
    const newNode = new LinkedListNode(value, this.head);
    this.head = newNode;

    if (!this.tail) {
      this.tail = newNode;
    }

    this.elementCount++;

    return this;
  }

  /**
   * Add to the end of a list
   * @param value the value to add
   * @returns the list object for optional chaining
   */
  append(value: T) {
    const newNode = new LinkedListNode(value);

    this.elementCount++;

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return this;
    }

    if (this.tail) this.tail.next = newNode;
    this.tail = newNode;
    return this;
  }

  /**
   * Delete values from the list
   * @param value the value to delete
   * @returns the last node deleted
   */
  delete(value: T) {
    if (!this.head) return null;

    // delete head if needs to
    let deletedNode: LinkedListNode<T> | null = null;
    while (this.head && this.head.value === value) {
      deletedNode = this.head;
      this.head = this.head.next;
      this.elementCount--;
    }

    let currentNode: LinkedListNode<T> | null = this.head;
    if (currentNode !== null) {
      while (currentNode.next) {
        if (currentNode.next.value === value) {
          deletedNode = currentNode.next;
          currentNode.next = currentNode.next.next;
          this.elementCount--;
        } else {
          currentNode = currentNode.next;
        }
      }
    }

    // delete tail if needs to
    if (this.tail?.value === value) {
      this.tail = currentNode;
      this.elementCount--;
    }

    return deletedNode;
  }

  /**
   * Remove the last element of the list
   * @returns the tail deleted
   */
  deleteTail() {
    const deletedTail = this.tail;

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;

      if (this.tail) this.elementCount--;

      return deletedTail;
    }

    let currentNode = this.head;
    while (currentNode?.next) {
      if (!currentNode?.next?.next) {
        currentNode.next = null;
      } else {
        currentNode = currentNode?.next;
      }
    }
    this.tail = currentNode;
    this.elementCount--;

    return deletedTail;
  }

  /**
   * Delete the first element of the list
   * @returns the deleted head
   */
  deleteHead() {
    if (!this.head) {
      return null;
    }

    const deletedHead = this.head;

    if (this.head != this.tail) {
      this.head = this.head.next;
    } else {
      this.head = null;
      this.tail = null;
    }

    this.elementCount--;

    return deletedHead;
  }

  /**
   * Create from array
   * @param values the array of value to add to the list
   */
  fromArray(values: T[]) {
    values.forEach((value) => this.append(value));
    this.elementCount += values.length;
  }

  /**
   * Create an array from the list
   * @returns an array with the objects
   */
  toArray() {
    const nodes = [];

    let currentNode = this.head;
    while (currentNode) {
      nodes.push(currentNode.value);
      currentNode = currentNode.next;
    }

    return nodes;
  }

  /**
   * Return the number of elements in the list
   */
  get size() {
    return this.elementCount;
  }
}
