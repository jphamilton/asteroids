import screen from './screen';
import { Key } from './keys';
import { Object2D } from './object2d';
import { Vector } from './vector';
import { Bullet } from './bullet';
import { fire, thrust } from './sounds';
import { random } from './util';

const ACCELERATION: number = 0.1;
const BULLET_SPEED: number = 1000 * screen.objectScale;
const BULLET_TIME: number = .02;
const FRICTION: number = 0.005;
const ROTATION: number = 5;
const MAX_ACCELERATION: number = 1100 * screen.objectScale;
const MAX_BULLETS: number = 10;
const VELOCITY = 150 * screen.objectScale;

class Flame extends Object2D {

    constructor(x: number, y: number) {
        super(x, y);

        this.points = [
            {x: 5, y: 8},
            {x: 0, y: 20},
            {x: -5, y: 8},
        ];
    }

    update() {

    }

    render() {
        this.draw(false);
    }
}

export class Ship extends Object2D {

    private moving: boolean = false;
    private bulletCount: number = 0;
    private bulletTimer: number = 0;
    private flame: Flame;
    public shield: number = 2;

    constructor(x: number, y: number) {
        super(x, y);
        this.flame = new Flame(x, y);
        this.points = [
            {x: 0, y: -15},
            {x: 10, y: 10},
            {x: 5, y: 5},
            {x: -5, y: 5},
            {x: -10, y: 10}
        ];

        this.angle = 270;
    }

    get pointInPolyCheck() {
        return true;
    }
    
    render() {
        this.draw();
        if (this.moving && (Math.floor(Math.random() * 10) + 1) % 2 === 0) {
            this.flame.draw(false);
        }
    }

    update(dt: number) {
        this.move(dt);
        this.flame.move(dt);

        if (Key.isDown(Key.THRUST)) {
            this.moving = true;
            this.thrust();
        } else {
            this.moving = false;
        }

        if (Key.isPressed(Key.ROTATE_LEFT)) {
            this.rotate(-1);
        }

        if (Key.isDown(Key.ROTATE_LEFT)) {
            this.rotate(-ROTATION);
        }

        if (Key.isPressed(Key.ROTATE_RIGHT)) {
            this.rotate(1);
        }

        if (Key.isDown(Key.ROTATE_RIGHT)) {
            this.rotate(ROTATION);
        }

        if (Key.isDown(Key.FIRE)) {
            this.fire();
        }

        if (Key.isPressed(Key.HYPERSPACE)) {
            this.hyperspace(); 
        }

        if (this.bulletTimer >= 0) {
            this.bulletTimer -= dt;
        }

        // slow down ship over time
        if (!this.moving) {
            this.vx -= this.vx * FRICTION;
            this.vy -= this.vy * FRICTION;
            this.flame.vx = this.vx;
            this.flame.vy = this.vy;
        }
    }

    rotate(n: number) {
        super.rotate(n);
        this.flame.rotate(n);
    }

    private thrust() {
        const v = new Vector(this.angle, VELOCITY * ACCELERATION);
        const velocity = this.magnitude;

        if (velocity < MAX_ACCELERATION) {
            this.vx += v.x;
            this.flame.vx = this.vx;
            this.vy += v.y;
            this.flame.vy = this.vy;
        }

        thrust.play();
    }

    private fire() {
        if (this.bulletTimer <= 0 && this.bulletCount < MAX_BULLETS) {
            
            fire.play();

            this.bulletTimer = BULLET_TIME;
            this.bulletCount++;

            const v = new Vector(this.angle);
            const bullet = new Bullet(this.origin.x, this.origin.y, v, 1);

            bullet.on('expired', () => {
                this.bulletCount--;
            });

            // move bullet to nose of ship
            bullet.origin.x += bullet.vx * 20;
            bullet.origin.y += bullet.vy * 20;
            
            // adjust for speed of ship if bullets and ship are moving in same general direction
            let speed = 0; 
            const dot = (this.vx * bullet.vx) + (this.vy * bullet.vy);
            
            if (dot > 0) {
                speed = this.magnitude;
            }

            speed = Math.max(BULLET_SPEED, speed + BULLET_SPEED);

            bullet.vx *= speed;
            bullet.vy *= speed;

            // kick back
            let kba = (this.angle + 180) % 360;
            let kbv = new Vector(kba, 3);
            this.origin.x += kbv.x;
            this.origin.y += kbv.y;
            this.flame.origin.x += kbv.x;
            this.flame.origin.y += kbv.y;
            
            this.trigger('fire', bullet);
        }
    }

    hyperspace() {
        let x = random(40, screen.width - 40);
        let y = random(40, screen.height - 40);
        
        this.vx = 0;
        this.vy = 0;

        this.x = this.flame.x = x;
        this.y = this.flame.y = y;

        this.flame.vx = 0;
        this.flame.vy = 0;
    }

    destroy() {
        this.trigger('expired');
    }
}