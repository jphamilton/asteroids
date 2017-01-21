import * as Hammer from 'hammerjs';

const LEN = 222;

export class _Key {

    keys: boolean[];
    prev: boolean[];
    touched: boolean = false;
    mc: any;

    HYPERSPACE = 32; 
    ROTATE_LEFT = 37;
    ROTATE_RIGHT = 39;
    THRUST = 38;
    FIRE = 17;   
    PLAYER_ONE_START = 49;    
    DEBUG = 68;  
    PAUSE = 80;
    GOD = 71;
    MONITOR_BURN = 66;
    
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
        const pinch = new Hammer.Pinch({
            enable: true
        });

        this.mc.add(pan);
        this.mc.add(tap, {
            interval: 50
        });
        this.mc.add(pinch);

        this.mc.on('panup', (e) => {
            this.keys[this.THRUST] = true;
        });

        this.mc.on('panleft', (e) => {
            this.keys[this.ROTATE_LEFT] = true;
        });

        this.mc.on('panright', (e) => {
            this.keys[this.ROTATE_RIGHT] = true;
        });

        this.mc.on('panend', (e) => {
            this.keys[this.THRUST] = false;
            this.keys[this.ROTATE_LEFT] = false;
            this.keys[this.ROTATE_RIGHT] = false;
        });

        this.mc.on('tap', (e) => {
            this.keys[this.FIRE] = true;
            this.keys[this.PLAYER_ONE_START] = true;
            this.touched = true;
        });

        this.mc.on('pinchout', (e) => {
            this.keys[this.HYPERSPACE] = true;
        });

        this.mc.on('pinchend', (e) => {
            this.keys[this.HYPERSPACE] = false;
        });

    }

    update() {
        for (let i = 0; i < LEN; i++) {
            this.prev[i] = this.keys[i];
        }

        if (this.touched) {
            this.keys[this.FIRE] = false;
            this.keys[this.PLAYER_ONE_START] = false;
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

