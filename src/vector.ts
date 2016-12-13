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
}