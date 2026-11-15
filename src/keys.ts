import * as Hammer from 'hammerjs';

type KeyPressMap = { [key: number]: boolean };

export const Keys = {
    HYPERSPACE : 32,
    ROTATE_LEFT : 37,
    ROTATE_LEFT_A : 65,
    ROTATE_RIGHT : 39,
    ROTATE_RIGHT_D : 68,
    THRUST : 38,
    THRUST_W : 87,
    FIRE : 17,
    DEBUG : 90,
    PAUSE : 80,
    GOD : 71,
    MONITOR_BURN : 66,
}

export class _Key {

    keys: KeyPressMap = {}; 
    prev: KeyPressMap = {};
    mc: HammerManager;
    private tapQueued = false;
    private tapEdge = false;

    constructor() {
        window.onkeydown = (e) => {
            this.keys[e.keyCode] = true;
        }

        window.onkeyup = (e) => {
            this.keys[e.keyCode] = false;
        }

        const stage = document.getElementById('game');
        if (!stage) {
            throw new Error('Missing #game element');
        }
        this.mc = new Hammer.Manager(stage);
        
        const pan = new Hammer.Pan();
        const tap = new Hammer.Tap({
            interval: 50
        });
        const pinch = new Hammer.Pinch({
            enable: true
        });

        this.mc.add(pan);
        this.mc.add(tap);
        this.mc.add(pinch);

        this.mc.on('panup', (e) => {
            this.thrust(true);
        });

        this.mc.on('panleft', (e) => {
            this.rotateLeft(true);
        });

        this.mc.on('panright', (e) => {
            this.rotateRight(true);
        });

        this.mc.on('panend', (e) => {
            this.thrust(false);
            this.rotateLeft(false);
            this.rotateRight(false);
        });

        this.mc.on('tap', () => {
            this.tapQueued = true;
        });

        this.mc.on('pinchout', (e) => {
            this.hyperspace(true);
        });

        this.mc.on('pinchend', (e) => {
            this.hyperspace(false);
        });

    }

    beginFrame() {
        this.tapEdge = this.tapQueued;
        this.tapQueued = false;
    }

    update() {
        Object.keys(this.keys).forEach(key => {
            const code = Number(key);
            this.prev[code] = this.keys[code];
        });
    }

    isPressed(key: number) {
        return this.prev[key] === false && this.keys[key] === true;
    }

    wasPressed(key: number) {
        return this.prev[key] && !this.keys[key];
    }

    isDown(key: number) {
        return this.keys[key];
    }

    isAnyPressed() {
        return this.tapEdge || this.tapQueued || Object.keys(this.keys).some(key => this.keys[Number(key)]);
    }

    wasAnyPressed() {
        return this.tapEdge || this.tapQueued || Object.keys(this.keys).some(key => this.isPressed(Number(key)));
    }

    isRotateLeft() {
        return this.keys[Keys.ROTATE_LEFT] || this.keys[Keys.ROTATE_LEFT_A];
    }

    isRotateRight() {
        return this.keys[Keys.ROTATE_RIGHT] || this.keys[Keys.ROTATE_RIGHT_D];
    }

    isThrust() {
        return this.keys[Keys.THRUST] || this.keys[Keys.THRUST_W];
    }

    wasFire() {
        return this.isPressed(Keys.FIRE) || this.tapEdge;
    }

    isHyperspace() {
        return this.keys[Keys.HYPERSPACE];
    }

    wasRotateLeft() {
        return this.isPressed(Keys.ROTATE_LEFT) || this.isPressed(Keys.ROTATE_LEFT_A);
    }

    wasRotateRight() {
        return this.isPressed(Keys.ROTATE_RIGHT) || this.isPressed(Keys.ROTATE_RIGHT_D);
    }

    wasHyperspace() {
        return this.isPressed(Keys.HYPERSPACE);
    }

    private rotateLeft = (active: boolean) => {
        this.keys[Keys.ROTATE_LEFT] = active;
        this.keys[Keys.ROTATE_LEFT_A] = active;
    }

    private rotateRight = (active: boolean) => {
        this.keys[Keys.ROTATE_RIGHT] = active;
        this.keys[Keys.ROTATE_RIGHT_D] = active;
    }

    private thrust = (active: boolean) => {
        this.keys[Keys.THRUST] = active;
    }

    private hyperspace = (active: boolean) => {
        this.keys[Keys.HYPERSPACE] = active;
    }
}

export const Key = new _Key();

