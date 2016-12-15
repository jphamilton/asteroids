import screen from './screen';
import { random } from './util';
import { Object2D } from './object2d';
import { Ship } from './ship';
import { Bullet } from './bullet';
import { Vector } from './vector';

const BULLET_SPEED: number = 600;
const BIG_ALIEN_SPEED: number = 225;
const SMALL_ALIEN_SPEED: number = 300;


abstract class Alien extends Object2D {

    moveTimer: number = 0;
    bulletTimer: number = .7;
    moveTime: number = 2;
    
    abstract score: number;
    abstract fire(): void;

    constructor(speed) {
        super(0, 0);

        this.vy = 0;

        this.origin.y = random(100, screen.height - 100);
        
        if (this.origin.y % 2 === 0) {
            this.origin.x = 40;
            this.vx = speed;
        } else {
            this.origin.x = screen.width - 40;
            this.vx = -speed;
        }

        this.points = [
            { x: .5, y: -2},
            { x: 1, y: -1},
            { x: 2.5, y: 0},
            { x: 1, y: 1},
            { x: -1, y: 1},
            { x: -2.5, y: 0},
            { x: -1, y: -1},
            { x: -.5, y: -2},
            { x: .5, y: -2}
        ];
    }

    update(dt: number) {
        this.move(dt);
        
        if (this.origin.x >= screen.width - 5 || this.origin.x <= 5) {
            this.trigger('expired');
            return;
        }

        // direction changes
        this.moveTimer += dt;
        
        if (this.moveTimer >= 1 && this.vy !== 0) {
            this.vy = 0;
            this.moveTimer = 0;
        }

        if (this.moveTimer >= this.moveTime) {
            let move = random(1, 20) % 2 === 0;
            
            if (move) {
                this.vy = this.origin.x % 2 === 0 ? this.vx : -this.vx;   
            }
            
            this.moveTimer = 0;
            this.moveTime++;
        }

        // firing 
        this.bulletTimer += dt;

        if (this.bulletTimer >= .7) {
            this.fire();
        }

    }

    render() {
        this.draw();
    }
    
    draw() {
        super.draw();
        screen.draw.shape([this.points[1], this.points[6]], this.origin.x, this.origin.y);
        screen.draw.shape([this.points[2], this.points[5]], this.origin.x, this.origin.y);
    }
}

// Mr. Bill
export class BigAlien extends Alien {

    score: number = 200;

    constructor() {
        super(BIG_ALIEN_SPEED);
        this.scale(7);
    }

    fire() {
        const v = new Vector(random(1, 360), BULLET_SPEED);
        const bullet = new Bullet(this.origin.x, this.origin.y, v);
        this.trigger('fire', bullet);
        this.bulletTimer = 0;
    }
}

// Sluggo
export class SmallAlien extends Alien {

    score: number = 1000;

    constructor(private ship: Ship) {
        super(SMALL_ALIEN_SPEED);
        this.scale(5);
    }

    fire() {
        if (this.ship) {
            // target ship

        } else {
            // random fire
            const v = new Vector(random(1, 360), BULLET_SPEED);
            const bullet = new Bullet(this.origin.x, this.origin.y, v);
            this.trigger('fire', bullet);
            this.bulletTimer = 0;
        }
    }
}
            
            
            
