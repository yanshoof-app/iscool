import DelayManager from '../utils/AsyncTaskQueue/DelayManager';

describe('Tests the delay manager object', () => {
  it('Fetches initial delay', async () => {
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[0]);
    DelayManager.increaseDelay();
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[1]);
    DelayManager.increaseDelay();
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[2]);
    DelayManager.increaseDelay();
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[3]);
    DelayManager.increaseDelay();
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[4]);
    DelayManager.increaseDelay();
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[5]);
    DelayManager.increaseDelay();
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[6]);
    DelayManager.increaseDelay();
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[7]);
    DelayManager.increaseDelay();
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[7]);
    DelayManager.reset();
    expect(DelayManager.currentDelay).toEqual(DelayManager.DELAYS[0]);
  });
});
