import { Object2D } from './object2d';
import { Ship } from './ship';
import { Bullet } from './bullet';
import screen from './screen';

export class World {

    ship: Object2D;
    bullets: Bullet[];
    // asteroids
    // aliens
    // etc.

    constructor() {
        this.ship = new Ship(screen.width / 2, screen.height / 2);
        this.bullets = [];
    }

    update(step: number) {
        this.ship.update(step);

        for(let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update(step);
        }

        // remove old bullets
        this.bullets = this.bullets.filter(x => x.life > 0);
    }

    render(delta: number) {
        screen.draw.background();
        this.ship.render(delta);
        
        for(let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].render();
        }
    }

    bullet() {
        if (this.bullets.length < 4) {
            this.bullets.push(new Bullet(this.ship));
        }
    }


}

export default new World();