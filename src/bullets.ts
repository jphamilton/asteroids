import { Bullet } from './bullet';

export class Bullets {
    
    bullets: Bullet[] = [];
    bulletCounter: number = 0;

    constructor(private ship: Polygon) {

    }

    update(step: number) {
        
        for(let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update(step);
        }

        this.bullets = this.bullets.filter(x => x.life > 0);

        if (this.bulletCounter > 0) {
            this.bulletCounter -= step;
        }
    }

    draw() {
        for(let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].draw();
        }
    }
    
    fire() {
        if (this.bulletCounter <= 0) {
            this.bulletCounter = .2;
            if (this.bullets.length < 4) {
                this.bullets.push(new Bullet(this.ship));
            }
        }
    }
}