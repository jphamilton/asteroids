import { EventSource } from './events';
import { Key } from './keys';
import screen from './screen';
import { Object2D } from './object2d';
import { Rock } from './rocks';
import { Vector } from './vector';
import { random } from './util';

export class Shockwave extends Object2D {

    life: number = 1;   
    frame: number = 0;
    radius: number = 1;
    rocks: Rock[] = [];
    
    constructor(x: number, y: number, public velocity: Vector, public size: number, public multiplier: number = 1) {
        super(x, y);

    }

    update(dt: number) {
        this.frame++;
        this.radius = this.size * (this.frame / 10);
        this.life -= dt;

        this.origin.x += this.velocity.x * dt;
        this.origin.y += this.velocity.y * dt;

        if (this.life <= .1) {
            this.rocks.length = 0;
            this.trigger('expired');
        }
    }

    render(dt?: number) {
        if (this.frame === 1) {
            const radius = (this.size * (random(25,55))) / 10;
            const { ctx } = screen;
            ctx.beginPath();
            ctx.arc(this.origin.x, this.origin.y, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = `rgba(255, 255, 255, ${random(.2, .5)})`;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            screen.draw.scanlines();
        }

        screen.draw.circle(this.origin.x, this.origin.y, this.radius, `rgba(128,128,128,${.3 - (this.frame / 100)})`);
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