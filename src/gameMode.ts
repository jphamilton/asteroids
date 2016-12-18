import { Key } from './keys';
import { EventSource } from './events';
import { Collisions } from './collisions';
import screen from './screen';
import { random } from './util';
import { State } from './state';
import { thumpLo, thumpHi } from './sounds';

class Thumper {
    thumpBeatTimer: number;
    thumpBeat: number;
    thumpTimer: number;
    thumpTime: number;
    lo: boolean = true;
    max: boolean;

    constructor() {
        this.reset();
    }

    reset() {
        this.thumpBeatTimer = 0;
        this.thumpBeat = 1;
        this.thumpTimer = 0;
        this.thumpTime = 10;
        this.max = false;
    }

    update(dt: number) {
        const DEC = .2;

        this.thumpTimer += dt;
        this.thumpBeatTimer += dt;

        if (this.thumpBeatTimer >= this.thumpBeat) {
            if (this.lo) {
                thumpLo.play();
            } else {
                thumpHi.play();
            }

            this.lo = !this.lo;
            this.thumpBeatTimer = 0;
        }

        if (!this.max && this.thumpTimer >= this.thumpTime) {
            this.thumpBeat -= DEC;
            
            if (this.thumpBeat <= DEC) {
                this.thumpBeat = DEC;
                this.max = true;
            }
            
            this.thumpTimer = 0;
        }
    }    
}


export class GameMode extends EventSource {

    debug: boolean = false;
    bounds: Rect[] = [];
    thumper: Thumper;

    constructor(private state: State) {
        super();
    }

    init() {
        this.state.addShip(screen.width2, screen.height2);
        this.state.startLevel();
        this.thumper = new Thumper();
    }

    update(dt: number) {
        if (Key.isPressed(Key.DEBUG)) {
            this.debug = !this.debug; 
        }

        if (Key.isPressed(Key.PAUSE)) {
            this.state.paused = !this.state.paused; 
        }
        
        if (Key.isPressed(Key.SPACE)) {
            this.state.hyperspace(); 
        }

        if (this.state.paused) {
            return;
        }

        this.state.levelTimer += dt;
        
        if (this.thumper && this.state.ship) {
            this.thumper.update(dt);
        }

        if (this.state.gameOver) {
            this.state.gameOverTimer += dt;

            if (this.state.gameOverTimer >= 5) {
                this.trigger('done', this.state);
            }
        }

        if (!this.state.started) {
            if (this.state.levelTimer >= 2) {
                this.init();
                this.state.started = true;
            }
            return;
        }

        // alien?
        this.state.updateAlienTimer(dt);

        if (!this.state.gameOver) {
            
            // place ship after crash
            if (this.state.shouldTryToPlaceShip()) { 
                this.state.tryPlaceShip(dt);
            }
            
            // check for next level
            if (this.state.shouldCheckForNextLevel()) {  
                this.state.startLevel();
                this.thumper.reset();
            }

        }

        // game over
        if (!this.state.lives) {  
            this.state.gameOver = true;
        }

        // collisions
        this.checkCollisions();

        // update all objects
        this.state.objects.forEach(obj => {
            if (obj) {
                obj.update(dt);
            }
        });
    }

    render(delta: number) {
        this.renderStatic();

        // if ship then THUMP baby

        this.state.objects.forEach(obj => {
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
        screen.draw.scorePlayer1(this.state.score);

        // high score
        screen.draw.highscore(this.state.highscore);

        // extra lives
        screen.draw.drawExtraLives(this.state.lives);

        // player 1
        if (!this.state.started) {
            screen.draw.player1();
        }

        if (this.state.gameOver) {
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

        if (!this.state.ship && this.state.lives) {
            let rect: Rect = {
                x: screen.width2 - 120,
                y: screen.height2 - 120,
                width: 240,
                height: 240
            }
            
            screen.draw.bounds(rect, '#00ff00');
        }

        if (this.state.ship) {
            screen.draw.text(this.state.ship.angle.toString(), this.state.ship.origin.x + 20, this.state.ship.origin.y + 20, '10pt');
        }

        const date = new Date(null);
        date.setSeconds(this.state.levelTimer);

        screen.draw.text2(date.toISOString().substr(11, 8), '12pt', (width) => {
            return { x: 10, y: screen.height - 40 };
        });
    
    }

    private checkCollisions() {
        const { ship, rocks, shipBullets, alien, alienBullets } = this.state;
        
        if (!this.state.shouldCheckCollisions()) {
            return;
        }

        this.bounds = [];
        
        const collisions = new Collisions();

        collisions.check(shipBullets, rocks, (bullet, rock) => {
            this.state.addScore(rock.score);
            this.state.rockDestroyed(rock);
            bullet.destroy();
        }, (bullet, rock) => {
            if (this.debug) {
                this.bounds.push(rock);
            }
        });

        collisions.check(shipBullets, [alien], (bullet, alien) => {
            this.state.addScore(alien.score)
            this.state.alienDestroyed();
            bullet.destroy();
        }, (bullet, alien) => {
            if (this.debug) {
                this.bounds.push(alien);
            }
        });

        collisions.check([ship], rocks, (ship, rock) => {
            this.state.addScore(rock.score);
            this.state.rockDestroyed(rock);
            this.state.shipDestroyed();
        }, (ship, rock) => {
            if (this.debug) {
                this.bounds.push(rock);
            }
        });

        collisions.check([ship], [alien], (ship, alien) => {
            this.state.addScore(alien.score)
            this.state.alienDestroyed();
            this.state.shipDestroyed();
        }, (ship, alien) => {
            if (this.debug) {
                this.bounds.push(alien);
            }
        });

        collisions.check([alien], rocks, (alien, rock) => {
            this.state.alienDestroyed();
            this.state.rockDestroyed(rock);
        }, (alien, rock) => {
            if (this.debug) {
                this.bounds.push(rock);
            }
        });
        
        collisions.check(alienBullets, rocks, (bullet, rock) => {
            this.state.rockDestroyed(rock);
        }, (bullet, rock) => {
            if (this.debug) {
                this.bounds.push(rock);
            }
        });

        collisions.check(alienBullets, [ship], (bullet, ship) => {
            this.state.shipDestroyed();
            bullet.destroy();
        }, (bullet, ship) => {
            if (this.debug) {
                this.bounds.push(ship);
            }
        });

    }

}