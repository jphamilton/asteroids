import screen from './screen';
import { EventSource } from './events';
import { COS, SIN } from './lut';
import { Vector } from './vector';

export abstract class Object2D extends EventSource implements Rect, IGameState {

    angle: number = 360; 
    velocity: Vector = new Vector(0, 0);
    origin: Vector;
    
    private _xmin: number = 0;
    private _xmax: number = 0;
    private _ymin: number = 0;
    private _ymax: number = 0;
    private _width: number = 0;
    private _height: number = 0;
    private _points: Point[];
    protected _score: number = 0;

    abstract update(dt?: number) : void;
    abstract render(dt?: number) : void;
    
    get score(): number {
        return this._score;
    }

    set score(value: number) {
        this._score = value;
    }

    constructor(x: number, y: number) {
        super();
        this.origin = new Vector(x, y);
    }

    set points(points: Point[]) {
        points.forEach(p => {
            p.x *= screen.objectScale;
            p.y *= screen.objectScale;
        })
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

        const c = COS[angle]
        const s = SIN[angle];

        this.points.forEach(p => {
            const newX = (c * p.x) - (s * p.y);
            const newY = (s * p.x) + (c * p.y);
            p.x = newX;
            p.y = newY;
        });

        this.calcBounds();
    }

    move(dt?: number) {
        dt = dt ? dt : 1;

        this.origin.x += this.velocity.x * dt;
        this.origin.y += this.velocity.y * dt;
        
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

    draw(closed: boolean = true, color = 'rgba(255,255,255,.8)') {
        screen.draw.vectorShape(this.points, this.origin.x, this.origin.y, color, closed);
    }

    get x(): number {
        return this.origin.x + this._xmin;
    }

    set x(x: number) {
        this.origin.x = x; 
    }

    get y(): number {
        return this.origin.y + this._ymin;
    }

    set y(y: number) {
        this.origin.y = y;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }
    
    get vertices(): Point[] {
        return this.points.map(p => {
            return {
                x: this.origin.x + p.x,
                y: this.origin.y + p.y
            }
        });
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