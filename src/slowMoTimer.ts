import { EventSource } from "./events";

export class SlowMoTimer extends EventSource {

    constructor(private time: number, private factor: number) {
        super();
    }

    public adjust(dt: number): number {
        const result = dt / this.factor;
        this.time -= result;

        if (this.time <= 0) {
            this.trigger('expired');
        }

        return result;
    }
}