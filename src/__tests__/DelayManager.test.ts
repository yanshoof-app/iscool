import DelayManager from '../utils/AsyncTaskQueue/DelayManager';

describe('Tests the delay manager object', () => {
  it('Fetches initial delay', async () => {
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[0]);
  });
});
