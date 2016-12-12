import { loop } from './loop';
import { HighScoreState } from './highscorestate';
import { EnterHighScoreState } from './enterhighscorestate';
import { DemoState } from './demostate';
import { GameState } from './gamestate';
import { Key } from './keys';

export class Asteroids {

    private state: string = 'demo';    
    private demoTimer = 0;
    private highScoreState;
    private demoState;
    private gameState;
    private initialsState;

    constructor() {
        this.highScoreState = new HighScoreState();
        this.demoState;
        this.gameState = new GameState();
        this.initialsState = new EnterHighScoreState();

        this.initialsState.on('done', () => this.state = 'start');
    }

    update(step) {

        this.timers(step);

        switch(this.state) {
            case 'start':
                this.highScoreState.update(step);
                
                if (this.demoState) {
                    // demo runs in the background
                    // even when it is not rendered
                    this.demoState.update(step);
                }

                if (Key.isPressed(Key.ONE)) {
                    this.state = 'game';
                }
                
                break;

            case 'demo':
                if (!this.demoState) {
                    this.demoState = new DemoState();
                }

                this.demoState.update(step);

                if (Key.isPressed(Key.ONE)) {
                    this.state = 'game';
                }
                 
                break;

            case 'initials':
                this.initialsState.update(step);
                break;

            case 'game':
                this.gameState.update(step);
                break;
        }
    }

    render(dt) {
        switch(this.state) {
            case 'start':
                this.highScoreState.render(dt);
                break;
            case 'demo':
                this.demoState.render(dt);
                break;
            case 'initials':
                this.initialsState.render(dt);
                break;
            case 'game':
                this.gameState.render(dt);
                break;
        }

        Key.update();
    }

    timers(step) {
        // if (this.state === 'demo' || this.state === 'start') {
        //     this.demoTimer += step;
            
        //     if (this.demoTimer >= 15) {
        //         this.demoTimer = 0;
        //         this.state = this.state === 'demo' ? 'start' : 'demo';
        //     }
        // }
    }
}

let game = new Asteroids();

setTimeout(() => {
    loop(game);
}, 1000);
