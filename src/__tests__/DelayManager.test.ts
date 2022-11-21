import DelayManager from '../utils/AsyncTaskQueue/DelayManager';

describe('Tests the delay manager object', () => {
  it('Fetches initial delay', async () => {
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[0]);
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[1]);
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[2]);
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[3]);
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[4]);
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[5]);
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[5]);
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[5]);
    DelayManager.reset();
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[0]);
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[1]);
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[2]);
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[3]);
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[4]);
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[5]);
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[5]);
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[5]);
  });
});
