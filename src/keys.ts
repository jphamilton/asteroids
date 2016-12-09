export class _Key {

    keys: boolean[];
    prev: boolean[];

    LEFT = 37;
    UP= 38;
    RIGHT= 39;
    SHIFT= 16;  // special weapon / hyperspace
    CTRL= 17;   // fire
    ONE= 49;    // 1 player start
    DEBUG= 68;  // toggle debug mode

    constructor() {
        this.keys = new Array(222);
        this.prev = new Array(222);

        for (let i = 0; i < 222; i++) {
            this.keys[i] = this.prev[i] = false;
        }

        window.onkeydown = (event) => {
            event.preventDefault();
            this.keys[event.keyCode] = true;
        }

        window.onkeyup = (event) => {
            event.preventDefault();
            this.keys[event.keyCode] = false;
        }

    }

    update() {
        for (let i = 0; i < 222; i++) {
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

// export class _Key {
//     private _down: { [keyCode: number]: boolean } = {};

//     LEFT = 37;
//     UP = 38;
//     RIGHT = 39;
//     SHIFT = 16;  // special weapon / hyperspace
//     CTRL = 17;   // fire
//     ONE = 49;    // 1 player start
//     DEBUG = 68;  // toggle debug mode

//     constructor() {
//         window.addEventListener('keydown', (event) => this.onKeydown(event), false);
//         window.addEventListener('keyup', (event) => this.onKeyup(event), false);
//     }

//     isDown(keyCode) {
//         return this._down[keyCode];
//     }

//     onPressed(keyCode) {

//     }

//     private onKeydown(event) {
//         event.preventDefault();
//         this._down[event.keyCode] = true;
//     }

//     private onKeyup(event) {
//         event.preventDefault();
//         delete this._down[event.keyCode];
//     }


// };


// export const Key = new _Key();
