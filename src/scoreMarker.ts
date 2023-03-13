import screen from './screen';
import { white } from './draw';
import { Object2D } from './object2d';

export class ScoreMarker extends Object2D { 

    life: number = 1;   // in seconds
    
    constructor(obj: Object2D, private text: string) {
        super(obj.origin.x, obj.origin.y);
        this.velocity = obj.velocity;
    }

    render() {
        screen.draw.text(this.text, this.origin.x, this.origin.y, this.life * 50, white(this.life));   
    }

    update(dt: number) {
        this.move(dt);

        this.life -= dt;

        if (this.life <= 0) {
            this.destroy();
        }
    }

    destroy() {
        this.life = 0;
        this.trigger('expired');
    }
}