export class Draw {

    constructor(private ctx: CanvasRenderingContext2D) {

    }

    line(p1: Point, p2: Point, strokeStyle: string, width: number) {
        let { ctx } = this;
        ctx.beginPath();
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 2; //width;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.closePath();
    }

    shape(origin: Point, points: Point[], color: string, closed: boolean = true) {
        //let { points, origin, color } = shape;
        let p1, p2;

        for(let i = 0; i < points.length - 1; i++) {
            p1 = {x: origin.x + points[i].x, y: origin.y + points[i].y};
            p2 = {x: origin.x + points[i + 1].x, y: origin.y + points[i + 1].y};
            
            this.line(p1, p2, color, 2);
        }

        if (closed) {
            this.line(p2, {x: origin.x + points[0].x, y: origin.y + points[0].y}, color, 2);
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

}