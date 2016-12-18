import screen from './screen';
import { Collisions } from './collisions';
import { State } from './state';

export class AttractMode implements IGameState {

    showPushStart: boolean = true;
    pushStartTimer: number = 0;
    
    constructor(private state: State) {
        this.init();
    }

    init() {
        if (!this.state.started) {
            this.state.startLevel();
        }
    }

    update(dt) {
        this.state.updateAlienTimer(dt);

        if (!this.state.rocks.length && !this.state.explosions.length && !this.state.alien) {  
            this.state.startLevel();
        }

        this.updatePushStartTimer(dt);
        this.checkCollisions();

        this.state.objects.forEach(obj => {
            if (obj) {
                obj.update(dt);
            }
        });
    }

    updatePushStartTimer(dt: number) {
        this.pushStartTimer += dt;

        if (this.pushStartTimer >= .4) {
            this.pushStartTimer = 0;
            this.showPushStart = !this.showPushStart;
        }
    }

    
    checkCollisions() {
        const { alien, rocks, alienBullets } = this.state;
        const check = !!alien || !!alienBullets.length;

        if (!check) {
            return;
        }

        const collisions = new Collisions();

        collisions.check([alien], rocks, (alien, rock) => {
            this.state.alienDestroyed();
            this.state.rockDestroyed(rock);
        });

        collisions.check(alienBullets, rocks, (bullet, rock) => {
            this.state.rockDestroyed(rock);
        });
    }

    render() {
        this.drawBackground();
        this.drawPushStart();

        this.state.objects.forEach(obj => {
            if (obj) {
                obj.render();
            }
        });
    }

    private drawBackground() {
        screen.draw.background();
        screen.draw.scorePlayer1(this.state.score);
        screen.draw.oneCoinOnePlay();
        screen.draw.highscore(this.state.highscore);
        screen.draw.copyright();
    }

    private drawPushStart() {
        if (this.showPushStart) {
            screen.draw.pushStart();
        }
    }

   
}