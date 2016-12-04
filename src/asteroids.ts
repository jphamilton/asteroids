import { loop } from './loop';
import World from './world';

const update = (step: number) => {
    World.update(step);
}

const render = (delta: number) => {
    World.render(delta);
}

loop(update, render);