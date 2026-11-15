import './style.css';

import { loop } from './loop';
import { Key, Keys } from './keys';
import { World } from './world';
import { Sound } from './sounds';
import { Highscores } from './highscores';
import { AttractMode } from './attractMode';
import { InitialsMode } from './initialsMode';
import { GameMode } from './gameMode';
import Global from './global';

export class Asteroids {

    private lastScore = 0;
    private attractMode: AttractMode;
    private gameMode: GameMode;
    private initialsMode: InitialsMode;
    private currentMode: IGameState;

    constructor() {
        this.init();
    }

    init(resumeWorld?: World) {
        const world = resumeWorld ?? new World(Highscores.top.score);
        this.attractMode = new AttractMode(world, this.lastScore);
        this.currentMode = this.attractMode;
        
        const setGameMode = () => {
            this.gameMode = new GameMode(new World(Highscores.top.score));
            this.currentMode = this.gameMode;
                    
            this.gameMode.on('done', (_source, finished: World) => {
                this.lastScore = finished.score;

                const returnToAttract = () => {
                    this.init(finished);
                };

                if (Highscores.qualifies(finished.score)) {
                    this.initialsMode = new InitialsMode(finished.score);
                    this.currentMode = this.initialsMode;

                    this.initialsMode.on('done', () => {
                        returnToAttract();
                    });
                } else {
                    returnToAttract();
                }
            });
        };

        this.attractMode.on('done', () => {
            setGameMode();
        });

    }

    update(dt) {
        Key.beginFrame();

        if (Key.wasPressed(Keys.GOD)) {
            Global.god = !Global.god;
        }

        if (Key.wasPressed(Keys.DEBUG)) {
            Global.debug = !Global.debug; 
        }

        if (Key.wasPressed(Keys.MONITOR_BURN)) {
            Global.burn = !Global.burn; 
        }

        if (Key.wasPressed(Keys.PAUSE)) {
            Global.paused = !Global.paused; 

            if (Global.paused) {
                Sound.off();
            } else {
                Sound.on();
            }
        }

        if (Global.paused) {
            return;
        }

        this.currentMode.update(dt);
    }

    render(dt) {
        this.currentMode.render(dt);
        Key.update();
    }

}

const game = new Asteroids();

setTimeout(() => {
    loop(game);
}, 1000);
