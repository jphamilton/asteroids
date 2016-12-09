import { loop } from './loop';
import { StartState } from './startstate';
import { GameState } from './gamestate';
import { Key } from './keys';

let state: 'start' | 'game' = 'start';
let startState = new StartState();
let gameState = new GameState();

export class Asteroids {
    
    update(step) {
        switch(state) {
            case 'start':
                startState.update(step);
                if (Key.isPressed(Key.ONE)) {
                    state = 'game';
                } else {
                    
                }
                break;
            case 'game':
                gameState.update(step);
            break;
        }
    }

    render(step) {
        switch(state) {
            case 'start':
                startState.render(step);
                break;
            case 'game':
                gameState.render(step);
                break;
        }

        Key.update();
    }

}

let game = new Asteroids();

setTimeout(() => {
    loop(game);
}, 1000);
