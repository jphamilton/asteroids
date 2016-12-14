import { Key } from './keys';
import { Object2D } from './object2d';
import { Ship } from './ship';
import { Rock, RockSize } from './rocks';
import { Bullet } from './bullet';
import { Explosion } from './explosion';
import { Vector } from './vector';
import { Quadtree } from './quadtree';
import screen from './screen';
import { highscores } from './highscores';
import { random } from './util';

// manages game objects, score, collisions, etc.
// todo: refactor this to a Player class, leaving common stuff like score
export class GameState {

    level: number = 1;
    score: number = 0;
    lives: number = 3;
    
    ship: Ship;
    shipBullets: Bullet[] = [];
    explosions: Explosion[] = [];    
    extraLives: Object2D[] = [];
    highscore: number;
    
    debug: boolean = false;
    paused: boolean = false;
    qt: Quadtree;

    rocks: Rock[] = [];
    bounds: Rect[] = [];

    shipTimer: number = 0;

    constructor() {
        this.highscore = highscores.length ? highscores[0].score : 0;
        this.init();
    }

    init() {
        this.qt = new Quadtree(screen);

        this.addShip();

        for(let i = 0; i < this.lives; i++) {
            let life = new Ship(80 + (i * 20), 55);
            this.extraLives.push(life);
        }

        this.addRocks();
    }

    addShip() {
        this.ship = new Ship(screen.width2, screen.height2);
        
        this.ship.on('fire', (ship, bullet) => {

            bullet.on('expired', () => {
                this.shipBullets = this.shipBullets.filter(x => x !== bullet);
            });

            this.shipBullets.push(bullet);
        });
    }

    update(dt: number) {
        if (Key.isPressed(Key.DEBUG)) {
            this.debug = !this.debug; 
        }

        if (Key.isPressed(Key.PAUSE)) {
            this.paused = !this.paused; 
        }
        
        if (this.paused) {
            return;
        }

        // place ship after crash
        if (this.shipTimer || (!this.ship && this.lives && !this.explosions.length)) { // need to check for aliens later
            this.tryPlaceShip(dt);
        }
        
        // check for next level
        if (!this.rocks.length && this.lives && !this.explosions.length) { // need to check for aliens later
            this.level++;
            this.addRocks();
        }
        
        this.checkCollisions();

        const objects = [this.ship, ...this.shipBullets, ...this.rocks, ...this.explosions];

        objects.forEach(obj => {
            if (obj) {
                obj.update(dt);
            }
        });
    }

    render(delta: number) {
        this.renderBackground();

        // render objects
        const objects = [this.ship, ...this.shipBullets, ...this.rocks, ...this.explosions];

        objects.forEach(obj => {
            if (obj) {
                obj.render();
            }
        });

    }

    private renderBackground() {
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

        // debug stuff
        if (this.debug) {
            
            screen.draw.text2('debug mode', '12pt', (width) => {
                return { x: screen.width - width - 10, y: screen.height - 40 };
            });

            if (this.debug && this.bounds) {
                screen.draw.quadtree(this.qt);                

                this.bounds.forEach(r => {
                    screen.draw.bounds(r, '#fc058d');
                });
            }

            if (!this.ship && this.lives) {
                let rect: Rect = {
                    x: screen.width2 - 80,
                    y: screen.height2 - 80,
                    width: 160,
                    height: 160
                }

                
                screen.draw.bounds(rect, '#00ff00');
            }

        }
    }

    private drawExtraLives() {
        const lives = Math.min(this.lives, 10);
        for(let i = 0; i < lives; i++) {
            let life = this.extraLives[i];
            life.render();
        }
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

    private shipDestroyed() {
        this.lives--;
        this.ship = null;
    }

    private checkCollisions() {
        const check = !!this.ship || !this.shipBullets;

        if (!check) {
            return;
        }

        this.bounds = [];
        
        this.qt = new Quadtree(screen);

        // add rocks
        this.rocks.forEach(rock => {
            if (this.ship) {
                this.qt.insert(rock);
            }
        });

        // check ship to rock collisions
        let rocks = <Rock[]>this.qt.retrieve(this.ship);
        
        rocks.forEach(rock => {
            if (rock.collided(this.ship)) {
                this.createExplosion(this.ship.origin.x, this.ship.origin.y);
                this.createExplosion(rock.origin.x, rock.origin.y);
                this.scoreRock(rock);
                this.splitRock(rock);
                this.shipDestroyed();
            } 

            if (this.debug) {
                this.bounds.push(rock);
            }
        });

        // check ship bullet to rock collisions
        this.shipBullets.forEach(bullet => {
            let rocks = [];
            rocks.push(...this.qt.retrieve(bullet));
            
            rocks.forEach(rock => {
                if (rock.collided(bullet)) {
                    this.createExplosion(rock.origin.x, rock.origin.y);
                    this.scoreRock(rock);
                    bullet.expire();
                    this.splitRock(rock);
                } 

                if (this.debug) {
                    this.bounds.push(rock);
                }
            });

            if (this.debug) {
                this.bounds.push(...rocks, this.ship);
            }

        });
    }

    private scoreRock(rock: Rock) {
        this.score += rock.size === RockSize.Large ? 20 : rock.size === RockSize.Medium ? 50 : 100;
    }
    
    private splitRock(rock: Rock) {
        this.rocks = this.rocks.filter(x => x !== rock);
        this.rocks.push(...rock.split());
        rock = null;
    }

    private createExplosion(x: number, y: number) {
        const explosion = new Explosion(x, y);

        explosion.on('expired', ()=> {
            this.explosions = this.explosions.filter(x => x !== explosion);
        });

        this.explosions.push(explosion);
    }

    private tryPlaceShip(dt) {
        this.shipTimer += dt;

        if (this.shipTimer <= 2) {
            return;
        }

        let rect: Rect = {
            x: screen.width2 - 80,
            y: screen.height2 - 80,
            width: 160,
            height: 160
        }

        let collided = false;

        this.rocks.forEach(rock => {
            collided = collided || rock.collided(rect);
        });

        if (!collided) {
            this.shipTimer = 0;
            this.addShip();
        }

    }
}