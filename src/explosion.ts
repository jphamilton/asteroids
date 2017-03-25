import { EventSource } from './events';
import { Key } from './keys';
import screen from './screen';
import { Object2D } from './object2d';
import { Vector } from './vector';
import { random } from './util';
import { SIN, COS } from './lut';

const VELOCITY = 300 * screen.objectScale;

// general, garden variety explosion
export class Explosion extends EventSource {

    life: number = 1;   
    points: {x: number, y: number, vx: number, vy: number, alpha: number }[] = [];
    
    constructor(private x: number, private y: number, private size: number = 100) {
        super();

        for(let i = 0; i < 15; i++) {
            const v = Vector.fromAngle(random(1,360), Math.random() * VELOCITY);
            this.points.push({x: x, y: y, vx: v.x, vy: v.y, alpha: Math.random() });
        }
    }

    update(dt: number) {
        this.points.forEach(point => {
            point.x += point.vx * dt;
            point.y += point.vy * dt;
            point.alpha -= .002;
        });

        this.life -= dt;

        if (this.life <= .1) {
           this.trigger('expired'); 
        }
    }

    render(dt?: number) {
        this.points.forEach(p => {
            if (random(1,10) % 2 === 0) {
                screen.draw.rect(p.x, p.y, 2, 2, `rgba(255,255,255,${p.alpha})`);
            }
        });
    }
}