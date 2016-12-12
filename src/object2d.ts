import { EventSource } from './events';
import { COS, SIN } from './lut';
import screen from './screen';

export abstract class Object2D extends EventSource implements Rect {

    color: string = 'rgba(255,255,255,.9)'; 
    angle: number = 360; 
    vx: number = 0;
    vy: number = 0;
    origin: Point;
    
    private _xmin: number = 0;
    private _xmax: number = 0;
    private _ymin: number = 0;
    private _ymax: number = 0;
    private _width: number = 0;
    private _height: number = 0;
    private _points: Point[];

    abstract update(step?: number) : void;
    abstract render(step?: number) : void;
    
    constructor(x: number, y: number) {
        super();
        this.origin = { x: x, y: y};
    }

    set points(points: Point[]) {
        this._points = points;
        this.calcBounds();
    }

    get points(): Point[] {
        return this._points;
    }

    private calcBounds() {
        this._points.forEach(p => {
            if (p.x < this._xmin) this._xmin = p.x;
            if (p.x > this._xmax) this._xmax = p.x;
            if (p.y < this._ymin) this._ymin = p.y;
            if (p.y > this._ymax) this._ymax = p.y;
        });
        this._width = this._xmax - this._xmin
        this._height = this._ymax - this._ymin; 
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

        this.calcBounds();
    }

    move(dt?: number) {
        dt = dt ? dt : 1;

        this.origin.x += this.vx * dt;
        this.origin.y += this.vy * dt;
        
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
    }
    
    scale(factor: number) {
        this.points.forEach(point => {
            point.x *= factor;
            point.y *= factor;
        });
        this.calcBounds();
    }

    draw() {
        screen.draw.shape(this.points, this.origin.x, this.origin.y, this.color);
    }

    get magnitude() {
        return Math.sqrt((this.vx * this.vx) + (this.vy * this.vy));
    }

    get x(): number {
        return this.origin.x + this._xmin;
    }

    get y(): number {
        return this.origin.y + this._ymin;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }
    
    collided(rect2: Rect) {
        if (rect2 && this.x < rect2.x + rect2.width &&
            this.x + this.width > rect2.x &&
            this.y < rect2.y + rect2.height &&
            this.height + this.y > rect2.y) {
            return true;
        }
        return false;
    }

    destroy() {
        for(let event in this.handlers) {
            this.handlers[event] = null;
        }
        this.handlers = {};
    }
}