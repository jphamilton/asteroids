import screen from './screen';
import { random } from './util';
import { highscores } from './highscores';
import { Key } from './keys';
import { Object2D } from './object2d';
import { Bullet } from './bullet';
import { Rock, RockSize } from './rocks';
import { BigAlien } from './alien';
import { Explosion } from './explosion';
import { Quadtree } from './quadtree';
import { Vector } from './vector';

export class DemoState {

    blinkTimer: number = 0;
    modeTimer: number = 0;
    alienTimer: number = 0;
    showPushStart: boolean = true;
    highscore: number;
    rocks: Object2D[] = [];
    explosions: IGameState[] = [];
    alienBullets: Bullet[] = [];
    alien: BigAlien;
    debug: boolean = false;
    qt: Quadtree;
    bounds: Rect[];
    paused: boolean = false;
    level: number = 1;

    constructor() {
        this.highscore = highscores.length ? highscores[0].score : 0;
        this.addRocks();
    }

    update(dt) {
        if (Key.isPressed(Key.DEBUG)) {
            this.debug = !this.debug; 
        }

        if (Key.isPressed(Key.PAUSE)) {
            this.paused = !this.paused; 
        }
        
        if (this.paused) {
            return;
        }

        if (!this.alien && !this.rocks.length) {
            this.level++;
            this.addRocks();
        }
        
        this.updateAlienTimer(dt);
        this.pushStart(dt);
        this.checkCollisions();
        this.updateAllObjects(dt);
    }

    updateAlienTimer(dt: number) {
        if (!this.alien) {
            this.alienTimer += dt;
        }

        if (this.alienTimer >= 7) {
            this.createBigAlien();
        }
    }

    pushStart(dt: number) {
        this.blinkTimer += dt;

        if (this.blinkTimer >= .4) {
            this.blinkTimer = 0;
            this.showPushStart = !this.showPushStart;
        }
    }

    checkCollisions() {
        if (this.alien) {
            this.bounds = [];
            this.qt = new Quadtree(
                {x: 0, y: 0, width: screen.width, height: screen.height}, 
                1
            );
        }

        this.rocks.forEach(rock => {
            if (this.alien) {
                this.qt.insert(rock);
            }
        });

        this.checkAlienCollision();
        this.checkAlienBulletCollision();
    }

    checkAlienCollision() {
        if (this.alien) {
            let rocks = <Rock[]>this.qt.retrieve(this.alien);
            
            rocks.forEach(rock => {
                if (rock.collided(this.alien)) {
                    this.createExplosion(this.alien.origin.x, this.alien.origin.y);
                    this.createExplosion(rock.origin.x, rock.origin.y);
                    this.splitRock(rock, this.alien);
                    this.alien = null;
                    this.alienBullets = [];
                } 

                if (this.debug) {
                    this.bounds.push(rock);
                }
            });
        }
    }
    
    checkAlienBulletCollision() {
        this.alienBullets.forEach(bullet => {
            let rocks = [];
            
            if (this.alien) {
                rocks.push(...this.qt.retrieve(bullet));
                rocks.forEach(rock => {
                    if (rock.collided(bullet)) {
                        this.createExplosion(rock.origin.x, rock.origin.y);
                        this.alienBullets = this.alienBullets.filter(x => x !== bullet);
                        this.splitRock(rock, bullet);
                        bullet = null;
                    } 

                    if (this.debug) {
                        this.bounds.push(rock);
                    }
                });
            }

            if (this.debug) {
                this.bounds.push(...rocks);
            }

        });
    }

    updateAllObjects(dt: number) {
        let objects = [this.alien, ...this.rocks, ...this.alienBullets, ...this.explosions];
        
        objects.forEach(obj => {
            if (obj) {
                obj.update(dt);
            }
        })
    }

    render() {
        this.drawBackground();
        this.drawPushStart();

        let objects = [...this.rocks, this.alien, ...this.alienBullets, ...this.explosions];
        
        objects.forEach(obj => {
            if (obj) {
                obj.render();
            }
        });

        if (this.alien && this.debug) {
            this.drawQuadtree();
            this.bounds.forEach(r => {
                screen.draw.bounds(r, '#fc058d');
            });
        }

        this.bounds = [];
        
        if (this.debug) {
            screen.draw.text2('debug mode', '12pt', (width) => {
                return { x: screen.width - width - 10, y: screen.height - 40 };
            });
        }
    }

    private addRocks() {
        const count = Math.min(this.level + 3, 7);
        const speed = 200;

        for(let i = 0; i < count; i++) {
            const v = new Vector(random(1, 360));
            const x = random(40, screen.width - 40); 
            const y = random(40, screen.height - 40); 
            const rock = new Rock(x, y, v, RockSize.Large, speed);
            this.rocks.push(rock);
        } 
    }

    private createBigAlien() {
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
        let explosion = new Explosion(x, y);

        explosion.on('expired', ()=> {
            this.explosions = this.explosions.filter(x => x !== explosion);
            explosion = null;
        });

        this.explosions.push(explosion);
    }

    private splitRock(rock: Rock, obj: Object2D) {
        this.rocks = this.rocks.filter(x => x !== rock);
        this.rocks.push(...rock.split(obj));
        rock = null;
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

    private drawQuadtree() {
        if (this.qt) {
            let drawNodes = (nodes: Quadtree[]) => {
                if (!nodes) {
                    return;
                }
                nodes.forEach(n => {
                    screen.draw.bounds(n.bounds);
                    drawNodes(n.nodes);
                });
            }

            drawNodes(this.qt.nodes);
        }
    }
}