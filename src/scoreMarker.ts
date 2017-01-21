import screen from './screen';
import { magenta, cyan, white } from './draw';
import { Object2D } from './object2d';

export class ScoreMarker extends Object2D { 

    life: number = 1;   // in seconds
    
    constructor(obj: Object2D, private text: string) {
        super(obj.origin.x, obj.origin.y);
        this.vx = obj.vx;
        this.vy = obj.vy;
    }

    render() {
        this.draw();   
    }

    update(dt: number) {
        this.move(dt);

        this.life -= dt;

        if (this.life <= 0) {
            this.destroy();
        }
    }

    draw() {
        screen.draw.text(this.text, this.origin.x - 2, this.origin.y - 2, this.life * 50, magenta(this.life));
        screen.draw.text(this.text, this.origin.x - 1, this.origin.y - 1, this.life * 50, cyan(this.life));
        screen.draw.text(this.text, this.origin.x, this.origin.y, this.life * 50, white(this.life));
    }

    destroy() {
        this.life = 0;
        this.trigger('expired');
    }

    
}