import { thumpLo, thumpHi } from './sounds';

const DEC = .2;

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

        if (this.thumpBeatTimer >= this.thumpBeat) {
            if (this.lo) {
                thumpLo.play();
            } else {
                thumpHi.play();
            }

            this.lo = !this.lo;
            this.thumpBeatTimer = 0;
        }

        if (!this.max && this.thumpTimer >= this.thumpTime) {
            this.thumpBeat -= DEC;
            
            if (this.thumpBeat <= DEC) {
                this.thumpBeat = DEC;
                this.max = true;
            }
            
            this.thumpTimer = 0;
        }
    }    
}
