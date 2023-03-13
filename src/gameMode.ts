import { Sound } from './sounds';
import { EventSource } from './events';
import { Object2D } from './object2D';
import { Collisions } from './collisions';
import screen from './screen';
import { World } from './world';
import { Thumper } from './thump';
import Global from './global';

export class GameMode extends EventSource implements IGameState {

    bounds: Object2D[] = [];
    thumper: Thumper;

    private lastCollisions: Collisions;

    constructor(private world: World) {
        super();
    }

    init() {
        Sound.on();
        this.world.addShip(screen.width2, screen.height2);
        this.world.startLevel();
        this.thumper = new Thumper();
    }

    update(dt: number) {
        
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
        this.lastCollisions = this.checkCollisions(dt);

        // alien?
        this.world.updateAlienTimer(dt);

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
        if (Global.paused) {
            return;
        }
        
        this.renderStatic();

        this.world.render(delta);
    }

    private renderStatic() {
        screen.draw.background();
        screen.draw.copyright();
        screen.draw.scorePlayer1(this.world.score);
        screen.draw.highscore(this.world.highscore);
        screen.draw.drawExtraLives(this.world.lives);

        // remaining shields
        if (this.world.ship) {
            screen.draw.vectorline(40, 80, 140, 80, `rgba(255,255,255,.4)`);
            screen.draw.vectorline(40, 80, 40 + this.world.ship.shield * 100, 80, `rgba(255,255,255,.6)`);
        }

        // player 1
        if (!this.world.started) {
            screen.draw.player1();
        }

        if (this.world.gameOver) {
            screen.draw.gameOver();
        }

        // debug stuff
        if (Global.debug) {
            this.renderDebug();
        }

        if (Global.god) {
            screen.draw.text2('god', screen.font.small, (width) => {
                return { x: screen.width - width - 10, y: screen.height - 80 };
            });
        }
    }

    private renderDebug() {
        
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
            screen.draw.text(this.world.ship.velocity.x.toString(), this.world.ship.origin.x + 20, this.world.ship.origin.y + 40, 10);
            screen.draw.text(this.world.ship.velocity.y.toString(), this.world.ship.origin.x + 20, this.world.ship.origin.y + 60, 10);
        }

        const date = new Date(null);
        date.setSeconds(this.world.levelTimer);

        screen.draw.text2(date.toISOString().substr(11, 8), screen.font.small, (width) => {
            return { x: 10, y: screen.height - 40 };
        });

        if (this.lastCollisions) {
            screen.draw.quadtree(this.lastCollisions.tree);
        }
    
    }

    private checkCollisions(dt: number) {
        const { ship, rocks, shipBullets, alien, alienBullets, shockwaves } = this.world;
        
        if (!this.world.shouldCheckCollisions()) {
            return;
        }

        this.bounds.length = 0;

        const collisions = new Collisions();

        collisions.bulletCheck(shipBullets, rocks, (bullet, rock) => {
            this.world.shake();
            this.world.addScore(rock);
            this.world.rockDestroyed(rock);
            bullet.destroy();
        }, (bullet1, bullet2, rock) => {
            if (Global.debug) {
                this.bounds.push(rock);
            }
        });

        collisions.bulletCheck(shipBullets, [alien], (bullet, alien) => {
            this.world.shake();
            this.world.addScore(alien)
            this.world.alienDestroyed();
            bullet.destroy();
        }, (bullet1, bullet2, alien) => {
            if (Global.debug) {
                this.bounds.push(alien);
            }
        });

        // shockwaves can break rocks
        let cowboys = []; 
        shockwaves.filter(x => x.rocks.length).forEach(y => cowboys.push(...y.rocks));
        
        if (cowboys.length) {
            let indians = this.world.rocks.filter(x => cowboys.indexOf(x) < 0);
            collisions.check(cowboys, indians, false, (cowboy, indian) => {
                this.world.addScore(cowboy);
                this.world.addScore(indian);
                this.world.rockDestroyed(cowboy);
                this.world.rockDestroyed(indian);
            });
        }

        if (!Global.god) {
            collisions.check([ship], rocks, true, (ship, rock) => {
                this.world.shake();
                this.world.addScore(rock);
                this.world.rockDestroyed(rock);

                ship.shield -= .25;
                
                if (ship.shield <= 0) {
                    this.world.shipDestroyed();
                }
                
            }, (ship, rock) => {
                if (Global.debug) {
                    this.bounds.push(rock);
                }
            });

            collisions.check([ship], [alien], true, (ship, alien) => {
                this.world.shake();
                this.world.addScore(alien);
                this.world.alienDestroyed();
                
                ship.shield -= .5;

                if (ship.shield <= 0) {
                    this.world.shipDestroyed();
                }

            }, (ship, alien) => {
                if (Global.debug) {
                    this.bounds.push(alien);
                }
            });

            collisions.check(alienBullets, [ship], true, (bullet, ship) => {
                this.world.shake();
                ship.shield -= 1;

                if (ship.shield <= 0) {
                    this.world.shipDestroyed();
                }

                bullet.destroy();
            }, (bullet, ship) => {
                if (Global.debug) {
                    this.bounds.push(ship);
                }
            });
        }

        collisions.check([alien], rocks, false, (alien, rock) => {
            this.world.shake();
            this.world.alienDestroyed();
            this.world.rockDestroyed(rock);
        }, (alien, rock) => {
            if (Global.debug) {
                this.bounds.push(rock);
            }
        });
        
        collisions.check(alienBullets, rocks, false, (bullet, rock) => {
            this.world.shake();
            this.world.rockDestroyed(rock);
        }, (bullet, rock) => {
            if (Global.debug) {
                this.bounds.push(rock);
            }
        });

        return collisions;
    }


}