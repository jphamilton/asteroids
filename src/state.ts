import { Ship } from './ship';
import { Bullet } from './bullet';
import { Alien, SmallAlien, BigAlien } from './alien';
import { Explosion } from './explosion';
import { Rock, RockSize } from './rocks';
import { Object2D } from './object2d';
import { Vector } from './vector';
import { random } from './util';
import screen from './screen';
import { largeAlien, largeExplosion, extraLife } from './sounds';

const EXTRA_LIFE = 10000;

export class State {
    level: number = 0;
    extraLifeScore: number = 0;
    highscore: number; 
    score: number = 0;
    lives: number = 3; 
    
    ship: Ship;
    shipBullets: Bullet[] = [];
    alien: Alien;
    alienBullets: Bullet[] = [];
    explosions: Explosion[] = [];
    rocks: Rock[] = [];
    
    shipTimer: number = 0;
    alienTimer: number = 0;
    levelTimer: number = 0;
    gameOverTimer: number = 0;
    
    gameOver: boolean = false;
    started: boolean = false;
    paused: boolean = false;

    constructor(highscore: number) {
        this.highscore = highscore;
    }

    get objects(): any {
        return [this.ship, this.alien, ...this.shipBullets, ...this.alienBullets, ...this.rocks, ...this.explosions];
    }

    startLevel() {
        this.level++;
        this.levelTimer = 0;
        this.alienTimer = random(10, 15);
        this.addRocks();
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

    addShip(x: number, y: number) {
        this.ship = new Ship(x, y);
        
        this.ship.on('fire', (ship, bullet) => {

            bullet.on('expired', () => {
                this.shipBullets = this.shipBullets.filter(x => x !== bullet);
            });

            this.shipBullets.push(bullet);
        });
    }

    createExplosion(x: number, y: number) {
        const explosion = new Explosion(x, y);

        explosion.on('expired', ()=> {
            this.explosions = this.explosions.filter(x => x !== explosion);
        });

        this.explosions.push(explosion);
    }

    shipDestroyed() {
        largeExplosion.play();
        this.createExplosion(this.ship.origin.x, this.ship.origin.y);
        this.lives--;
        this.ship = null;
        this.shipBullets = [];
    }

    alienDestroyed() {
        largeAlien.stop();
        largeExplosion.play();
        this.createExplosion(this.alien.origin.x, this.alien.origin.y);
        this.alien = null;
        this.alienBullets = [];
    }

    rockDestroyed(rock: Rock) {
        this.createExplosion(rock.origin.x, rock.origin.y);
        this.rocks = this.rocks.filter(x => x !== rock);
        this.rocks.push(...rock.split());
        rock = null;
    }

    addAlien() {
        // const lvl = Math.min(this.level, 7);

        // if (this.score > 40000) {
        
        //     this.alien = new SmallAlien(this.ship);
        
        // } else {

        //     if (lvl === 1) {
        //         if (this.levelTimer < 90) {
        //             this.alien = new BigAlien();
        //         } else {
        //             if (random(1,3) % 2 === 0) {
        //                 this.alien = new SmallAlien(this.ship);
        //             } else {
        //                 this.alien = new BigAlien();
        //             }
        //         }

        //     } else {
        //         // come up with rules later
                 this.alien = new BigAlien();
        //     } 
        // }

        this.alien.on('expired', () => {
            largeAlien.stop();
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

        largeAlien.play();
    }   

    hyperspace() {
        let x = random(40, screen.width - 40);
        let y = random(40, screen.height - 40);
        let angle = this.ship.angle; 
        
        this.addShip(x, y); 

        if (this.ship.angle > angle) {
            angle = -(this.ship.angle - angle);
        } else if (this.ship.angle < angle) {
            angle = angle - this.ship.angle;
        }

        this.ship.rotate(angle);
    }

    drawExtraLives() {
        const lives = Math.min(this.lives, 10);
        let life = new Ship(0, 0);
        for(let i = 0; i < lives; i++) {
            life.origin.x = 80 + (i * 20);
            life.origin.y = 55;
            life.render();
        }
    }

    addScore(score) {
        this.score += score;
        this.extraLifeScore += score;

        if (this.score > this.highscore) {
            this.highscore = this.score;
        }

        if (this.extraLifeScore >= EXTRA_LIFE) {
            this.lives++;
            this.extraLifeScore = 0;
            extraLife.play();
        }
    }

    tryPlaceShip(dt) {
        this.shipTimer += dt;

        if (this.shipTimer <= 2) {
            return;
        }

        let rect: Rect = {
            x: screen.width2 - 120,
            y: screen.height2 - 120,
            width: 240,
            height: 240
        }

        let collided = false;

        this.rocks.forEach(rock => {
            collided = collided || rock.collided(rect);
        });

        if (this.alien) {
            collided = collided || this.alien.collided(rect);
        }

        if (!collided) {
            this.shipTimer = 0;
            this.addShip(screen.width2, screen.height2);
        }

    }

    updateAlienTimer(dt: number) {
        if (!this.alien) {
            this.alienTimer -= dt;
            
            if (this.alienTimer <= 0) {
                this.addAlien();
                this.alienTimer = random(10, 15);
            }
        }
    }

    shouldTryToPlaceShip(): boolean {
        return !!this.shipTimer || (!this.ship && this.lives && !this.explosions.length);
    }

    shouldCheckForNextLevel(): boolean {
        return !this.rocks.length && this.lives && !this.explosions.length && !this.alien;
    }

    shouldCheckCollisions(): boolean {
        return !!this.ship || !!this.shipBullets.length || !!this.alien || !!this.alienBullets.length;
    }
}