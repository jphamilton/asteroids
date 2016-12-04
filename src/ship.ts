import { Key } from './keys';
import { RAD, COS, SIN } from './lut';
import screen from './screen';

const ACCELERATION: number = 0.2;
const FRICTION: number = 0.007;
const ROTATION: number = 5;

export class Ship implements Polygon {

    color: string;
    points: Point[];
    flame: Point[];

    angle: number = 0; 
    vx: number = 0;
    vy: number = 0;
    
    private moving: boolean = false;

    constructor(public origin: Point) {
        //this.color = 'rgba(255,255,255,.6)';
        this.color = '#ffffff';

        this.points = [
            {x: 0, y: -15},
            {x: 10, y: 10},
            {x: 5, y: 5},
            {x: -5, y: 5},
            {x: -10, y: 10}
        ];

        this.flame = [
            {x: 5, y: 8},
            {x: 0, y: 20},
            {x: -5, y: 8},
        ];
    }

    draw() {
        screen.draw.shape(this.origin, this.points, this.color, true);
        if (this.moving && (Math.floor(Math.random() * 10) + 1) % 2 === 0) {
            screen.draw.shape(this.origin, this.flame, this.color, false);
        }
    }

    update() {
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

        this.vx -= this.vx * FRICTION;
        this.vy -= this.vy * FRICTION;
        
        if (Key.isDown(Key.UP)) {
            this.moving = true;
            this.move();
        } else {
            this.moving = false;
        }

        if (Key.isDown(Key.LEFT)) {
            this.rotate(-ROTATION);
        }

        if (Key.isDown(Key.RIGHT)) {
            this.rotate(ROTATION);
        }

        if (Key.isDown(Key.CTRL)) {
            // fire
        }

        if (Key.isDown(Key.SHIFT)) {
            // hyperspace
        }

       
    }

    private rotate(angle: number) {
        let c = COS[angle]
        let s = SIN[angle];

        let points = [...this.points, ...this.flame];

        points.forEach(p => {
            let newX = (c * p.x) - (s * p.y);
            let newY = (s * p.x) + (c * p.y);
            p.x = newX;
            p.y = newY;
        });

        this.angle += angle;
        
        if (this.angle < 0) {
            this.angle += 360;
        }

        if (this.angle > 360) {
            this.angle -= 360;
        }
    
    }

    private move() {
        let t = 2 * Math.PI * (this.angle / 360);
        let x = Math.sin(t);
        let y = Math.cos(t);
        this.vx += x * ACCELERATION;
        this.vy -= y * ACCELERATION;
    }

    
}