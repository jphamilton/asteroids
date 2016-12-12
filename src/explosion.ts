import { EventSource } from './events';
import { Key } from './keys';
import screen from './screen';
import { Object2D } from './object2d';
import { VECTOR } from './lut';
import { random } from './util';

export class Explosion extends EventSource {

    life: number = 1;   
    points: {x: number, y: number, vx: number, vy: number}[] = [];

    constructor(x: number, y: number) {
        super();

        for(let i = 0; i < 10; i++) {
            let t = VECTOR[random(1,360)];
            this.points.push({x: x, y: y, vx: t.x + Math.random(), vy: t.y + Math.random() });
        }
    }

    update(step) {
        this.points.forEach(point => {
            point.x += point.vx;
            point.y += point.vy;
        });

        this.life -= step;

        if (this.life <= 0) {
            this.trigger('expired');
        }
    }

    render(dt) {
        this.points.forEach(point => {
           screen.draw.point(point, `rgba(255,255,255,${this.life})`);
        });
    }
}