import { loop } from './loop';
import { HighScoreState } from './highscorestate';
import { DemoState } from './demostate';
import { GameState } from './gamestate';
import { Key } from './keys';

let highScoreState = new HighScoreState();
let demoState = new DemoState();
let gameState = new GameState();

export class Asteroids {

    private state: string = 'start';    
    private demoTimer = 0;
    private demoStarted = false;

    update(step) {

        this.timers(step);

        switch(this.state) {
            case 'start':
                highScoreState.update(step);
                
                if (this.demoStarted) {
                    // demo runs in the background
                    // even when it is not rendered
                    demoState.update(step);
                }

                if (Key.isPressed(Key.ONE)) {
                    this.state = 'game';
                }
                
                break;

            case 'demo':
                this.demoStarted = true;
                demoState.update(step);

                if (Key.isPressed(Key.ONE)) {
                    this.state = 'game';
                }
                
                break;

            case 'game':
                gameState.update(step);
                break;
        }
    }

    render(step) {
        switch(this.state) {
            case 'start':
                highScoreState.render(step);
                break;
            case 'demo':
                demoState.render(step);
                break;
            case 'game':
                gameState.render(step);
                break;
        }

        Key.update();
    }

    timers(step) {
        if (this.state !== 'game') {
            this.demoTimer += step;
            
            if (this.demoTimer >= 15) {
                this.demoTimer = 0;
                this.state = this.state === 'demo' ? 'start' : 'demo';
            }
        }
    }
}

let game = new Asteroids();

setTimeout(() => {
    loop(game);
}, 1000);
