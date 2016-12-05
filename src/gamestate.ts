import { Object2D } from './object2d';
import { Ship } from './ship';
import { Bullet } from './bullet';
import { Key } from './keys';
import screen from './screen';
import { highscores } from './highscores';

// manages game objects, score, collisions, etc.
// todo: refactor this to a Player class, leaving common stuff like score
export class GameState {

    score: number;
    lives: number;
    ship: Object2D;
    bullets: Bullet[];
    extraLives: Object2D[];
    bulletTimer: number = 0;
    highscore: number;
    // asteroids
    // aliens
    // etc.

    constructor() {
        this.score = 0;
        this.lives = 3;
        this.ship = new Ship(screen.width / 2, screen.height / 2);
        this.bullets = [];
        this.extraLives = [];

        for(let i = 0; i < this.lives; i++) {
            let life = new Ship(80 + (i * 20), 55);
            this.extraLives.push(life);
        }

        this.highscore = highscores.length ? highscores[0].score : 0;
    }

    update(step: number) {
        this.ship.update(step);

        for(let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update(step);
        }

        // remove old bullets
        this.bullets = this.bullets.filter(x => x.life > 0);

        // can only fire bullets so fast
        if (this.bulletTimer > 0) {
            this.bulletTimer -= step;
        }

        if (Key.isDown(Key.CTRL)) {
            if (this.bulletTimer <= 0) {
                this.bulletTimer = .2;
                this.bullet();
            }
        }
    }

    render(delta: number) {
        // black background
        screen.draw.background();

        // ship
        this.ship.render(delta);
        
        // bullets
        for(let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].render();
        }

        // score
        screen.draw.scorePlayer1(this.score);

        // high score
        screen.draw.highscore(this.highscore);

        // extra lives
        this.drawExtraLives();
    }

    bullet() {
        if (this.bullets.length < 4) {
            this.bullets.push(new Bullet(this.ship));
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