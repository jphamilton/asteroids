import { Ship } from './ship';
import { Bullet } from './bullet';
import { Alien, SmallAlien, BigAlien } from './alien';
import { Explosion } from './explosion';
import { Shockwave } from './shockwave';
import { Flash } from './flash';
import { Achievement } from './achievement';
import { Rock, createRocks } from './rocks';
import { ScoreMarker } from './scoreMarker';
import { SlowMoTimer } from './slowMoTimer';
import { Object2D } from './object2d';
import { random } from './util';
import screen from './screen';
import { smallAlien, largeAlien, alienFire, largeExplosion, extraLife } from './sounds';

const EXTRA_LIFE = 10000;
const SHAKE_TIME = .5;

export class World {
    level: number = 0;
    extraLifeScore: number = 0;
    highscore: number; 
    score: number = 0;
    lives: number = 3; 
    
    ship: Ship;
    shipBullets: Bullet[] = [];
    alien: Alien;
    alienBullets: Bullet[] = [];
    shockwaves: Shockwave[] = [];
    rocks: Rock[] = [];

    // things with no collision detection - markers, explosions, flash, etc.
    scenery: IGameState[] = [];

    shipTimer: number = 0;
    alienTimer: number = 0;
    levelTimer: number = 0;
    gameOverTimer: number = 0;
    shakeTimer: number = 0;
    slowMoTimer: SlowMoTimer = null;
    private activeExplosions = 0;
    private peakExplosions = 0;
    private explosionThreshold = 10;
    private explosionScores: { score: number }[] = [];

    gameOver: boolean = false;
    started: boolean = false;

    constructor(highscore: number) {
        this.highscore = highscore;
    }

    get objects(): any {
        return [this.ship, this.alien, ...this.shipBullets, ...this.alienBullets, ...this.rocks, ...this.shockwaves, ...this.scenery];
    }

    update(dt: number) {
        
        if (this.slowMoTimer) {
            dt = this.slowMoTimer.adjust(dt);
        }

        // shaky cam
        if (this.shakeTimer > 0) {
            this.shakeTimer -= dt;
        }

        this.objects.forEach(obj => {
            if (obj) {
                obj.update(dt);
            }
        });
    }
    
    render(dt?: number) {
        if (this.shakeTimer > 0) {
            screen.preShake();
        }

        this.objects.forEach(obj => {
            if (obj) {
                obj.render(dt);
            }
        });

        if (this.shakeTimer > 0) {
            screen.postShake();
        }
    }

    startLevel() {
        this.level++;
        this.levelTimer = 0;

        if (!this.alienTimer) {
            this.alienTimer = random(10, 15);
        }
        
        this.scenery.length = 0;
        this.shipBullets.forEach(bullet => bullet.destroy());

        this.addRocks();
    }

    private addRocks() {
        this.rocks = createRocks(this.level);
    }

    addShip(x: number, y: number) {
        this.ship = new Ship(x, y);
        
        this.ship.on('fire', (ship, bullet) => {

            bullet.on('expired', () => {
                this.shipBullets = this.shipBullets.filter(x => x !== bullet);
            });

            this.shipBullets.push(bullet);
        });

        this.ship.on('expired', () => {
            this.lives--;
            this.ship = null;
            this.shipBullets.length = 0;
        });
    }

    createExplosion(obj: Object2D, size: number = 100, multiplier: number = 1): { explosion: Explosion, shockwave: Shockwave } {
        if (!obj) {
            return;
        }
        
        const explosion = new Explosion(obj.origin.x, obj.origin.y, size);
        const entry = { score: obj.score };
        this.explosionScores.push(entry);
        this.activeExplosions++;

        if (this.activeExplosions > this.peakExplosions) {
            this.peakExplosions = this.activeExplosions;

            if (this.peakExplosions > this.explosionThreshold) {
                const bonus = this.explosionScores.reduce((sum, item) => sum + item.score, 0) * 5;
                this.setSlowMo(.25, 4);

                const achievement = new Achievement('MASSIVE DAMAGE', bonus);
                this.addScenery(achievement);
                this.addScore(achievement);

                this.explosionThreshold += 10;
            }
        }

        explosion.on('expired', () => {
            this.activeExplosions = Math.max(0, this.activeExplosions - 1);
            this.explosionScores = this.explosionScores.filter(item => item !== entry);
        });

        this.addScenery(explosion);

        const shockwave = new Shockwave(obj.origin.x, obj.origin.y, obj.velocity, size, multiplier);

        shockwave.on('expired', () => {
            this.shockwaves = this.shockwaves.filter(x => x !== shockwave);
        });

        this.shockwaves.push(shockwave);

        return {
            explosion,
            shockwave
        }
    }

    setSlowMo(time: number, factor: number) {
        if (!this.slowMoTimer) {
            this.slowMoTimer = new SlowMoTimer(time, factor);
            this.slowMoTimer.on('expired', () => this.slowMoTimer = null);
        }
    }

    shipDestroyed() {
        if (this.ship) {
            largeExplosion.play();
            this.createExplosion(this.ship);
            this.addFlash(5);
            this.ship.destroy();
            this.setSlowMo(.25, 8);

        }
    }

    alienDestroyed() {
        if (this.alien) {
            this.addFlash(5);
            this.createExplosion(this.alien);
            this.alien.destroy();
        }
    }

    addFlash(frames: number) {
        const flash = new Flash(frames);
        this.addScenery(flash);
    }

    addScenery(obj: any) {
        obj.on('expired', () => {
            this.scenery = this.scenery.filter(x => x !== obj);
        });

        this.scenery.push(obj);
    }

    rockDestroyed(rock: Rock, multiplier: number = 1) {
        if (!rock || rock.destroyed) {
            return;
        }

        rock.destroyed = true;

        let boom = this.createExplosion(rock, rock.size * 5, multiplier);
        let debris = rock.split();
        
        this.rocks = this.rocks.filter(x => x !== rock);
        this.rocks.push(...debris);

        this.shockwaves.forEach(shockwave => {
            shockwave.rocks = shockwave.rocks.filter(x => x !== rock);
        });

        boom.shockwave.rocks = debris;
    }

    addAlien() {
        const lvl = Math.min(this.level, 14);
        let little = false;
        let alienSound = largeAlien;

        if (this.score >= 40000) {
            little = true;
        } else {
            switch(lvl) {
                case 7:
                    little = this.levelTimer > 60 && random(1, 3) === 2;
                    break;
                case 8:
                    little = this.levelTimer > 30 && random(1, 10) % 2 === 0; 
                    break;
                default:
                    little = random(1, 10) <= lvl + 2; 
                    break;
            }
        }

        if (little) {
            alienSound = smallAlien;
            this.alien = new SmallAlien(() => this.ship);
        } else {
            this.alien = new BigAlien();
        }

        alienSound.play();
        
        this.alien.on('expired', () => {
            alienFire.stop();
            alienSound.stop();
            largeExplosion.play();
            this.alien = null;
            this.alienBullets.forEach(b => b.destroy());
            this.alienBullets.length = 0; 
        });

        this.alien.on('fire', (alien, bullet: Bullet) => {
            alienFire.play();
            
            bullet.on('expired', () => {
                this.alienBullets = this.alienBullets.filter(x => x !== bullet);
            });

            this.alienBullets.push(bullet);
        });

    }   

    addScore(obj: Object2D) {
        this.score += obj.score;
        this.extraLifeScore += obj.score;

        if (this.score > this.highscore) {
            this.highscore = this.score;
        }

        while (this.extraLifeScore >= EXTRA_LIFE) {
            this.lives++;
            this.extraLifeScore -= EXTRA_LIFE;
            extraLife.play();
        }

        this.addScenery(new ScoreMarker(obj, `${obj.score}`));
    }

    shake() {
        if (this.shakeTimer <= 0.0) {
            this.shakeTimer = SHAKE_TIME;
        }
    }

    tryPlaceShip(dt) {
        this.shipTimer += dt;

        if (this.shipTimer <= 2) {
            return;
        }

        let rect: Rect = screen.shipRect;

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
        return !!this.shipTimer || (!this.ship && !!this.lives);
    }

    shouldCheckForNextLevel(): boolean {
        return !this.rocks.length && !!this.lives;
    }

    shouldCheckCollisions(): boolean {
        return !!this.ship || !!this.shipBullets.length;
    }
}