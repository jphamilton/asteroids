import { loop } from './loop';
import { Key } from './keys';
import { World } from './world';
import { Sound } from './sounds';
import { highscores } from './highscores';
import { HighScoreMode } from './highScoreMode';
import { InitialsMode } from './initialsMode';
import { AttractMode } from './attractMode';
import { GameMode } from './gameMode';

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

    init(world?: World) {
        
        Sound.stop();
        Sound.off();
        
        this.mode = Modes.Start;
        this.highScoreMode = new HighScoreMode(this.lastScore);
        this.attractMode = new AttractMode(world || new World(highscores.top.score));
        this.gameMode = new GameMode(new World(highscores.top.score));
        this.attractTimer = 0;
                
        this.gameMode.on('done', (source, world) => {
            this.lastScore = world.score;

            if (highscores.qualifies(world.score)) {
                this.initialsMode = new InitialsMode(world.score);
                
                this.initialsMode.on('done', () => {
                    this.init(world);
                });

                Sound.stop();
                Sound.off();
                this.mode = Modes.Initials;
            } else {
                this.init(world);
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

                if (Key.isPressed(Key.PLAYER_ONE_START)) {
                    Sound.on();
                    this.mode = Modes.Game;
                } else {
                    this.updateAttractTimer(dt);
                }
                break;

            case Modes.Attract:
                this.attractMode.update(dt);

                if (Key.isPressed(Key.PLAYER_ONE_START)) {
                    Sound.on();
                    this.mode = Modes.Game;
                } else {
                    this.updateAttractTimer(dt);
                }
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
