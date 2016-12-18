import { Key } from './keys';
import { EventSource } from './events';
import { Object2D } from './object2d';
import { Ship } from './ship';
import { Alien, BigAlien, SmallAlien } from './alien';
import { Rock, RockSize } from './rocks';
import { Bullet } from './bullet';
import { Explosion } from './explosion';
import { Vector } from './vector';
import { Collisions } from './collisions';
import screen from './screen';
import { highscores } from './highscores';
import { random } from './util';


// class State {
//     level: number = 0;
//     extraLifeScore: number = 0;
//     highscore: number; // Global
//     score: number = 0;
//     lives: number = 3;
    
//     ship: Ship;
//     shipBullets: Bullet[] = [];
//     alien: Alien;
//     alienBullets: Bullet[] = [];
//     explosions: Explosion[] = [];
//     rocks: Rock[] = [];
//     bounds: Rect[] = [];
    
//     shipTimer: number = 0;
//     alienTimer: number = 0;
//     levelTimer: number = 0;
//     gameOverTimer: number = 0;
    
//     gameOver: boolean = false;
//     started: boolean = false;
//     debug: boolean = false;
//     paused: boolean = false;

//     constructor(highscore: number) {
//         this.highscore = highscore;
//     }
// }

// manages game objects, score, collisions, etc.
// todo: refactor this to a Player class, leaving common stuff like score
export class GameMode extends EventSource {

    level: number = 0;
    extraLifeScore: number = 0;
    highscore: number;
    score: number = 0;
    lives: number = 3;
    
    ship: Ship;
    shipBullets: Bullet[] = [];
    alien: any;
    alienBullets: Bullet[] = [];
    explosions: Explosion[] = [];
    rocks: Rock[] = [];
    bounds: Rect[] = [];
    
    shipTimer: number = 0;
    alienTimer: number = 0;
    levelTimer: number = 0;
    gameOverTimer: number = 0;
    
    gameOver: boolean = false;
    started: boolean = false;
    debug: boolean = false;
    paused: boolean = false;

    constructor() {
        super();
        this.highscore = highscores.top.score;
        //this.init();
    }

    init() {
        this.addShip(screen.width2, screen.height2);
        this.startLevel();
    }

    startLevel() {
        this.level++;
        this.levelTimer = 0;
        this.alienTimer = random(10, 15);
        this.addRocks();
    }

    update(dt: number) {
        if (Key.isPressed(Key.DEBUG)) {
            this.debug = !this.debug; 
        }

        if (Key.isPressed(Key.PAUSE)) {
            this.paused = !this.paused; 
        }
        
        if (Key.isPressed(Key.SPACE)) {
            this.hyperspace(); 
        }

        if (this.paused) {
            return;
        }

        this.levelTimer += dt;
        
        if (this.gameOver) {
            this.gameOverTimer += dt;

            if (this.gameOverTimer >= 5) {
                this.trigger('done', this.score);
            }
        }

        if (!this.started) {
            if (this.levelTimer >= 2) {
                this.init();
                this.started = true;
            }
            return;
        }

        // alien?
        this.updateAlienTimer(dt);

        if (!this.gameOver) {
            
            // place ship after crash
            if (this.shipTimer || (!this.ship && this.lives && !this.explosions.length)) { 
                this.tryPlaceShip(dt);
            }
            
            // check for next level
            if (!this.rocks.length && this.lives && !this.explosions.length && !this.alien) {  
                this.startLevel();
            }

        }
        

        // game over
        //if (!this.lives && !this.explosions.length && !this.alien) {  
        if (!this.lives) {  
            //this.trigger('done', this.score);
            this.gameOver = true;
        }

        // collisions
        this.checkCollisions();

        // update all objects
        const objects = [this.ship, this.alien, ...this.shipBullets, ...this.alienBullets, ...this.rocks, ...this.explosions];

        objects.forEach(obj => {
            if (obj) {
                obj.update(dt);
            }
        });
    }

    render(delta: number) {
        this.renderStatic();

        // render all objects
        const objects = [this.ship, this.alien, ...this.shipBullets, ...this.alienBullets, ...this.rocks, ...this.explosions];

        objects.forEach(obj => {
            if (obj) {
                obj.render();
            }
        });
    }

    private renderStatic() {
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

        // player 1
        if (!this.started) {
            screen.draw.player1();
        }

        if (this.gameOver) {
            screen.draw.gameOver();
        }

        // debug stuff
        if (this.debug) {
            this.renderDebug();
        }
    }

    private renderDebug() {
        screen.draw.text2('debug mode', '12pt', (width) => {
            return { x: screen.width - width - 10, y: screen.height - 40 };
        });

        if (this.bounds) {
            this.bounds.forEach(r => {
                screen.draw.bounds(r, '#fc058d');
            });
        }

        if (!this.ship && this.lives) {
            let rect: Rect = {
                x: screen.width2 - 120,
                y: screen.height2 - 120,
                width: 240,
                height: 240
            }
            
            screen.draw.bounds(rect, '#00ff00');
        }

        if (this.ship) {
            screen.draw.text(this.ship.angle.toString(), this.ship.origin.x + 20, this.ship.origin.y + 20, '10pt');
        }

        const date = new Date(null);
        date.setSeconds(this.levelTimer);

        screen.draw.text2(date.toISOString().substr(11, 8), '12pt', (width) => {
            return { x: 10, y: screen.height - 40 };
        });
    
    }

    private drawExtraLives() {
        const lives = Math.min(this.lives, 10);
        let life = new Ship(0, 0);
        for(let i = 0; i < lives; i++) {
            life.origin.x = 80 + (i * 20);
            life.origin.y = 55;
            life.render();
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

    addShip(x: number, y: number) {
        this.ship = new Ship(x, y);
        
        this.ship.on('fire', (ship, bullet) => {

            bullet.on('expired', () => {
                this.shipBullets = this.shipBullets.filter(x => x !== bullet);
            });

            this.shipBullets.push(bullet);
        });
    }

    private shipDestroyed() {
        this.createExplosion(this.ship.origin.x, this.ship.origin.y);
        this.lives--;
        this.ship = null;
        this.shipBullets = [];
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

    private checkCollisions() {
        const check = !!this.ship || !!this.shipBullets.length || !!this.alien || !!this.alienBullets.length;

        if (!check) {
            return;
        }

        this.bounds = [];
        
        const collisions = new Collisions();

        collisions.check([this.ship], this.rocks, (ship, rock) => {
            this.addScore(rock.score);
            this.rockDestroyed(rock);
            this.shipDestroyed();
        }, (ship, rock) => {
            if (this.debug) {
                this.bounds.push(rock);
            }
        });

        collisions.check(this.shipBullets, this.rocks, (bullet, rock) => {
            this.addScore(rock.score);
            this.rockDestroyed(rock);
            bullet.destroy();
        }, (bullet, rock) => {
            if (this.debug) {
                this.bounds.push(rock);
            }
        });

        collisions.check(this.shipBullets, [this.alien], (bullet, alien) => {
            this.addScore(alien.score)
            this.alienDestroyed();
            bullet.destroy();
        }, (bullet, alien) => {
            if (this.debug) {
                this.bounds.push(alien);
            }
        });

        collisions.check([this.ship], [this.alien], (ship, alien) => {
            this.addScore(alien.score)
            this.alienDestroyed();
            this.shipDestroyed();
        }, (ship, alien) => {
            if (this.debug) {
                this.bounds.push(alien);
            }
        });

        collisions.check(this.alienBullets, this.rocks, (bullet, rock) => {
            this.rockDestroyed(rock);
        }, (bullet, rock) => {
            if (this.debug) {
                this.bounds.push(rock);
            }
        });

        collisions.check(this.alienBullets, [this.ship], (bullet, ship) => {
            this.shipDestroyed();
            bullet.destroy();
        }, (bullet, ship) => {
            if (this.debug) {
                this.bounds.push(ship);
            }
        });

        collisions.check([this.alien], this.rocks, (alien, rock) => {
            this.alienDestroyed();
            this.rockDestroyed(rock);
        }, (alien, rock) => {
            if (this.debug) {
                this.bounds.push(rock);
            }
        });
    }

    private addScore(score) {
        this.score += score;
        this.extraLifeScore += score;

        if (this.score > this.highscore) {
            this.highscore = this.score;
        }

        if (this.extraLifeScore >= 10000) {
            this.lives++;
            this.extraLifeScore = 0;
        }
    }

    private addAlien() {
        const lvl = Math.min(this.level, 7);

        if (this.score > 40000) {
        
            this.alien = new SmallAlien(this.ship);
        
        } else {

            if (lvl === 1) {
                if (this.levelTimer < 90) {
                    this.alien = new BigAlien();
                } else {
                    if (random(1,3) % 2 === 0) {
                        this.alien = new SmallAlien(this.ship);
                    } else {
                        this.alien = new BigAlien();
                    }
                }

            } else {
                // come up with rules later
                this.alien = new BigAlien();
            } 
        }

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

    private hyperspace() {
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
}