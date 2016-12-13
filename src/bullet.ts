import screen from './screen';
import { Vector } from './vector';
import { Object2D } from './object2d';

export class Bullet extends Object2D { 

    life: number = 1.25;   // in seconds
    
    constructor(x: number, y: number, v: Vector) {
        super(x, y);
        this.vx = v.x;
        this.vy = v.y;
    }

    render() {
        this.draw();   
    }

    update(dt: number) {
        this.move(dt);

        this.life -= dt;

        if (this.life <= 0) {
            this.trigger('expired');
            this.destroy();
        }
    }

    draw() {
        screen.draw.point({x: this.origin.x, y: this.origin.y});
    }
}