import { Key } from './keys';
import { EventSource } from './events';
import { Object2D } from './object2D';
import { Collisions } from './collisions';
import screen from './screen';
import { random } from './util';
import { World } from './world';
import { Sound } from './sounds';
import { Thumper } from './thump';

const SHAKE_TIME = .5;

export class GameMode extends EventSource implements IGameState {

    debug: boolean = false;
    bounds: Object2D[] = [];
    thumper: Thumper;
    god: boolean = false;
    shakeTime: number = 0;
    
    constructor(private world: World) {
        super();
    }

    init() {
        this.world.addShip(screen.width2, screen.height2);
        this.world.startLevel();
        this.thumper = new Thumper();
    }

    update(dt: number) {
        if (Key.isPressed(Key.GOD)) {
            this.god = !this.god;
        }

        if (Key.isPressed(Key.DEBUG)) {
            this.debug = !this.debug; 
        }

        if (Key.isPressed(Key.PAUSE)) {
            this.world.paused = !this.world.paused; 
            if (this.world.paused) {
                Sound.off();
            } else {
                Sound.on();
            }
        }
        
        if (this.world.paused) {
            return;
        }
        
        if (Key.isPressed(Key.HYPERSPACE)) {
            this.world.hyperspace(); 
        }

        this.world.levelTimer += dt;
        
        if (this.thumper && this.world.ship) {
            this.thumper.update(dt);
        }

        if (this.world.gameOver) {
            this.world.gameOverTimer += dt;

            if (this.world.gameOverTimer >= 5) {
                this.trigger('done', this.world);
            }
        }

        if (!this.world.started) {
            if (this.world.levelTimer >= 2) {
                this.init();
                this.world.started = true;
            }
            return;
        }

        // collisions
        this.checkCollisions();

        // alien?
        this.world.updateAlienTimer(dt);

        // shaky "cam"
        if (this.shakeTime > 0) {
            this.shakeTime -= dt;
        }

        if (!this.world.gameOver) {
            
            // place ship after crash
            if (this.world.shouldTryToPlaceShip()) { 
                this.world.tryPlaceShip(dt);
            }
            
            // check for next level
            if (this.world.shouldCheckForNextLevel()) {  
                this.world.startLevel();
                this.thumper.reset();
            }

        }

        // game over
        if (!this.world.lives) {  
            this.world.gameOver = true;
        }

        // update all objects
        this.world.update(dt);
    }

    render(delta: number) {
        
        if (this.world.paused) {
            return;
        }
        
        if (this.shakeTime > 0) {
            screen.preShake();
        }

        this.renderStatic();

        this.world.render(delta);

        if (this.shakeTime > 0) {
            screen.postShake();
        }
    }

    private renderStatic() {
        screen.draw.background();
        screen.draw.copyright();
        screen.draw.scorePlayer1(this.world.score);
        screen.draw.highscore(this.world.highscore);
        screen.draw.drawExtraLives(this.world.lives);

        // player 1
        if (!this.world.started) {
            screen.draw.player1();
        }

        if (this.world.gameOver) {
            screen.draw.gameOver();
        }

        // debug stuff
        if (this.debug) {
            this.renderDebug();
        }
    }

    private renderDebug() {
        
        if (this.god) {
            screen.draw.text2('god', screen.font.small, (width) => {
                return { x: screen.width - width - 10, y: screen.height - 80 };
            });
        }
        
        screen.draw.text2('debug mode', screen.font.small, (width) => {
            return { x: screen.width - width - 10, y: screen.height - 40 };
        });

        if (this.bounds) {
            this.bounds.forEach(r => {
                screen.draw.bounds(r, '#fc058d');
            });
        }

        if (!this.world.ship && this.world.lives) {
            let rect: Rect = screen.shipRect;
            screen.draw.bounds(rect, '#00ff00');
        }

        if (this.world.ship) {
            screen.draw.text(this.world.ship.angle.toString(), this.world.ship.origin.x + 20, this.world.ship.origin.y + 20, 10);
        }

        const date = new Date(null);
        date.setSeconds(this.world.levelTimer);

        screen.draw.text2(date.toISOString().substr(11, 8), screen.font.small, (width) => {
            return { x: 10, y: screen.height - 40 };
        });
    
    }

    private setShake() {
        if (this.shakeTime <= 0.0) {
            this.shakeTime = SHAKE_TIME;
        }
    }

    private checkCollisions() {
        const { ship, rocks, shipBullets, alien, alienBullets, shockwaves } = this.world;
        
        if (!this.world.shouldCheckCollisions()) {
            return;
        }

        this.bounds = [];
        
        const collisions = new Collisions();

        collisions.check(shipBullets, rocks, (bullet, rock) => {
            this.setShake();
            this.world.addScore(rock);
            this.world.rockDestroyed(rock);
            bullet.destroy();
        }, (bullet, rock) => {
            if (this.debug) {
                this.bounds.push(rock);
            }
        });

        collisions.check(shipBullets, [alien], (bullet, alien) => {
            this.setShake();
            this.world.addScore(alien)
            this.world.alienDestroyed();
            bullet.destroy();
        }, (bullet, alien) => {
            if (this.debug) {
                this.bounds.push(alien);
            }
        });

        collisions.check(shipBullets, [alien], (bullet, alien) => {
            this.setShake();
            this.world.addScore(alien)
            this.world.alienDestroyed();
            bullet.destroy();
        }, (bullet, alien) => {
            if (this.debug) {
                this.bounds.push(alien);
            } 
        });

        let cowboys = []; 
        
        shockwaves.filter(x => x.rocks.length).forEach(y => cowboys.push(...y.rocks));
        
        let indians = this.world.rocks.filter(x => cowboys.indexOf(x) < 0);

        collisions.check(cowboys, indians, (cowboy, indian) => {
            this.setShake();
            //cowboy.score *= cowboy.multiplier;
            //indian.score *= indian.multiplier;
            //cowboy.multiplier++;
            //indian.multiplier++;
            this.world.addScore(cowboy);
            this.world.addScore(indian);
            this.world.rockDestroyed(cowboy);
            this.world.rockDestroyed(indian);
        });

        /*
        shockwaves.forEach(shockwave => {
            if (shockwave.rocks.length) {
                let cowboys = shockwave.rocks;
                let indians = this.world.rocks.filter(x => cowboys.indexOf(x) < 0);

                collisions.check(cowboys, indians, (cowboy, indian) => {
                    this.shakeTime = SHAKE_TIME;
                    console.log(shockwave.multiplier);
                    cowboy.score *= shockwave.multiplier;
                    indian.score *= shockwave.multiplier;
                    this.world.addScore(cowboy);
                    this.world.addScore(indian);
                    this.world.rockDestroyed(cowboy, shockwave.multiplier++);
                    this.world.rockDestroyed(indian, shockwave.multiplier++);
                });
            }
        });
         */
        
        if (!this.god) {
            collisions.check([ship], rocks, (ship, rock) => {
                this.shakeTime = SHAKE_TIME;
                this.world.addScore(rock);
                this.world.rockDestroyed(rock);
                this.world.shipDestroyed();
            }, (ship, rock) => {
                if (this.debug) {
                    this.bounds.push(rock);
                }
            });

            collisions.check([ship], [alien], (ship, alien) => {
                this.shakeTime = SHAKE_TIME;
                this.world.addScore(alien);
                this.world.alienDestroyed();
                this.world.shipDestroyed();
            }, (ship, alien) => {
                if (this.debug) {
                    this.bounds.push(alien);
                }
            });

            collisions.check(alienBullets, [ship], (bullet, ship) => {
                this.shakeTime = SHAKE_TIME;
                this.world.shipDestroyed();
                bullet.destroy();
            }, (bullet, ship) => {
                if (this.debug) {
                    this.bounds.push(ship);
                }
            });
        }

        collisions.check([alien], rocks, (alien, rock) => {
            this.shakeTime = SHAKE_TIME;
            this.world.alienDestroyed();
            this.world.rockDestroyed(rock);
        }, (alien, rock) => {
            if (this.debug) {
                this.bounds.push(rock);
            }
        });
        
        collisions.check(alienBullets, rocks, (bullet, rock) => {
            this.shakeTime = SHAKE_TIME;
            this.world.rockDestroyed(rock);
        }, (bullet, rock) => {
            if (this.debug) {
                this.bounds.push(rock);
            }
        });
    }


}