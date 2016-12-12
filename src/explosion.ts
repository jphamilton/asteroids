import { EventSource } from './events';
import { Key } from './keys';
import screen from './screen';
import { Object2D } from './object2d';
import { VECTOR } from './lut';
import { random } from './util';

const VELOCITY = 150;

export class Explosion extends EventSource {

    life: number = 1.25;   
    points: {x: number, y: number, vx: number, vy: number}[] = [];

    constructor(x: number, y: number) {
        super();

        for(let i = 0; i < 15; i++) {
            let t = VECTOR[random(1,360)];
            let tx = t.x * Math.random() * VELOCITY;
            let ty = t.y * Math.random() * VELOCITY;
            this.points.push({x: x, y: y, vx: tx, vy: ty });
        }
    }

    update(dt) {
        this.points.forEach(point => {
            point.x += point.vx * dt;
            point.y += point.vy * dt;
        });

        this.life -= dt;

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