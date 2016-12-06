import { Object2D } from './object2d';

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
        let type = Math.floor(Math.random() * 3);
        let def = rocks[type];
        let rock = new Rock(x, y, size);

        rock.points = def.map(p => {
            return {
                x: p[0] * size,
                y: p[1] * size
            }
        });

        let rot = Math.floor(Math.random() * 90) + 1;

        rock.rotate(rot);

        return rock;
    }

}

export const RockFactory = new _RockFactory();


export class Rock extends Object2D {

    points: Point[];
    rot: number;
    rotTimer: number = 0;

    constructor(x: number, y: number, scale: number = 1) {
        super(x, y);
        this.rot = Math.floor(Math.random() * 2) + 1;
        this.rot = this.rot % 2 === 0 ? this.rot : -this.rot;
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

