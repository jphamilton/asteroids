import { thumpLo, thumpHi } from './sounds';

const MIN = .15;
const BEAT_DECAY_PER_SECOND = 0.0002 * 60;

export class Thumper {
    thumpBeatTimer: number;
    thumpBeat: number;
    lo: boolean = true;

    constructor() {
        this.reset();
    }

    reset() {
        this.thumpBeatTimer = 0;
        this.thumpBeat = 1;
        this.lo = true;
    }

    update(dt: number) {
        this.thumpBeatTimer += dt;
        this.thumpBeat -= BEAT_DECAY_PER_SECOND * dt;

        if (this.thumpBeat <= MIN) {
            this.thumpBeat = MIN;
        }

        if (this.thumpBeatTimer >= this.thumpBeat) {
            if (this.lo) {
                thumpLo.play();
            } else {
                thumpHi.play();
            }

            this.lo = !this.lo;
            this.thumpBeatTimer = 0;
        }

    }
}
