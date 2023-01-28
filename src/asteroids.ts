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

    init(world?: World) {
        this.attractMode = new AttractMode(new World(Highscores.top.score), this.lastScore);
        this.currentMode = this.attractMode;
        
        this.attractMode.on('done', () => {

            this.gameMode = new GameMode(new World(Highscores.top.score));
            this.currentMode = this.gameMode;
                    
            this.gameMode.on('done', (source, world) => {
                this.lastScore = world.score;

                if (Highscores.qualifies(world.score)) {
                    
                    this.initialsMode = new InitialsMode(world.score);
                    this.currentMode = this.initialsMode;

                    this.initialsMode.on('done', () => {
                        this.init(world);
                    });

                    
                } else {
                    this.init(world);
                }
            });

        });

    }

    update(dt) {

        if (Key.isPressed(Keys.GOD)) {
            Global.god = !Global.god;
        }

        if (Key.isPressed(Keys.DEBUG)) {
            Global.debug = !Global.debug; 
        }

        if (Key.isPressed(Keys.MONITOR_BURN)) {
            Global.burn = !Global.burn; 
        }

        if (Key.isPressed(Keys.PAUSE)) {
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
