import screen from './screen';
import { Object2D } from './object2d';
import { Bullet } from './bullet';
import { random } from './util';

const MAX_BULLETS: number = 3;

export class BigAlien extends Object2D {

    points: Point[];
    moveTimer: number = 0;
    bulletTimer: number = 1;
    bulletCount: number = 0;
    moveTime: number = 2;
    onDone: () => void;
    onFire: (bullet: Bullet) => void;
    
    constructor(x: number, y: number) {
        super(x, y);

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
        
        this.vy = 0;

        this.y = random(100, screen.height - 100);
        
        if (this.y % 2 === 0) {
            this.x = 40;
            this.vx = 3;
        } else {
            this.x = screen.width - 40;
            this.vx = -3;
        }

        this.scale(7);
    }

    update(step: number) {
        this.move();
        
        if (this.x >= screen.width || this.x <= 0) {
            this.onDone();
            return;
        }

        // direction changes
        this.moveTimer += step;
        
        if (this.moveTimer >= 1 && this.vy !== 0) {
            this.vy = 0;
            this.moveTimer = 0;
        }

        if (this.moveTimer >= this.moveTime) {
            let move = random(1, 20) % 2 === 0;
            
            if (move) {
                this.vy = this.x % 2 === 0 ? this.vx : -this.vx;   
            }
            
            this.moveTimer = 0;
            this.moveTime++;
        }

        // firing 
        this.bulletTimer += step;
        if (this.bulletTimer >= 1 && this.bulletCount <= MAX_BULLETS) {
            let bullet = new Bullet(this.x, this.y, random(1, 360));
            bullet.vx *= 10;
            bullet.vy *= 10;
            this.onFire(bullet);
            this.bulletTimer = 0;
        }

    }

    render() {
        this.draw();
    }
    
    draw() {
        super.draw();
        screen.draw.shape([this.points[1], this.points[6]], this.x, this.y);
        screen.draw.shape([this.points[2], this.points[5]], this.x, this.y);
    }
}
