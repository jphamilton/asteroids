import { Object2D } from './object2d';
import { random } from './util';

const rock1 = [
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

const rock2 = [
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

const rock3 = [
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

const rocks = [rock1, rock2, rock3];

export enum RockSize {
    Small = 5,
    Medium = 10,
    Large = 20
}

export class _RockFactory {
    
    create(x: number, y: number, size: RockSize): Rock {
        let type = random(0, 2);
        let def = rocks[type];
        
        let points = def.map(p => {
            return {
                x: p[0],
                y: p[1]
            }
        });

        let rock = new Rock(points, x, y, size);

        return rock;
    }

}

export const RockFactory = new _RockFactory();


export class Rock extends Object2D {

    rot: number;
    rotTimer: number = 0;

    constructor(points: Point[], x: number, y: number, scale: number = 1) {
        super(x, y);
        this.rot = Math.floor(Math.random() * 2) + 1;
        this.rotate(random(1, 90));
        this.rot = random(1, 10) % 2 === 0 ? 1 : -1;
        this.points = points;
        this.scale(scale);
    }

    init() {
        return this.points;
    }

    update(step: number) {
        this.rotTimer += 1;
        this.move();
        
        if (this.rotTimer === 5) {
            this.rotate(this.rot);
            this.rotTimer = 0;
        }
    }

    render() {
        this.draw();
    }

}

