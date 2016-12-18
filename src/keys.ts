import * as Hammer from 'hammerjs';

console.log('HAMMER', Hammer);

const LEN = 222;

export class _Key {

    keys: boolean[];
    prev: boolean[];
    touched: boolean = false;

    mc: any;

    SPACE = 32; // hyperspace
    LEFT = 37;
    UP = 38;
    RIGHT = 39;
    SHIFT = 16;  // special weapon?
    CTRL = 17;   // fire
    ONE = 49;    // 1 player start
    DEBUG = 68;  // toggle debug mode
    PAUSE = 80;

    constructor() {
        this.keys = new Array(LEN);
        this.prev = new Array(LEN);

        for (let i = 0; i < LEN; i++) {
            this.keys[i] = this.prev[i] = false;
        }

        window.onkeydown = (event) => {
            this.keys[event.keyCode] = true;
        }

        window.onkeyup = (event) => {
            this.keys[event.keyCode] = false;
        }

        const stage = document.getElementById('game');
        this.mc = new Hammer.Manager(stage);
        
        const pan = new Hammer.Pan();
        const tap = new Hammer.Tap();
        const pinch = new Hammer.Pinch();

        this.mc.add(pan);
        this.mc.add(tap, {
            interval: 50
        });

        this.mc.on('panup', (e) => {
            this.keys[this.UP] = true;
        });

        this.mc.on('panleft', (e) => {
            this.keys[this.LEFT] = true;
        });

        this.mc.on('panright', (e) => {
            this.keys[this.RIGHT] = true;
        });

        this.mc.on('panend', (e) => {
            this.keys[this.UP] = false;
            this.keys[this.LEFT] = false;
            this.keys[this.RIGHT] = false;
        });

        this.mc.on('tap', (e) => {
            this.keys[this.CTRL] = true;
            this.keys[this.ONE] = true;
            this.touched = true;
        });

        this.mc.on('pinchin', (e) => {
            this.keys[this.SPACE] = true;
        });

        this.mc.on('pinchend', (e) => {
            this.keys[this.SPACE] = false;
        });
    }

    update() {
        for (let i = 0; i < LEN; i++) {
            this.prev[i] = this.keys[i];
        }

        if (this.touched) {
            this.keys[this.CTRL] = false;
            this.keys[this.ONE] = false;
        }

        this.touched = !this.touched;
    }

    isPressed(key) {
        return this.prev[key] === false && this.keys[key] === true;
    }

    wasPressed(key) {
        return this.prev[key] && !this.keys[key];
    }

    isDown(key) {
        return this.keys[key];
    }
}

export const Key = new _Key();

