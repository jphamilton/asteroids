import screen from './screen';
import { Object2D } from './object2d';
import { Vector } from './vector';
import { random } from './util';
import { powerup as sound } from './sounds';


export class PowerUp extends Object2D {

    life: number = 100;

    constructor(x: number, y: number, vx: number, vy: number) {
        super(x, y);
        
        this.vx = vx;
        this.vy = vy;

        this.points = [
            { x: 0, y: -20 },
            { x: 20, y: 0},
            { x: 0, y: 20},
            { x: -20, y: 0}
        ];

        sound.loop(true);
        sound.play();
    }

    update(dt: number) {
        this.move(dt);
        this.rotate(-5);
        this.life -= dt;
        
        if (this.life <= 0) {
            this.life = 0;
            this.destroy();
        }
    }

    render() {
        this.draw();
    }
    
    draw() {
        //if (random(1,10) % 2 === 0) {
            super.draw(true);
            //screen.draw.line(this.points[1], this.points[3]);
            //screen.draw.line(this.points[0], this.points[2]);
        //}
    }

    destroy() {
        sound.stop();
        this.trigger('expired');
    }
}

