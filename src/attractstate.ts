import screen from './screen';
import { random } from './util';
import { highscores } from './highscores';
import { Key } from './keys';
import { Object2D } from './object2d';
import { Bullet } from './bullet';
import { Rock, RockSize } from './rocks';
import { BigAlien } from './alien';
import { Explosion } from './explosion';
import { Collisions } from './collisions';
import { Vector } from './vector';

export class AttractState {

    level: number = 0;
    highscore: number;
    rocks: Rock[] = [];
    explosions: IGameState[] = [];
    alienBullets: Bullet[] = [];
    alien: BigAlien;
    collisions: Collisions;
    showPushStart: boolean = true;
    levelTimer: number = 0;
    pushStartTimer: number = 0;
    modeTimer: number = 0;
    alienTimer: number = 7;

    constructor(private score) {
        this.highscore = highscores.scores.length ? highscores.top.score : 0;
        this.init();
    }

    init() {
        this.startLevel();
    }

    startLevel() {
        this.level++;
        this.levelTimer = 0;
        this.alienTimer = random(5, 10);
        this.addRocks();
    }

    update(dt) {
        this.levelTimer += dt;

        this.updateAlienTimer(dt);

        if (!this.rocks.length && !this.explosions.length && !this.alien) {  
            this.startLevel();
        }

        this.updatePushStartTimer(dt);
        this.checkCollisions();

        const objects = [this.alien, ...this.rocks, ...this.alienBullets, ...this.explosions];
        
        objects.forEach(obj => {
            if (obj) {
                obj.update(dt);
            }
        });
    }

    updateAlienTimer(dt: number) {
        if (!this.alien) {
            this.alienTimer -= dt;

            if (this.alienTimer <= 0) {
                this.addAlien();
                this.alienTimer = random(5, 10);
            }
        }
    }

    updatePushStartTimer(dt: number) {
        this.pushStartTimer += dt;

        if (this.pushStartTimer >= .4) {
            this.pushStartTimer = 0;
            this.showPushStart = !this.showPushStart;
        }
    }

    private alienDestroyed() {
        this.createExplosion(this.alien.origin.x, this.alien.origin.y);
        this.alien = null;
        this.alienBullets = [];
    }

    private rockDestroyed(rock: Rock) {
        this.createExplosion(rock.origin.x, rock.origin.y);
        this.rocks = this.rocks.filter(x => x !== rock);
        this.rocks.push(...rock.split());
        rock = null;
    }

    checkCollisions() {
        const check = !!this.alien || !!this.alienBullets.length;

        if (!check) {
            return;
        }

        this.collisions = new Collisions();

        this.collisions.check([this.alien], this.rocks, (alien, rock) => {
            this.alienDestroyed();
            this.rockDestroyed(rock);
        });

        this.collisions.check(this.alienBullets, this.rocks, (bullet, rock) => {
            this.rockDestroyed(rock);
        });
    }

    render() {
        this.drawBackground();
        this.drawPushStart();

        const objects = [...this.rocks, this.alien, ...this.alienBullets, ...this.explosions];
        
        objects.forEach(obj => {
            if (obj) {
                obj.render();
            }
        });
    }

    private addRocks() {
        const count = Math.min(this.level + 3, 7);
        const speed = 150;

        for(let i = 0; i < count; i++) {
            const zone = random(1,4);
            const v = new Vector(random(1, 360));
            let x;
            let y;

            switch (zone) {
                case 1:
                    x = random(40, screen.width - 40); 
                    y = random(40, 80); 
                    break;
                case 2:
                    x = random(screen.width - 80, screen.width - 40);
                    y = random(screen.height - 40, screen.height - 40);
                    break;
                case 3:
                    x = random(40, screen.width - 40);
                    y = random(screen.height - 40, screen.height - 40); 
                    break;
                default:
                    x = random(40, 80);
                    y = random(screen.height - 40, screen.height - 40);
                    break;
            }

            const rock = new Rock(x, y, v, RockSize.Large, speed);
            this.rocks.push(rock);
        } 
    }

    private addAlien() {
        this.alien = new BigAlien();

        this.alien.on('expired', () => {
            this.alien.destroy();
            this.alien = null;
            this.alienBullets.forEach(b => b.destroy());
            this.alienBullets = [];
        });

        this.alien.on('fire', (alien, bullet: Bullet) => {
            
            bullet.on('expired', () => {
                this.alienBullets = this.alienBullets.filter(x => x !== bullet);
            });

            this.alienBullets.push(bullet);
        });

        this.alienTimer = 0;
    }

    private createExplosion(x: number, y: number) {
        const explosion = new Explosion(x, y);

        explosion.on('expired', ()=> {
            this.explosions = this.explosions.filter(x => x !== explosion);
        });

        this.explosions.push(explosion);
    }

    private drawBackground() {
        screen.draw.background();
        screen.draw.scorePlayer1(this.score);
        screen.draw.oneCoinOnePlay();
        screen.draw.highscore(this.highscore);
        screen.draw.copyright();
    }

    private drawPushStart() {
        if (this.showPushStart) {
            screen.draw.pushStart();
        }
    }

   
}