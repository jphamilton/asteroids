import { loop } from './loop';
import { highscores } from './highscores';
import { HighScoreMode } from './highScoreMode';
import { InitialsMode } from './initialsMode';
import { AttractMode } from './attractMode';
import { GameMode } from './gameMode';
import { Key } from './keys';

const ATTRACT_TIME = 15;

enum Modes {
    Attract,
    Game,
    Initials,
    Start
}

export class Asteroids {

    private mode: Modes;    
    private attractTimer;
    private lastScore = 0;
    private highScoreMode;
    private attractMode;
    private gameMode;
    private initialsMode;
    private attractStarted;

    constructor() {
        this.init();
    }

    init() {

        this.mode = Modes.Start;
        this.highScoreMode = new HighScoreMode(this.lastScore);
        this.attractMode = new AttractMode(this.lastScore);
        this.gameMode = new GameMode();
        this.attractTimer = 0;
                
        this.gameMode.on('done', (source, score) => {
            this.lastScore = score;

            if (highscores.qualifies(score)) {
                this.initialsMode = new InitialsMode(score);
                
                this.initialsMode.on('done', () => {
                    this.init();
                });

                this.mode = Modes.Initials;
            } else {
                this.init();
            }
        });

        this.attractStarted = false;
    }

    update(dt) {

        switch(this.mode) {
            case Modes.Start:
                this.highScoreMode.update(dt);
                
                if (this.attractStarted) {
                    // attract mode runs in the background
                    // even when it is not rendered
                    this.attractMode.update(dt);
                }

                if (Key.isPressed(Key.ONE)) {
                    this.mode = Modes.Game;
                }
                
                this.updateAttractTimer(dt);
                break;

            case Modes.Attract:
                this.attractMode.update(dt);

                if (Key.isPressed(Key.ONE)) {
                    this.mode = Modes.Game;
                }
                 
                this.updateAttractTimer(dt);
                break;

            case Modes.Initials:
                this.initialsMode.update(dt);
                break;

            case Modes.Game:
                this.gameMode.update(dt);
                break;
        }
    }

    render(dt) {
        switch(this.mode) {
            case Modes.Start:
                this.highScoreMode.render(dt);
                break;
            case Modes.Attract:
                this.attractMode.render(dt);
                break;
            case Modes.Initials:
                this.initialsMode.render(dt);
                break;
            case Modes.Game:
                this.gameMode.render(dt);
                break;
        }

        Key.update();
    }

    updateAttractTimer(dt) {
        this.attractTimer += dt;
            
        if (this.attractTimer >= ATTRACT_TIME) {
            this.attractTimer = 0;
            this.mode = this.mode === Modes.Attract ? Modes.Start : Modes.Attract;
        }
    }
}

const game = new Asteroids();

setTimeout(() => {
    loop(game);
}, 1000);
