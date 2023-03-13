import screen from './screen';
import { Ship } from './ship';
import { random } from './util';
import Global from './global';

const VectorLine = 'rgba(255,255,255,.8)';
const TextColor = 'rgba(255,255,255,.8)';
const Y_START = 20;
const DefaultLineWidth = 2;
const CR = String.fromCharCode(169);

export function magenta(opacity: number = 1) {
    return `rgba(255,0,255, ${opacity})`;
}

export function cyan(opacity: number = 1) {
    return `rgba(0,255,255, ${opacity})`;
}

export function white(opacity: number = 1) {
    return `rgba(255,255,255, ${opacity})`;
}

export const BACKGROUND_COLOR = '#000000';

const magenta5 = magenta(.5);
const cyan5 = cyan(.5);

export class Draw {


    constructor(private ctx: CanvasRenderingContext2D) {

    }

    line(x1: number, y1: number, x2: number, y2: number, color: string = VectorLine, width: number = DefaultLineWidth) {
        const { ctx } = this;
        ctx.beginPath();
        ctx.lineWidth = width; 
        ctx.moveTo(x1, y1);
        ctx.strokeStyle = color;
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    }

    vectorline(x1: number, y1: number, x2: number, y2: number, color: string = VectorLine, width: number = DefaultLineWidth) {
        const { ctx } = this;
        const old = ctx.strokeStyle;

        if (Global.burn) {
            this.line(x1 - 2, y1, x2 - 2, y2, magenta5);
            this.line(x1 - 1, y1 - 2, x2 - 1, y2 - 1, cyan5);
        }
        
        this.line(x1, y1, x2, y2, color);
        
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

    vectorShape(points: Point[], x: number, y: number, color: string = VectorLine, closed: boolean = true) {
        let p1, p2;
        let l = points.length - 1;
        let i = 0;
        
        this.ctx.save();

        for(let i = 0; i < l; i++) {
            this.vectorline(x + points[i].x, y + points[i].y, x + points[i + 1].x, y + points[i + 1].y, color);
        }
        
        if (closed) {
            this.vectorline(x + points[l].x, y + points[l].y, x + points[0].x, y + points[0].y, color);
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

    background(color: string = BACKGROUND_COLOR) {
        const { ctx } = this;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, screen.width, screen.height);
    }

    scanlines() {
        if (!Global.burn) {
            return;
        }
        
        const { ctx } = this;
        const step = random(2,5);

        for(let i = 0; i < screen.height - step; i+=step) {
            ctx.beginPath();
            
            ctx.lineWidth = 1;
            ctx.moveTo(0, i);
            ctx.strokeStyle = '#001111';
            ctx.lineTo(screen.width, i);
            ctx.stroke();

            ctx.moveTo(0, i + 1);
            ctx.strokeStyle = 'rgba(255,0,255,.5)';
            ctx.lineTo(screen.width, i + 1);
            ctx.stroke();

            ctx.moveTo(0, i + 2);
            ctx.strokeStyle = 'rgba(0,255,255,.3)';
            ctx.lineTo(screen.width, i + 2);
            ctx.stroke();

            ctx.closePath();
        }
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
        
        if (Global.burn) {
            ctx.strokeStyle = magenta5;
            ctx.strokeText(text, x - 2, y - 2);

            ctx.strokeStyle = cyan5;
            ctx.strokeText(text, x - 1, y - 1);
        }

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

        if (Global.burn) {
            ctx.strokeStyle = magenta(.5);
            ctx.strokeText(text, point.x - 2, point.y - 2);
            
            ctx.strokeStyle = cyan(.5);
            ctx.strokeText(text, point.x - 1, point.y - 1);
        }

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

        if (Global.burn) {
            ctx.fillStyle = magenta(.5);
            ctx.fillText(text, point.x - 2, point.y - 2);
            
            ctx.fillStyle = cyan(.5);
            ctx.fillText(text, point.x - 1, point.y - 1);
        }

        ctx.fillStyle = TextColor;
        ctx.fillText(text, point.x, point.y);

        ctx.restore();
    }

    scorePlayer1(score) {
        const X_START = 100;
        let text = score.toString();
        while (text.length < 2) { 
            text = '0' + text 
        };
        this.text(text, X_START, Y_START, screen.font.medium);
    }

    highscore(score: number) {
        let text = score.toString();
        
        while (text.length < 2) { 
            text = '0' + text;
        }

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
        screen.draw.text3('push start', screen.font.xlarge, (width) => {
            return {
                x: screen.width2 - (width / 2),
                y: screen.height / 8
            }
        });
    }

    player1() {
        screen.draw.text3('player 1', screen.font.xlarge, (width) => {
            return {
                x: screen.width2 - (width / 2),
                y: screen.height / 4.5
            }
        });
    }

    gameOver() {
        screen.draw.text3('game over', screen.font.xlarge, (width) => {
            return {
                x: screen.width2 - (width / 2),
                y: screen.height / 4.5
            }
        });
    }

    copyright() {
        this.text2(CR + ' 1979 atari inc', screen.font.small, (width) => {
            return {
                x: screen.width2 - (width / 2),
                y: screen.height - screen.font.small
            }
        });
    }

    drawExtraLives(lives: number) {
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
        
        ctx.setLineDash([1, 10]);

        if (Global.burn) {
            ctx.beginPath();
            ctx.arc(x - 2, y - 2, radius, 0, 2 * Math.PI, false);
            ctx.strokeStyle = magenta(.2);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(x - 1, y - 1, radius, 0, 2 * Math.PI, false);
            ctx.strokeStyle = cyan(.2);
            ctx.stroke();
            ctx.closePath();
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();

        ctx.setLineDash([]);
    }

    quadtree(tree: IQuadtree) {
        const { ctx } = this;
        
        ctx.save();

        const drawNode = (node: IQuadtree) => {
            const x = node.xmid - node.width2;
            const y = node.ymid - node.height2;
            
            this.bounds({
                x,
                y,
                width: node.width2 * 2,
                height: node.height2 * 2
            }, '#00FF00');
        }

        const drawTree = (child: IQuadtree) => {

            child.nodes.forEach(node => {
                drawTree(node);
            });

            drawNode(child);
        }

        drawTree(tree);

        ctx.restore();
    }
}