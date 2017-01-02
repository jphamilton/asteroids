import screen from './screen';
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
        screen.draw.text(this.text, this.origin.x, this.origin.y, this.life * 50, `rgba(255,255,255,${this.life})`);
    }

    destroy() {
        this.life = 0;
        this.trigger('expired');
    }

    get vertices(): Point[] {
        return [this.origin];
    }
}