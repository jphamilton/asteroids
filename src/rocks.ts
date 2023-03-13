import screen from './screen';
import { Object2D } from './object2d';
import { Vector } from './vector';
import { random, randomFloat } from './util';
import { largeExplosion, mediumExplosion, smallExplosion } from './sounds';

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
        [ -1, -2 ]
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
        [ -1, -2 ]
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
        [ -1, -2 ]
    ];

    private rocks = [this.rock1, this.rock2, this.rock3];

    constructor(x: number, y: number, v: Vector, size: RockSize, speed: number = 1) {
        super(x, y);
        
        const velocity = speed * screen.objectScale;

        this.velocity.x = v.x * velocity;
        this.velocity.y = v.y * velocity;
        
        const type = random(0, 2);
        const def = this.rocks[type];
        
        this.points = def.map(p => {
            return {
                x: p[0] * size,
                y: p[1] * size
            }
        });

        this.size = size;
        this.rotate(random(1, 90));
        this.rot = random(.01, 1) % 2 === 0 ? 1 : -1;
        this.timeToRot = random(1,5);
    }

    update(dt: number) {
        this.rotTimer += 1;
        this.move(dt);

        if (this.rotTimer === this.timeToRot) {
            this.rotate(this.rot);
            this.rotTimer = 0;
        }
    }

    render() {
        this.draw();
    }

    get direction() {
        const radians = Math.atan2(this.velocity.y, this.velocity.x);
        let degrees = radians * (180 / Math.PI);
        degrees = degrees > 0.0 ? degrees : 360 + degrees;
        return Math.floor(degrees);
    }

    split(): Rock[] {
        let sound;

        switch(this.size) {
            case RockSize.Large:
                sound = largeExplosion;
                break;

            case RockSize.Medium:
                sound = mediumExplosion;
                break;

            case RockSize.Small:
                sound = smallExplosion;
                break;
        }

        const rate = randomFloat(.7, 1);
        sound.rate(rate);
        sound.play();

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
            const v1 = Vector.fromAngle(angle1);
            const v2 = Vector.fromAngle(angle2);
            const speed1 = size === RockSize.Medium ? random(150, 250) : random(250, 350);
            const speed2 = size === RockSize.Medium ? random(150, 250) : random(250, 350);
            const rock1 = new Rock(this.origin.x, this.origin.y, v1, size, speed1);
            const rock2 = new Rock(this.origin.x, this.origin.y, v2, size, speed2);
            
             return [rock1, rock2]
        }

        return [];
    }

    get score(): number {
        return this.size === RockSize.Large ? 20 : this.size === RockSize.Medium ? 50 : 100;
    }
}

export function createRocks(level: number): Rock[] {
    const rocks = [];
    const count = Math.min(level + 3, 10);
    const speed = 150;
    const offset = 20;

    for(let i = 0; i < count; i++) {
        const zone = random(1,4);
        const v = Vector.fromAngle(random(1, 360));
        let x: number;
        let y: number;

        switch (zone) {
            case 1:
                x = random(offset, screen.width - offset); 
                y = random(offset, offset * 2); 
                break;
            case 2:
                x = random(screen.width - (offset * 2), screen.width - offset);
                y = random(screen.height - offset, screen.height - offset);
                break;
            case 3:
                x = random(offset, screen.width - offset);
                y = random(screen.height - offset, screen.height - offset); 
                break;
            default:
                x = random(offset, offset * 2);
                y = random(screen.height - offset, screen.height - offset);
                break;
        }

        const rock = new Rock(x, y, v, RockSize.Large, speed);
        rocks.push(rock);
    } 

    return rocks;
}
