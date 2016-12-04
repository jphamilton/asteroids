import { loop } from './loop';
import { Key } from './keys';
import { Draw } from './draw';
import { Ship } from './ship';
import { Bullet } from './bullet';
import screen from './screen';

// create game objects
let ship = new Ship({x: screen.width / 2, y: screen.height / 2});
let bullets = [];
let bulletCounter = 0;

const drawBackground = () => {
    screen.draw.rect({ x: 0, y: 0}, { x: screen.width, y: screen.height }, '#000000');
}

const update = (step: number) => {
    ship.update();

    for(let i = 0; i < bullets.length; i++) {
        bullets[i].update(step);
    }

    bullets = bullets.filter(x => x.life > 0);

    if (bulletCounter > 0) {
        bulletCounter -= step;
    }

    if (Key.isDown(Key.CTRL) && bulletCounter <= 0) {
        bulletCounter = .2;
        if (bullets.length < 4) {
            bullets.push(new Bullet(ship));
        }
    }
}

const render = (delta: number) => {
    drawBackground();
    
    ship.draw();

    for(let i = 0; i < bullets.length; i++) {
        bullets[i].draw();
    }
}

loop(update, render);