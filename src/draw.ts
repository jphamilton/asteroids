import screen from './screen';
import { highscores } from './highscores';
import { Ship } from './ship';

const VectorLine = 'rgba(255,255,255,.8)';
const TextColor = 'rgba(255,255,255,.8)';
const Y_START = 20;
const DEFAULT_LINE_WIDTH = 2;

export function magenta(opacity: number = 1) {
    return `rgba(255,0,255, ${opacity})`;
}

export function cyan(opacity: number = 1) {
    return `rgba(0,255,255, ${opacity})`;
}

export function white(opacity: number = 1) {
    return `rgba(255,255,255, ${opacity})`;
}

const magenta5 = magenta(.5);
const cyan5 = cyan(.5);

export class Draw {

    constructor(private ctx: CanvasRenderingContext2D) {

    }

    line(x1: number, y1: number, x2: number, y2: number, color: string = VectorLine, width: number = DEFAULT_LINE_WIDTH) {
        const { ctx } = this;
        const old = ctx.strokeStyle;

        ctx.beginPath();
        ctx.lineWidth = width; 
        ctx.moveTo(x1 - 2, y1);
        ctx.strokeStyle = magenta5;
        ctx.lineTo(x2 - 2, y2);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.lineWidth = width; 
        ctx.moveTo(x1 - 1, y1 - 1);
        ctx.strokeStyle = cyan5;
        ctx.lineTo(x2 - 1, y2 - 1);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.lineWidth = width; 
        ctx.moveTo(x1, y1);
        ctx.strokeStyle = color;
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();

        ctx.strokeStyle = old;
    }

    shape(points: Point[], x: number, y: number, color: string = VectorLine, closed: boolean = true) {
        let p1, p2;
        let l = points.length - 1;
        let i = 0;
        
        this.ctx.save();

        for(let i = 0; i < l; i++) {
            this.line(x + points[i].x, y + points[i].y, x + points[i + 1].x, y + points[i + 1].y, color);
        }
        
        if (closed) {
            this.line(x + points[l].x, y + points[l].y, x + points[0].x, y + points[0].y, color);
        }

        this.ctx.restore();
    }

    rect(x: number, y: number, width: number, height: number, color: string = VectorLine) {
        const { ctx } = this;
        ctx.beginPath();
        ctx.fillStyle = color; 
        ctx.fillRect(x, y, width, height);
        ctx.stroke();
        ctx.closePath();
    }

    point(p: Point, fillStyle: string = VectorLine) {
        this.rect(p.x, p.y, screen.pointSize, screen.pointSize, fillStyle);
    }

    background(color: string = '#000000') {
        const { ctx } = this;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, screen.width, screen.height);
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

    text(text: string, x: number, y: number, size: number, color: string = TextColor) {
        const { ctx } = this;
        
        ctx.save();
        ctx.font = `${size}pt hyperspace`;
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 1;
        
        ctx.strokeStyle = color;
        ctx.strokeText(text, x, y);
        
        ctx.restore();
    }

    text2(text: string, size: number, cb: (width: number) => Point) {
        const { ctx } = this;
        
        ctx.save();
        ctx.font = `${size}pt hyperspace`;
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 1;
        
        const width = ctx.measureText(text).width;
        const point = cb(width);

        ctx.strokeStyle = magenta(.5);
        ctx.strokeText(text, point.x - 2, point.y - 2);
        
        ctx.strokeStyle = cyan(.5);
        ctx.strokeText(text, point.x - 1, point.y - 1);
        
        ctx.strokeStyle = TextColor;
        ctx.strokeText(text, point.x, point.y);
        ctx.restore();
    }

    text3(text: string, size: number, cb: (width: number) => Point) {
        const { ctx } = this;
        
        ctx.save();
        ctx.font = `${size}pt hyperspace`;
        ctx.textBaseline = 'middle';
        
        const width = ctx.measureText(text).width;
        const point = cb(width);

        ctx.fillStyle = magenta(.5);
        ctx.fillText(text, point.x - 2, point.y - 2);
        
        ctx.fillStyle = cyan(.5);
        ctx.fillText(text, point.x - 1, point.y - 1);
        
        ctx.fillStyle = TextColor;
        ctx.fillText(text, point.x, point.y);

        ctx.restore();
    }

    scorePlayer1(score) {
        const X_START = 100;
        
        let text = score.toString();
        while (text.length < 2) text = '0' + text;
        
        this.text(text, X_START - 2, Y_START - 2, screen.font.medium, magenta(.5));
        this.text(text, X_START - 1, Y_START - 1, screen.font.medium, cyan(.5));
        this.text(text, X_START, Y_START, screen.font.medium);
    }

    highscore(score: number) {
        let text = score.toString();
        while (text.length < 2) text = '0' + text;
        this.text2(text, screen.font.small, (width) => {
            return {
                x: screen.width2 - (width / 2),
                y: Y_START
            }
        });
    }

    oneCoinOnePlay() {
        this.text2('1  coin  1  play', screen.font.medium, (width) => {
            return {
                x: screen.width2 - (width / 2),
                y: (screen.height / 8) * 7
            }
        });
    }

    pushStart() {
        screen.draw.text2('push start', screen.font.medium, (width) => {
            return {
                x: screen.width2 - (width / 2),
                y: screen.height / 8
            }
        });
    }

    player1() {
        screen.draw.text2('player 1', screen.font.medium, (width) => {
            return {
                x: screen.width2 - (width / 2),
                y: screen.height / 4.5
            }
        });
    }

    gameOver() {
        screen.draw.text2('game over', screen.font.medium, (width) => {
            return {
                x: screen.width2 - (width / 2),
                y: screen.height / 4.5
            }
        });
    }

    copyright() {
        this.text2(String.fromCharCode(169) + ' 1979 atari inc', screen.font.small, (width) => {
            return {
                x: screen.width2 - (width / 2),
                y: screen.height - screen.font.small
            }
        });
    }

    drawExtraLives(lives) {
        lives = Math.min(lives, 10);
        const life = new Ship(0, 0);
        const loc = (life.x + life.width) * 2.3;
        
        const y = Y_START + screen.font.medium + 10;

        for(let i = 0; i < lives; i++) {
            life.origin.x = 80 + (i * loc);
            life.origin.y = y;
            life.render();
        }
    }

    circle(x: number, y: number, radius: number, color: string = VectorLine) {
        const { ctx } = this;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }
}