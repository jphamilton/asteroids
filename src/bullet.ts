import screen from './screen';
import { VECTOR } from './lut';
import { Object2D } from './object2d';

export class Bullet extends Object2D { 

    life: number = 1.25;   // in seconds
    
    constructor(x: number, y: number, angle: number) {
        super(x, y);
        
        let v = VECTOR[angle];
        
        this.vx = v.x;
        this.vy = v.y;
    }

    render() {
        this.draw();   
    }

    update(step?: number) {
        this.move();

        this.life -= step;

        if (this.life <= 0) {
            this.trigger('expired');
            this.destroy();
        }
    }

    draw() {
        screen.draw.point({x: this.x, y: this.y});
    }

}