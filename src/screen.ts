import { Draw } from './draw';

export class Screen {

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    draw: Draw;

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
    }

}

export default new Screen();



