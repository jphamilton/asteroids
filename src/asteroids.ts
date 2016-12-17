import { loop } from './loop';
import { highscores } from './highscores';
import { HighScoreState } from './highscorestate';
import { EnterHighScoreState } from './enterhighscorestate';
import { AttractState } from './attractstate';
import { GameState } from './gamestate';
import { Key } from './keys';

const ATTRACT_TIME = 15;

enum States {
    Attract,
    Game,
    Initials,
    Start
}

export class Asteroids {

    private state: States;    
    private attractTimer;
    private lastScore = 0;
    private highScoreState;
    private attractState;
    private gameState;
    private initialsState;
    private attractStarted;

    constructor() {
        this.init();
    }

    init() {

        this.state = States.Start;
        this.highScoreState = new HighScoreState(this.lastScore);
        this.attractState = new AttractState(this.lastScore);
        this.gameState = new GameState();
        this.attractTimer = 0;
                
        this.gameState.on('done', (source, score) => {
            this.lastScore = score;

            if (highscores.qualifies(score)) {
                this.initialsState = new EnterHighScoreState(score);
                
                this.initialsState.on('done', () => {
                    this.init();
                });

                this.state = States.Initials;
            } else {
                this.init();
            }
        });

        this.attractStarted = false;
    }

    update(dt) {

        switch(this.state) {
            case States.Start:
                this.highScoreState.update(dt);
                
                if (this.attractStarted) {
                    // attract mode runs in the background
                    // even when it is not rendered
                    this.attractState.update(dt);
                }

                if (Key.isPressed(Key.ONE)) {
                    this.state = States.Game;
                }
                
                this.updateAttractTimer(dt);
                break;

            case States.Attract:
                this.attractState.update(dt);

                if (Key.isPressed(Key.ONE)) {
                    this.state = States.Game;
                }
                 
                this.updateAttractTimer(dt);
                break;

            case States.Initials:
                this.initialsState.update(dt);
                break;

            case States.Game:
                this.gameState.update(dt);
                break;
        }
    }

    render(dt) {
        switch(this.state) {
            case States.Start:
                this.highScoreState.render(dt);
                break;
            case States.Attract:
                this.attractState.render(dt);
                break;
            case States.Initials:
                this.initialsState.render(dt);
                break;
            case States.Game:
                this.gameState.render(dt);
                break;
        }

        Key.update();
    }

    updateAttractTimer(dt) {
        this.attractTimer += dt;
            
        if (this.attractTimer >= ATTRACT_TIME) {
            this.attractTimer = 0;
            this.state = this.state === States.Attract ? States.Start : States.Attract;
        }
    }
}

const game = new Asteroids();

setTimeout(() => {
    loop(game);
}, 1000);
