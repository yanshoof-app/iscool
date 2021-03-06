# @yanshoof/iscool

Types and API Wrapper for the iscool API

## Why this package

Applying the separation of concerns principle, we decided to migrate all iscool-related utilities to a package that can also be used by others.

## Usage

### Requirements

- Node.js
- The `BASE_URL` environment variable, pointing to the iscool server URL.
- The `TOKEN` environment variable, required for authorization by the iscool servers.

### Installation

```bash
npm i @yanshoof/iscool
```

### Using The Package

**Querying Schools**

Query schools with the following method:

```ts
const schools = await fetchSchoolsWithQuery(query);
```

Convert schools to standard types with the command:

```ts
const school = ISCOOL.toSchoolLookupResult(schools[0]);
```

**Querying Classes**

Query classes with the static method of the library utility:

```ts
const { grades, classes } = await IscoolClassLookup.fromSchool(school);
```

You can execute a callback for each class with the method

```ts
classLookup.forEachClass((id) => {...});
```

**Querying Lessons and Changes**

Query lessons and changes with the standard `fetchDataSource` method:

```ts
const { Schedule } = await fetchDataSource<IScheduleResponse>('schedule', school, classId);
const { Changes } = await fetchDataSource<IChangesResponse>('changes', school, classId);
```

Retrieve change date by calling:

```ts
const date = new IscoolDate(change.Date);
date.day; // day of week
```

Filter changes by relevancy by calling:

```ts
const relevantChanges = IscoolDate.relevantDatesOnly(changes, relevantFrom, relevantUntil);
```

**Queueing Requests** _New!!_

You can now use the brand new `IscoolRequestQueue` and `IscoolFetchTask` classes to enqueue requests and fetch them seamlessly, regardless of delays and blocks from the iscool server.

Create a request and subscribe to events just as you would invoke a normal `fetchDataSource` call:

```ts
const scheduleReq = new IscoolFetchTask<IScheduleResponse>('schedule', school, classId);

scheduleReq.on('success', ({ Schedule }) => {
  // do something
});

scheduleReq.on('error', (err) => {
  // do something
});
```

Create a queue:

```ts
const queue = new IscoolRequestQueue();

// fires when iscool servers delay the request
queue.on('sleep', (time) => {
  console.log('Expected delay: %dms', time * queue.size);
});
```

Enqueue a task with the commands:

```ts
queue.enqueue(scheduleReq);
```

Execute all tasks (if not executing on another thread):

```ts
await queue.execute();
```

## Library

### Types

**ISCOOL module**

With the `ISCOOL` wrapper class, you can convert Iscool types to `@yanshoof/types` types.

- ~~`toDate(date: string)`~~ converts iscool date strings to dates
- `toClassroom(Te: string, Room: string)` converts class nameand teaching type to zoom / async / name of class
- `toStudyGroup(ob: IStudyGroupIscool | undefined | string)` converts an iscool study group to our own
- `toModification(change?: IChangeIscool)` extracts a modification out of an iscool change
- `toLesson(lesson: ILessonIscool)` converts iscool lessons to our own
- `toTeacherLesson(lesson: ILessonIscool)` converts iscool lessons to our teacher lessons
- `toSchoolLookupResult(res: ISchoolSearchResultIscool)` converts an Iscool search result to an ISchoolLookupResult format
- `toChange(change: IChangeIscool)` converts changes of iscool to our own
- ~~`toEvent(event: IChangeIscool)`~~ converts an Iscool event object to ours

**Class Types**

- `interface IClassIscool` represents a class given by iscool
- `function isIscoolClass` is a type guard for the above
- `interface IClassesResponse` represents a response given by iscool

**School Types**

- `interface ISchoolSearchResultIscool` represents a school lookup array member
- `interface ISchoolSearchRepsonse` represents the school search result from iscool

**Lesson and Change Types**

- `interface IStudyGroupIscool` represents study groups as sent by the iscool servers
- `interface ILessonIscool extends IStudyGroupIscool` represents lessons as sent by the iscool servers
- `interface ILessonArrMemberIscool` represents multiple lessons taking place at the same time, along with the day and hour of the timetable they take place in.
- `interface IWithDate` represents objects with an iscool date
- `interface IChangeIscool extends IWithDate` represents changes as sent by Iscool
- `interface IChangesResponse` represents a response of changes sent by iscool
- `interface IScheduleResponse` represents a response of schedule sent by iscool

### Fetch Schedule, Changes and Classes

**buildFetchUrl**

Builds the fetch URL

```ts
function buildFetchUrl(
  fetchFor: 'schedule' | 'changes' | 'classes', // the purpose of the fetchs
  schoolId: string | number, // the id of the school whose the data is requested for
  classId: string | number = '0', // the id of the class whose data is requested for, defaults to 0
);
```

**fetchDataSource**

Fetches the iscool API using axios. Works in both server-side and client-side.

```ts
async function fetchDataSource(...args: Parameters<typeof buildFetchUrl>);
```

**Note**: When using, it is highly recommended to wrap with a try-catch, since it will throw an `HTTPError`

### Querying Schools

Since school searching has a different URL pattern, it has a different function to fetch for it:

```ts
async function fetchSchoolsWithQuery(
  query: string | number, // the query to send to the server
);
```

### Iscool Dates

Create a new date with the command:

```ts
const date = new IscoolDate(dateStr);
```

Available methods:

- `get day(): DayOfWeek` returns the day of week of the date
- `get time(): number` applies date.getTime() to the date
- `isBefore(Date): boolean` and `isAfter(Date): boolean` compares with other dates

It is also available to create a date within a rage, such that:

```ts
const date = new IscoolDate(dateStr, relevantFrom, relevantUntil);
date.day; // throws IrrelevantDateException if not in range
date.isRelevant; // false
```

- `static relevantDatesOnly(IWithDate[], Date, Date)` filters objects with an iscool date by relevancy

### Iscool Class Lookups

Create a new Class Lookup with the command:

```ts
const classLookup = new IscoolClassLookup(classes);
```

Available methods:

- `get classIds(): number[][]` returns the class id matrix
- `get grades(): number` returns the grade array

You can also query directly from a school using the command:

```ts
const { classes, grades } = await IscoolClassLookup.fromSchool(school);
```

### The Request Queue Library _New!!_

The request queue library helps query multiple requests at once without worrying about the iscool servers blocking us.

Create a new queue with the command:

```ts
const queue = new IscoolRequestQueue();
```

Available methods:

- `enqueue(IscoolFetchTask)` enqueues the task. Can throw an `IscoolServerError` if servers are too busy
- `async execute()` executes all requests in the queue, if not executing on another thread.

Available events:

- `sleep` executes before sleeping with the `time: number` params

Create a new fetch task with the command:

```ts
const req = new IscoolFetchTask(...args: Parameters<typeof buildFetchUrl>)
```

Available methods:

- `abort()` makes sure the task will not execute when its time comes
- `get isAborted()` returns whether or not the task is aborted
- `get isSuccessful()` returns whether or not the task has been completed

Available events:

- The `'error'` event fires on unexpected (non-delay) error with the error object
- The `'success'` event fires on task completion with the `res` return type specified
