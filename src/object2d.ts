import { COS, SIN } from './lut';
import screen from './screen';

export abstract class Object2D implements IObject2D {

    points: Point[];
    color: string = 'rgba(255,255,255,.8)'; //'#ffffff';
    angle: number = 360; 
    x: number;
    y: number;
    vx: number = 0;
    vy: number = 0;

    protected handlers: { [event: string]: ((...args: any[])=> void)[]} = {};
    
    abstract update(step?: number) : void;
    abstract render(step?: number) : void;
    
    constructor(x: number, y: number, ...args: any[]) {
        this.x = x;
        this.y = y;
        // calc bounds and shit
    }

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

        this.points.forEach(p => {
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
        this.points.forEach(point => {
            point.x *= factor;
            point.y *= factor;
        });
    }

    draw() {
        screen.draw.shape(this.points, this.x, this.y, this.color);
    }

    get speed() {
        return Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));
    }

    get rect(): Rect {
        let xmin = 0;
        let ymin = 0;
        let xmax = 0;
        let ymax = 0;

        this.points.forEach(p => {
            if (p.x < xmin) xmin = p.x;
            if (p.x > xmax) xmax = p.x;
            if (p.y < ymin) ymin = p.y;
            if (p.y > ymax) ymax = p.y;
        });

        return {
            x: xmin,
            y: ymin,
            width: xmax - xmin,
            height: ymax - ymin 
        };

    }

    on(event: string, handler: (...args: any[]) => void) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(handler); 
    }

    off(event: string, handler: (...args: any[]) => void) {
        this.handlers[event] = this.handlers[event].filter(x => x !== handler); 
    }

    trigger(event: string, ...args: any[] ) {
        let handlers = this.handlers[event] || [];
        handlers.forEach(x => x(this, ...args));
    }

    destroy() {
        for(let event in this.handlers) {
            this.handlers[event] = null;
        }
        this.handlers = {};
    }
}