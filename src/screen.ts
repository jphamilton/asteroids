import { Draw } from './draw';

export class Screen implements Rect {

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    x: number = 0;
    y: number = 0;
    width: number;
    height: number;
    draw: Draw;
    width2: number;
    height2: number;

    constructor() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.draw = new Draw(this.ctx);
        this.init();

        window.addEventListener('resize', () => {
            this.init();
        });
    }

    init() {
        this.canvas.width = document.body.clientWidth; 
        this.canvas.height = document.body.clientHeight; 
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.width2 = this.width / 2;
        this.height2 = this.height / 2;
    }

}

export default new Screen();



