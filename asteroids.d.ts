interface Point {
    x: number,
    y: number
}

interface Polygon {
    points: Point[];
    origin?: Point;
    color?: string;
}
