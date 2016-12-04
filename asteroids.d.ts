interface Point {
    x: number,
    y: number
}

interface Polygon {
    points: Point[];
    origin?: Point;
    color?: string;
    angle: number; 
    vx: number;
    vy: number;
    speed: number;
}
