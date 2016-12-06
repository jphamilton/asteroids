import { Object2D } from './object2d';
import { Ship } from './ship';
import { Bullet } from './bullet';
import { Key } from './keys';
import screen from './screen';
import { highscores } from './highscores';

// manages game objects, score, collisions, etc.
// todo: refactor this to a Player class, leaving common stuff like score
export class GameState {

    level: number = 1;
    score: number = 0;
    lives: number = 3;
    
    ship: Ship;
    shipBullets: Bullet[] = [];
    
    extraLives: Object2D[] = [];
    highscore: number;
    
    constructor() {
        this.ship = new Ship(screen.width / 2, screen.height / 2);
        
        this.ship.onFire = (bullet: Bullet) => {
            
            bullet.onDone = () => {
                this.shipBullets = this.shipBullets.filter(x => x !== bullet);
            }

            this.shipBullets.push(bullet);
        };

        for(let i = 0; i < this.lives; i++) {
            let life = new Ship(80 + (i * 20), 55);
            this.extraLives.push(life);
        }

        this.highscore = highscores.length ? highscores[0].score : 0;
    }

    update(step: number) {
        this.ship.update(step);

        for(let i = 0; i < this.shipBullets.length; i++) {
            this.shipBullets[i].update(step);
        }

    }

    render(delta: number) {
        // black background
        screen.draw.background();

        // copyright
        screen.draw.copyright();

        // score
        screen.draw.scorePlayer1(this.score);

        // high score
        screen.draw.highscore(this.highscore);

        // extra lives
        this.drawExtraLives();

        // ship
        this.ship.render();
        
        // bullets
        for(let i = 0; i < this.shipBullets.length; i++) {
            this.shipBullets[i].render();
        }
        
    }

    private drawExtraLives() {
        let lives = Math.min(this.lives, 10);
        for(let i = 0; i < lives; i++) {
            let life = this.extraLives[i];
            life.render(0);
        }
    }
}