import { thumpLo, thumpHi } from './sounds';

const MIN = .15;
const MAX_VOL = 1;

export class Thumper {
    thumpBeatTimer: number;
    thumpBeat: number;
    thumpTimer: number;
    thumpTime: number;
    lo: boolean = true;
    max: boolean;

    constructor() {
        this.reset();
    }

    reset() {
        this.thumpBeatTimer = 0;
        this.thumpBeat = 1;
        this.thumpTimer = 0;
        this.thumpTime = 10;
        this.max = false;
    }

    update(dt: number) {
        this.thumpTimer += dt;
        this.thumpBeatTimer += dt;
        this.thumpBeat -= .0002;

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
