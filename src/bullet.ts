import screen from './screen';
import { SIN, COS } from './lut';
import { Object2D } from './object2d';

export class Bullet extends Object2D { 

    life: number = 1.25;   // in seconds
    onDone: () => void;

    constructor(x: number, y: number, angle: number) {
        super(x, y);
        this.vx = SIN[angle];
        this.vy = -COS[angle];
    }

    init() {
        return [{x: this.x, y: this.y}];
    }
    
    render() {
        this.draw();   
    }

    update(step?: number) {
        this.move();

        this.life -= step;

        if (this.life <= 0) {
            this.onDone();
        }
    }

    draw() {
        screen.draw.point({x: this.x, y: this.y});
    }

}