import { randomBetween } from "../random";

export default class DelayManager {
    static DELAYS = [0, 50, 100, 200, 500, 1000, 2000, 5000] as const;
    private static _instance = new DelayManager();

    static reset() {
        this._instance = new DelayManager();
    }

    static get currentDelay() {
        return this.DELAYS[this._instance.delayIndex];
    }

    static get currentRandomizedDelay() {
        return randomBetween(1, this.currentDelay) + this.currentDelay;
    }

    static increaseDelay() {
        this._instance.increaseDelay();
    }

    static decreaseDelay() {
        this._instance.decreaseDelay();
    }

    private delayIndex;

    constructor() {
        this.delayIndex = 0;
    }

    private increaseDelay() {
        if (this.delayIndex >= DelayManager.DELAYS.length-1)
            return this.delayIndex;
        return this.delayIndex++;
    }

    private decreaseDelay() {
        if (this.delayIndex <= 0)
            return this.delayIndex;
        return this.delayIndex--;
    }

}