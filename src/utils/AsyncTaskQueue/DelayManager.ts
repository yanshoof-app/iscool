import { randomBetween } from "../random";

export default class DelayManager {
    static DELAYS = [100, 200, 500, 1000, 2000, 5000] as const;
    private static _instance = new DelayManager();

    static reset() {
        this._instance = new DelayManager();
    }

    static get currentDelay() {
        return this.DELAYS[this._instance.getDelayIndex()];
    }

    static get currentRandomizedDelay() {
        return randomBetween(1, this.currentDelay);
    }

    private delayIndex;

    constructor() {
        this.delayIndex = 0;
    }

    private getDelayIndex() {
        if (this.delayIndex >= DelayManager.DELAYS.length-1)
            return this.delayIndex;
        return this.delayIndex++;
    }

}