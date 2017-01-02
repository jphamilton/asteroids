import { EventSource } from './events';
import { Key } from './keys';
import screen from './screen';
import { Object2D } from './object2d';
import { Vector } from './vector';
import { random } from './util';

export class Shockwave extends Object2D {

    life: number = 1;   
    frame: number = 0;
    radius: number = 1;
    active: boolean = true; // shockwaves can only damage once
    
    constructor(x: number, y: number, public size: number, public multiplier: number = 1) {
        super(x, y);

    }

    update(dt: number) {
        this.frame++;
        this.radius = this.size * (this.frame / 10);
        this.life -= dt;

        if (this.life <= .1) {
            this.trigger('expired');
        }
    }

    render(dt?: number) {
        screen.draw.circle(this.origin.x, this.origin.y, this.radius, `rgba(128,128,128,${.5 - (this.frame / 100)})`);
    }

    get x(): number {
        return this.origin.x - this.radius;
    }

    get y(): number {
        return this.origin.y - this.radius;
    }

    get width(): number {
        return this.radius * 2;
    }

    get height(): number {
        return this.radius * 2;
    }

    
}