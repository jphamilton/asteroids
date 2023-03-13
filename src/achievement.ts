import screen from './screen';
import { white } from './draw';
import { Object2D } from './object2d';
import { Vector } from './vector';

export class Achievement extends Object2D { 

    life: number = 1;   // in seconds
    fontSize: number = screen.font.xlarge * 2;
    
    heightText: number = screen.height / 4;
    heightScore: number = screen.height / 6;

    constructor(private text: string, score: number) {
        super(screen.width2, screen.height2);
        this.score = score;
        //this.velocity = new Vector(0, -1);
    }

    update(dt: number) {
        this.life -= dt;
        this.fontSize -= 1;

        if (this.life <= 0) {
            this.destroy();
        }
    }

    render() {

        screen.draw.text3(this.text, this.fontSize, (width) => {
            return {
                x: screen.width2 - (width / 2),
                y: this.heightText
            }
        });

        screen.draw.text3(`+${this.score}`, this.fontSize, (width) => {
            return {
                x: screen.width2 - (width / 2),
                y: this.heightScore
            }
        });
    }

    

    destroy() {
        this.life = 0;
        this.trigger('expired');
    }
}