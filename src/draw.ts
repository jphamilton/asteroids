import { highscores } from './highscores';
import screen from './screen';

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
        this.rect(p, { x: 4, y: 4 }, fillStyle);
    }

    background() {
        this.rect({ x: 0, y: 0}, { x: screen.width, y: screen.height }, '#000000');
    }

    text(text: string, x: number, y: number, size: string) {
        let { ctx } = this;
        ctx.save();
        ctx.font = `${size} hyperspace`;
        //ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ffffff';
        ctx.strokeText(text, x, y);
        ctx.restore();
    }

    text2(text: string, size: string, cb: (width: number) => Point) {
        let { ctx } = this;
        ctx.save();
        ctx.font = `${size} hyperspace`;
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ffffff';
        let width = ctx.measureText(text).width;
        let point = cb(width);
        ctx.strokeText(text, point.x, point.y);
        ctx.restore();
    }

    scorePlayer1(score) {
        let text = score.toString();
        while (text.length < 2) text = '0' + text;
        this.text(text, 100, 20, '24pt');
    }

    highscore(score: number) {
        let text = score.toString();
        while (text.length < 2) text = '0' + text;
        this.text2(text, '12pt', (width) => {
            return {
                x: (screen.width / 2) - (width / 2),
                y: 20
            }
        });
    }

    copyright() {
        this.text2(String.fromCharCode(169) + ' 1979 Atari INC', '12pt', (width) => {
            return {
                x: (screen.width / 2) - (width / 2),
                y: screen.height - 20
            }
        });
    }
}