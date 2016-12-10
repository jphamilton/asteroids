import screen from './screen';
import { Key } from './keys';
import { highscores } from './highscores';
import { Object2D } from './object2d';
import { Bullet } from './bullet';
import { Rock, RockSize } from './rocks';
import { BigAlien } from './alien';
import { Quadtree } from './quadtree';

export class DemoState {

    blink: number = 0;
    showPushStart: boolean = true;
    highscore: number;
    modeTimer: number = 0;
    alienTimer: number = 0;
    rocks: Object2D[];
    alienBullets: Bullet[] = [];
    alien: BigAlien;
    debug: boolean = false;
    qt: Quadtree;
    bounds: Rect[] = [];

    constructor() {
        this.highscore = highscores.length ? highscores[0].score : 0;

        // rocks in demo mode always start out at the same place
        let rock1 = new Rock(20, screen.height - 40, RockSize.Large);
        rock1.vx = 2;
        rock1.vy = -2;

        let rock2 = new Rock(screen.width - 40, 40, RockSize.Large);
        rock2.vx = -2;
        rock2.vy = 1;

        let rock3 = new Rock(screen.width - 80, screen.height - 80, RockSize.Large);
        rock3.vx = 1;
        rock3.vy = -1.5;

        let rock4 = new Rock(screen.width - 80, screen.height - 120, RockSize.Large);
        rock4.vx = -1;
        rock4.vy = 1.5;

        this.rocks = [rock1, rock2, rock3, rock4];
    }

    update(step) {
        if (Key.isPressed(Key.DEBUG)) {
            this.debug = !this.debug; 
        }

        if (!this.alien) {
            this.alienTimer += step;
        }

        if (this.alienTimer >= 7) {
            this.alien = new BigAlien(0, 0);

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

        this.blink += step;

        if (this.blink >= .4) {
            this.blink = 0;
            this.showPushStart = !this.showPushStart;
        }

        this.updateDemo(step);
    }

    render(step) {
        
        this.renderDemo();
        
        if (this.debug) {
            screen.draw.text2('debug mode', '12pt', (width) => {
                return { x: screen.width - width - 10, y: screen.height - 40 };
            });
        }
    }

    private updateDemo(step) {
        // check for collisions
        const check = this.alien;

        if (check) {
            this.bounds = [];
            this.qt = new Quadtree(
                {x: 0, y: 0, width: screen.width, height: screen.height}, 
                Math.floor(this.rocks.length / 4));
        }

        this.rocks.forEach(rock => {
            if (check) {
                this.qt.insert(rock.rect);
            }
            rock.update(step);
        });

        if (this.alien) {
            if (check) {
                this.bounds = this.qt.retrieve(this.alien.rect);
            }
            this.alien.update(step);
        }

        this.alienBullets.forEach(bullet => {
            if (check) {
                this.bounds.push(...this.qt.retrieve(bullet.rect));
            }
            bullet.update(step);
        });
    }

    private renderDemo() {
        this.drawBackground();
        this.drawPushStart();

        this.rocks.forEach(rock => {
            rock.render();
            
            if (this.debug) {
                screen.draw.bounds(rock.rect);
            }

        });

        if (this.alien) {
            this.alien.render();

            if (this.debug) {
                screen.draw.bounds(this.alien.rect);
            }
        }

        this.alienBullets.forEach(bullet => {
            bullet.render();
        });

        if (this.debug) {
            this.bounds.forEach(r => screen.draw.bounds(r, '#fc058d'));
            this.bounds = [];
        }
    }

    private drawBackground() {
        screen.draw.background();
        screen.draw.scorePlayer1(0);
        screen.draw.highscore(this.highscore);
        screen.draw.copyright();
    }

    private drawPushStart() {
        let screenX = screen.width / 2;

        if (this.showPushStart) {
            screen.draw.text2('push start', '30pt', (width) => {
                return {
                    x: screenX - (width / 2),
                    y: 120
                }
            });
        }
    }

}