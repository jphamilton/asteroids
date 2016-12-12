import { Object2D } from './object2d';
import { random } from './util';
import { VECTOR } from './lut';

export enum RockSize {
    Small = 5,
    Medium = 10,
    Large = 20
}

export class Rock extends Object2D {

    rot: number;
    rotTimer: number = 0;
    size: RockSize;
    timeToRot: number;

    private rock1 = [
        [ .5, -2 ],
        [ 2, -1 ],
        [ 2, -.7 ],
        [ 1.2, 0 ],
        [ 2, 1 ],
        [ 1, 2 ],
        [ .5, 1.5 ],
        [ -1, 2 ],
        [ -2, .7 ],
        [ -2, -1 ],
        [ -.5, -1 ],
        [ -1, -2 ],
        [ .5, -2 ]
    ];

    private rock2 = [
        [ 0, -1.5 ],
        [ 1, -2 ],
        [ 2, -1 ],
        [ 1, -.5 ],
        [ 2, .5 ],
        [ 1, 2 ],
        [ -.5, 1.5 ],
        [ -1, 2 ],
        [ -2, 1 ],
        [ -1.5, 0 ],
        [ -2, -1 ],
        [ -1, -2 ],
        [ 0, -1.5 ]
    ];

    private rock3 = [
        [ 0, -1 ],
        [ 1, -2 ],
        [ 2, -1 ],
        [ 1.5, 0 ],
        [ 2, 1 ],
        [ 1, 2 ],
        [ -1, 2 ],
        [ -2, 1 ],
        [ -2, -1 ],
        [ -1, -2 ],
        [ 0, -1 ]
    ];

    private rocks = [this.rock1, this.rock2, this.rock3];

    constructor(x: number, y: number, vx: number, vy: number, size: RockSize, speed: number = 1) {
        super(x, y);
        
        this.vx = vx * speed;
        this.vy = vy * speed;

        let type = random(0, 2);
        let def = this.rocks[type];
        
        this.points = def.map(p => {
            return {
                x: p[0] * size,
                y: p[1] * size
            }
        });

        this.size = size;
        this.rotate(random(1, 90));
        this.rot = random(1, 10) % 2 === 0 ? 1 : -1;
        this.timeToRot = random(1,5);
    }

    update(step: number) {
        this.rotTimer += 1;
        this.move(step);

        if (this.rotTimer === this.timeToRot) {
            this.rotate(this.rot);
            this.rotTimer = 0;
        }
    }

    render() {
        this.draw();
    }

    get direction() {
        let radians = Math.atan2(this.vy, this.vx);
        let degrees = radians * (180 / Math.PI);
        degrees = degrees > 0.0 ? degrees : 360 + degrees;
        return Math.floor(degrees);
    }

    split(obj: Object2D): Rock[] {
        if (this.size > RockSize.Small) {

            let angle1 = random(this.direction, this.direction + 80);
            let angle2 = random(this.direction - 80, this.direction);

            if (angle1 < 0) {
                angle1 += 360;
            }

            if (angle1 > 360) {
                angle1 -= 360;
            }

            if (angle2 < 0) {
                angle2 += 360;
            }

            if (angle2 > 360) {
                angle2 -= 360;
            }

            const size = this.size === RockSize.Large ? RockSize.Medium : RockSize.Small;

            let v1 = VECTOR[angle1];
            let v2 = VECTOR[angle2];
            let speed1 = size === RockSize.Medium ? random(200, 300) : random(200,600);
            let speed2 = size === RockSize.Medium ? random(200, 300) : random(200,600);

            const rock1 = new Rock(this.origin.x, this.origin.y, v1.x, v1.y, size, speed1);
            const rock2 = new Rock(this.origin.x, this.origin.y, v2.x, v2.y, size, speed2);
            
             return [rock1, rock2]
        }

        return [];
    }
}

