import { IscoolFetchTask } from '../utils/AsyncTaskQueue/tasks/IscoolFetchTask';
import { IscoolRequestQueue } from '../utils/AsyncTaskQueue';
import { IClassesResponse } from '../interfaces/class';
import { IscoolClassLookup } from '../utils/ClassLookup';
import { IScheduleResponse } from '../interfaces/lesson';

const AMI_ASSAF = 460030;

const queue = new IscoolRequestQueue();
const classes_task = new IscoolFetchTask<IClassesResponse>('classes', AMI_ASSAF, 0);
let numOfClasses = 0;
let classesWithSchedule = 0;

queue.on('sleep', (time) => {
  console.log('Expected delay: %dms', time * queue.size);
});

classes_task.on('success', ({ Classes }) => {
  const classLookup = new IscoolClassLookup(Classes);
  classLookup.forEachClass((id) => {
    const req = new IscoolFetchTask<IScheduleResponse>('schedule', AMI_ASSAF, id);
    numOfClasses++;
    queue.enqueue(req);
    req.on('success', () => {
      console.log('Schedule arrived for class', id);
      classesWithSchedule++;
    });
  });
});
queue.enqueue(classes_task);

const abortedTask = new IscoolFetchTask<IClassesResponse>('classes', AMI_ASSAF, 0);
abortedTask.on('success', () => {
  throw new Error('Task aborted');
});
queue.enqueue(abortedTask);
abortedTask.abort();

describe('Tests the IscoolRequestQueue with schedule of each class', () => {
  jest.setTimeout(40_000);

  it('Executes the queue', async () => {
    await queue.execute();
    expect(numOfClasses).toEqual(classesWithSchedule);
  });
});
