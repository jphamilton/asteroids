import screen from './screen';
import { SIN, COS } from './lut';

const BulletSpeed = 8;

export class Bullet {

    origin: Point;
    vx: number;
    vy: number;
    life: number = 1.5;   // in seconds
    visible: boolean = true;

    constructor(public ship: Polygon) {
        let angle = ship.angle;
        this.vx = SIN[angle];
        this.vy = -COS[angle];

        // set bullet to origin of ship
        this.origin = {
            x: ship.origin.x,
            y: ship.origin.y
        }
        
        // move bullet to nose of ship
        this.origin.x += this.vx * 20;
        this.origin.y += this.vy * 20;

        // adjust for speed of ship if bullets and ship are moving in same general direction
        let speed = 0; 
        let dot = (ship.vx * this.vx) + (ship.vy * this.vy);
        
        if (dot > 0) {
            speed = ship.speed;
        }

        this.vx *= (BulletSpeed + speed);
        this.vy *= (BulletSpeed + speed);

    }

    draw() {
        if (this.visible) {
            screen.draw.point(this.origin);
        }
    }

    update(step?: number) {
        this.origin.x += this.vx;
        this.origin.y += this.vy;
    
        if (this.origin.x > screen.width) {
            this.origin.x -= screen.width;
        }

        if (this.origin.x < 0) {
            this.origin.x += screen.width;
        }

        if (this.origin.y > screen.height) {
            this.origin.y -= screen.height;
        }

        if (this.origin.y < 0) {
            this.origin.y += screen.height;
        }

        this.life -= step;

        if (this.life <= 0) {
            this.visible = false;
        }
    }

}