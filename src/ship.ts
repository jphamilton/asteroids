import { Key } from './keys';
import screen from './screen';
import { Object2D } from './object2d';
import { Bullet } from './bullet';

const ACCELERATION: number = 0.2;
const FRICTION: number = 0.007;
const ROTATION: number = 5;
const MAX_SPEED: number = 15;
const MAX_BULLETS: number = 4;

export class Ship extends Object2D {

    private points: Point[];
    private flame: Point[];
    private moving: boolean = false;
    private bulletTimer: number = 0;
    private bulletCount: number = 0;

    onFire: (bullet: Bullet) => void;
    
    constructor(x: number, y: number) {
        super(x, y);

        this.angle = 360;
        this.color = 'rgba(255,255,255,.8)';

        this.points = [
            {x: 0, y: -15},
            {x: 10, y: 10},
            {x: 5, y: 5},
            {x: -5, y: 5},
            {x: -10, y: 10},
            {x: 0, y: -15}
        ];

        this.flame = [
            {x: 5, y: 8},
            {x: 0, y: 20},
            {x: -5, y: 8},
        ];

    }

    get geometry() {
        return [...this.points, ...this.flame];
    }

    render() {
        screen.draw.shape(this.points, this.x, this.y, this.color);
        if (this.moving && (Math.floor(Math.random() * 10) + 1) % 2 === 0) {
            screen.draw.shape(this.flame, this.x, this.y, this.color);
        }
    }

    update(step: number) {
        this.move();

        if (Key.isDown(Key.UP)) {
            this.moving = true;
            this.thrust();
        } else {
            this.moving = false;
        }

        if (Key.isDown(Key.LEFT)) {
            this.rotate(-ROTATION);
        }

        if (Key.isDown(Key.RIGHT)) {
            this.rotate(ROTATION);
        }

        // can only fire bullets so fast
        if (this.bulletTimer > 0) {
            this.bulletTimer -= step;
        }

        if (Key.isDown(Key.CTRL)) {
            if (this.bulletTimer <= 0) {
                this.bulletTimer = .3;
                this.fire();
            }
        }

        // slow down ship over time
        this.vx -= this.vx * FRICTION;
        this.vy -= this.vy * FRICTION;
    }

    private thrust() {
        let t = 2 * Math.PI * (this.angle / 360);
        let x = Math.sin(t);
        let y = Math.cos(t);
        
        if (this.vx >= -MAX_SPEED && this.vx <= MAX_SPEED) {
            this.vx += x * ACCELERATION;
        }

        if (this.vy >= -MAX_SPEED && this.vy <= MAX_SPEED) {
            this.vy -= y * ACCELERATION;
        }
    }

    private fire() {
        if (this.bulletCount <= MAX_BULLETS) {
            let bullet = new Bullet(this.x, this.y, this.angle);

            // move bullet to nose of ship
            bullet.x += bullet.vx * 20;
            bullet.y += bullet.vy * 20;
            
            // adjust for speed of ship if bullets and ship are moving in same general direction
             let speed = 0; 
             let dot = (this.vx * bullet.vx) + (this.vy * bullet.vy);
            
            if (dot > 0) {
                speed = this.speed;
            }

            bullet.vx *= (10 + speed);
            bullet.vy *= (10 + speed);
            
            this.onFire(bullet);
        }
    }
}