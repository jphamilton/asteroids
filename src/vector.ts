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

    constructor(angleInDegrees: number, velocity: number = 1) {
        this.x = VECTOR[angleInDegrees].x * velocity;
        this.y = VECTOR[angleInDegrees].y * velocity;
    }

    // kludge, bc I got all the way to the last
    // feature of the game and I needed something
    // not in terms of an angle
    static fromXY(p1: Point, p2: Point, velocity: number = 1) {
        let x = p1.x - p2.x;
        let y = p1.y - p2.y;
        const hyp = Math.sqrt(x * x + y * y);
        x /= hyp;
        y /= hyp;
        const v = new Vector(0);
        v.x = x * velocity;
        v.y = y * velocity;
        return v;
    }
}