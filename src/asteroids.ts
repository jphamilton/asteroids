import { loop } from './loop';
import { Key } from './keys';
import { Draw } from './draw';
import { Ship } from './ship';
import screen from './screen';

// create game objects
let ship = new Ship({x: screen.width / 2, y: screen.height / 2});

const drawBackground = () => {
    screen.draw.rect({ x: 0, y: 0}, { x: screen.width, y: screen.height }, '#000000');
}

const update = (step: number) => {
    ship.update();
}

const render = (delta: number) => {
    drawBackground();
    
    ship.draw();
}

loop(update, render);