import { highscores } from './highscores';
import screen from './screen';
import { Ship } from './ship';

const VectorLine = 'rgba(255,255,255,1)';

export class Draw {

    constructor(private ctx: CanvasRenderingContext2D) {

    }

    line(p1: Point, p2: Point, color: string = VectorLine, width: number = 2) {
        const { ctx } = this;
        
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width; 
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.closePath();
    }

    shape(points: Point[], x: number, y: number, color: string = VectorLine) {
        let p1, p2;

        for(let i = 0; i < points.length - 1; i++) {
            p1 = {x: x + points[i].x, y: y + points[i].y};
            p2 = {x: x + points[i + 1].x, y: y + points[i + 1].y};
            this.line(p1, p2, color, 2);
        }
    }

    rect(p1: Point, p2: Point, color: string = VectorLine) {
        const { ctx } = this;

        ctx.beginPath();
        ctx.fillStyle = color; 
        ctx.fillRect(p1.x, p1.y, p2.x, p2.y);
        ctx.stroke();
        ctx.closePath();
    }

    point(p: Point, fillStyle: string = VectorLine) {
        this.rect(p, { x: 4, y: 4 }, fillStyle);
    }

    background() {
        this.rect({ x: 0, y: 0}, { x: screen.width, y: screen.height }, '#000000');
    }

    bounds(rect: Rect, color: string = VectorLine) {
        const { ctx } = this;
        
        if (!rect) {
            return;
        }

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2; 
        ctx.moveTo(rect.x, rect.y);
        ctx.lineTo(rect.x + rect.width, rect.y);
        ctx.lineTo(rect.x + rect.width, rect.y + rect.height);
        ctx.lineTo(rect.x, rect.y + rect.height);
        ctx.lineTo(rect.x, rect.y);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    text(text: string, x: number, y: number, size: string) {
        const { ctx } = this;
        
        ctx.save();
        ctx.font = `${size} hyperspace`;
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 1;
        ctx.strokeStyle = VectorLine;
        ctx.strokeText(text, x, y);
        ctx.restore();
    }

    text2(text: string, size: string, cb: (width: number) => Point) {
        const { ctx } = this;
        
        ctx.save();
        ctx.font = `${size} hyperspace`;
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 1;
        ctx.strokeStyle = VectorLine;
        
        const width = ctx.measureText(text).width;
        const point = cb(width);

        ctx.strokeText(text, point.x, point.y);
        ctx.restore();
    }

    text3(text: string, size: string, cb: (width: number) => Point) {
        const { ctx } = this;
        
        ctx.save();
        ctx.font = `${size} hyperspace`;
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 2;
        ctx.fillStyle = VectorLine;
        
        const width = ctx.measureText(text).width;
        const point = cb(width);

        ctx.fillText(text, point.x, point.y);
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
                x: screen.width2 - (width / 2),
                y: 20
            }
        });
    }

    oneCoinOnePlay() {
        this.text2('1  coin  1  play', '24pt', (width) => {
            return {
                x: screen.width2 - (width / 2),
                y: screen.height - 120
            }
        });
    }

    pushStart() {
        screen.draw.text2('push start', '24pt', (width) => {
            return {
                x: screen.width2 - (width / 2),
                y: 120
            }
        });
    }

    player1() {
        screen.draw.text2('player 1', '30pt', (width) => {
            return {
                x: screen.width2 - (width / 2),
                y: 140
            }
        });
    }

    gameOver() {
        screen.draw.text2('game over', '30pt', (width) => {
            return {
                x: screen.width2 - (width / 2),
                y: 180
            }
        });
    }

    copyright() {
        this.text2(String.fromCharCode(169) + ' 1979 atari inc', '12pt', (width) => {
            return {
                x: screen.width2 - (width / 2),
                y: screen.height - 20
            }
        });
    }

    drawExtraLives(lives) {
        lives = Math.min(lives, 10);
        let life = new Ship(0, 0);
        for(let i = 0; i < lives; i++) {
            life.origin.x = 80 + (i * 20);
            life.origin.y = 55;
            life.render();
        }
    }
}