import screen from './screen';
import { SIN, COS } from './lut';
import { Object2D } from './object2d';

const BulletSpeed = 10;

export class Bullet extends Object2D { 

    life: number = 1.25;   // in seconds
    visible: boolean = true;

    constructor(public ship: Object2D) {
        super(ship.x, ship.y);

        let angle = ship.angle;
        this.vx = SIN[angle];
        this.vy = -COS[angle];

        // move bullet to nose of ship
        this.x += this.vx * 20;
        this.y += this.vy * 20;

        // adjust for speed of ship if bullets and ship are moving in same general direction
        let speed = 0; 
        let dot = (ship.vx * this.vx) + (ship.vy * this.vy);
        
        if (dot > 0) {
            speed = ship.speed;
        }

        this.vx *= (BulletSpeed + speed);
        this.vy *= (BulletSpeed + speed);

    }

    get geometry() {
        return [{ x: this.x, y: this.y }];
    }

    render() {
        if (this.visible) {
            screen.draw.point({x: this.x, y: this.y});
        }
    }

    update(step?: number) {
        this.move();

        this.life -= step;

        if (this.life <= 0) {
            this.visible = false;
        }
    }

    get speed() {
        return Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));
    }
}