const LEN = 222;

export class _Key {

    keys: boolean[];
    prev: boolean[];

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

    }

    update() {
        for (let i = 0; i < LEN; i++) {
            this.prev[i] = this.keys[i];
        }
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

