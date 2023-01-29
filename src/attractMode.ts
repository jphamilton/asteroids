import { World } from './world';
import { EventSource } from './events';
import { HighScoreMode } from './highScoreMode';
import { DemoMode } from './demoMode';
import { Highscores } from './highscores';
import { Sound } from './sounds';
import { Key } from './keys';

const ATTRACT_TIME = 15;

// combines DemoMode and HighscoreMode to attract people to part with their quarters
export class AttractMode extends EventSource implements IGameState {
    
    private demoTimer = 0;
    private currentMode: IGameState;
    private modes: IGameState[];
    private index: number = 0;

    constructor(world: World, lastScore: number) {
        super();

        this.modes = [
            new HighScoreMode(lastScore),
            new DemoMode(world || new World(Highscores.top.score))
        ];

        this.currentMode = this.modes[0];

        Sound.stop();
        Sound.off();
    }

    update(step: number) {
        this.currentMode.update(step);
        if (Key.isAnyPressed()) {
            this.trigger('done');
        } else {
            this.updateAttractTimer(step);
        }
    }
    
    render(dt?: number) {
        this.currentMode.render(dt);
    }

    updateAttractTimer(step: number) {
        this.demoTimer += step;
            
        if (this.demoTimer >= ATTRACT_TIME) {
            this.demoTimer = 0;
            this.index = 1 - this.index;
            this.currentMode = this.modes[this.index];
        }
    }
}