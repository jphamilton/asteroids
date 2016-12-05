import { COS, SIN } from './lut';

export abstract class Object2D implements IObject2D {

    color: string;
    angle: number = 360; 
    x: number;
    y: number;
    vx: number = 0;
    vy: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    abstract update(step: number) : void;
    abstract render(step: number) : void;
    abstract get geometry(): Point[];

    rotate(angle: number) {
        this.angle += angle;
        
        if (this.angle < 1) {
            this.angle += 360;
        }

        if (this.angle > 360) {
            this.angle -= 360;
        }

        let c = COS[angle]
        let s = SIN[angle];

        let points = this.geometry;

        points.forEach(p => {
            let newX = (c * p.x) - (s * p.y);
            let newY = (s * p.x) + (c * p.y);
            p.x = newX;
            p.y = newY;
        });

    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    
        if (this.x > screen.width) {
            this.x -= screen.width;
        }

        if (this.x < 0) {
            this.x += screen.width;
        }

        if (this.y > screen.height) {
            this.y -= screen.height;
        }

        if (this.y < 0) {
            this.y += screen.height;
        }
    }
    
    scale(factor: number) {
        let points: Point[] = this.geometry;
        points.forEach(point => {
            point.x *= factor;
            point.y *= factor;
        });
    }

    get speed() {
        return Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));
    }
}