import { loop } from './loop';
import { Key } from './keys';
import { Draw } from './draw';
import { Ship } from './ship';
import { Bullets } from './bullets';

import screen from './screen';

// create game objects
let ship = new Ship({x: screen.width / 2, y: screen.height / 2});
let bullets = new Bullets(ship);

const update = (step: number) => {
    ship.update();
    bullets.update(step);

    if (Key.isDown(Key.CTRL)) {
        bullets.fire();
    }
}

const render = (delta: number) => {
    screen.draw.background();
    ship.draw();
    bullets.draw();
}

loop(update, render);