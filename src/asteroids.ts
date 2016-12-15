import { loop } from './loop';
import { highscores } from './highscores';
import { HighScoreState } from './highscorestate';
import { EnterHighScoreState } from './enterhighscorestate';
import { DemoState } from './demostate';
import { GameState } from './gamestate';
import { Key } from './keys';

const DEMO_TIME = 15;

export class Asteroids {

    private state: string = 'start';    
    private demoTimer = 0;
    private highScoreState;
    private demoState;
    private gameState;
    private initialsState;
    private demoStarted;

    constructor() {
        this.init();
    }

    init() {

        this.highScoreState = new HighScoreState();
        this.demoState = new DemoState();
        this.gameState = new GameState();
        
        this.gameState.on('done', (source, score) => {
            this.init();
            
            if (highscores.qualifies(score)) {
                this.initialsState = new EnterHighScoreState(score);
                
                this.initialsState.on('done', () => {
                    this.state = 'start'
                });

                this.state = 'initials';
            } else {
                this.state = 'start';
            }
        });

        this.demoStarted = false;
    }

    update(dt) {

        switch(this.state) {
            case 'start':
                this.highScoreState.update(dt);
                
                if (this.demoStarted) {
                    // demo runs in the background
                    // even when it is not rendered
                    this.demoState.update(dt);
                }

                if (Key.isPressed(Key.ONE)) {
                    this.state = 'game';
                }
                
                this.updateDemoTimer(dt);
                break;

            case 'demo':
                this.demoState.update(dt);

                if (Key.isPressed(Key.ONE)) {
                    this.state = 'game';
                }
                 
                this.updateDemoTimer(dt);
                break;

            case 'initials':
                this.initialsState.update(dt);
                break;

            case 'game':
                this.gameState.update(dt);
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

    updateDemoTimer(dt) {
        this.demoTimer += dt;
            
        if (this.demoTimer >= DEMO_TIME) {
            this.demoTimer = 0;
            // switch back and forth between highscore screen and demo screen
            this.state = this.state === 'demo' ? 'start' : 'demo';
        }
    }
}

const game = new Asteroids();

setTimeout(() => {
    loop(game);
}, 1000);
