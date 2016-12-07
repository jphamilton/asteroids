import { Object2D } from './object2d';
import { random } from './util';

export enum RockSize {
    Small = 5,
    Medium = 10,
    Large = 20
}

export class Rock extends Object2D {

    rot: number;
    rotTimer: number = 0;
    size: RockSize;

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

    constructor(x: number, y: number, size: RockSize = 1) {
        super(x, y, size);
        
        let type = random(0, 2);
        let def = this.rocks[type];
        
        this.points = def.map(p => {
            return {
                x: p[0] * size,
                y: p[1] * size
            }
        });

        this.rotate(random(1, 90));
        this.rot = random(1, 10) % 2 === 0 ? 1 : -1;
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

