import screen from './screen';
import { Object2D } from './object2d';
import { Bullet } from './bullet';
import { random } from './util';

const BULLET_SPEED: number = 600;
const VELOCITY: number = 75;
const BIG_ALIEN_SPEED: number = 225;

export class BigAlien extends Object2D {

    moveTimer: number = 0;
    bulletTimer: number = .7;
    moveTime: number = 2;
    
    constructor() {
        super(0, 0);

        this.vy = 0;

        this.origin.y = random(100, screen.height - 100);
        
        if (this.origin.y % 2 === 0) {
            this.origin.x = 40;
            this.vx = BIG_ALIEN_SPEED;
        } else {
            this.origin.x = screen.width - 40;
            this.vx = -BIG_ALIEN_SPEED;
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

        this.scale(7);
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
            let bullet = new Bullet(this.origin.x, this.origin.y, random(1, 360));
            
            bullet.vx *= BULLET_SPEED;
            bullet.vy *= BULLET_SPEED;
            
            this.trigger('fire', bullet);
            this.bulletTimer = 0;
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
