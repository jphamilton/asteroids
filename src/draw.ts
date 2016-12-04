export class Draw {

    constructor(private ctx: CanvasRenderingContext2D) {

    }

    line(p1: Point, p2: Point, strokeStyle: string, width: number = 2) {
        let { ctx } = this;
        ctx.beginPath();
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = width; 
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.closePath();
    }

    shape(points: Point[], x: number, y: number, color: string) {
        let p1, p2;

        for(let i = 0; i < points.length - 1; i++) {
            p1 = {x: x + points[i].x, y: y + points[i].y};
            p2 = {x: x + points[i + 1].x, y: y + points[i + 1].y};
            this.line(p1, p2, color, 2);
        }
    }

    rect(p1: Point, p2: Point, fillStyle: string | CanvasGradient) {
        let { ctx } = this;
        ctx.beginPath();
        ctx.fillStyle = fillStyle; 
        ctx.fillRect(p1.x, p1.y, p2.x, p2.y);
        ctx.stroke();
        ctx.closePath();
    }

    point(p: Point, fillStyle: string = '#ffffff') {
        this.rect(p, { x: 2, y: 2 }, fillStyle);
    }

    background() {
        this.rect({ x: 0, y: 0}, { x: screen.width, y: screen.height }, '#000000');
    }
}