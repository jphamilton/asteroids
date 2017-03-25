const VECTOR = {};
const PI2 = 2 * Math.PI;

for(let i = 0; i <= 360; i++) {
    const t = PI2 * (i / 360);
    
    VECTOR[i] = {
        x: Math.cos(t),
        y: Math.sin(t)
    }
}

export class Vector {

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static fromAngle(angleInDegrees: number, velocity: number = 1): Vector {
        const x = VECTOR[angleInDegrees].x * velocity;
        const y = VECTOR[angleInDegrees].y * velocity;
        return new Vector(x, y);
    }

    static fromXY(p1: Point, p2: Point, velocity: number = 1): Vector {
        let x = p1.x - p2.x;
        let y = p1.y - p2.y;
        const hyp = Math.sqrt(x * x + y * y);
        x /= hyp;
        y /= hyp;
        return new Vector(x * velocity, y * velocity);
    }

    add(v: Vector) {
        this.x += v.x;
        this.y += v.y;
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    dot(v: Vector) {
        return (this.x * v.x) + (this.y * v.y);
    }

    friction(amount: number) {
        this.x -= this.x * amount;
        this.y -= this.y * amount;
    }

    scale(xscale: number, yscale: number) {
        this.x *= xscale;
        this.y *= yscale;
    }

    get magnitude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    
}