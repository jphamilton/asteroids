import screen from './screen';
import { Vector } from './vector';
import { Object2D } from './object2d';

export class Bullet extends Object2D { 

    frame: number = 0;

    constructor(x: number, y: number, v: Vector, private life:number = 1.25) {
        super(x, y);
        this.vx = v.x;
        this.vy = v.y;
    }

    render() {
        this.draw();   
    }

    update(dt: number) {
        this.frame++;

        this.move(dt);

        this.life -= dt;

        if (this.life <= 0) {
            this.destroy();
        }
    }

    draw() {
        let size = this.frame <= 1 ? 8 * screen.objectScale : 4 * screen.objectScale;
        screen.draw.rect({x: this.origin.x - (size / 2), y: this.origin.y}, { x: size, y: size });
    }

    destroy() {
        this.trigger('expired');
    }

    get vertices(): Point[] {
        return [this.origin];
    }
}