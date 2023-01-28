import screen from './screen';
import { Collisions } from './collisions';
import { World } from './world';

export class DemoMode implements IGameState {

    showPushStart: boolean = true;
    pushStartTimer: number = 0;
    
    constructor(private world: World) {
        this.init();
    }

    init() {
        if (!this.world.started) {
            this.world.startLevel();
        }
    }

    update(dt) {
        this.checkCollisions();

        this.world.updateAlienTimer(dt);

        if (!this.world.rocks.length && !this.world.scenery.length && !this.world.alien) {  
            this.world.startLevel();
        }

        this.updatePushStartTimer(dt);
        
        this.world.update(dt);
    }

    updatePushStartTimer(dt: number) {
        this.pushStartTimer += dt;

        if (this.pushStartTimer >= .4) {
            this.pushStartTimer = 0;
            this.showPushStart = !this.showPushStart;
        }
    }

    
    checkCollisions() {
        const { alien, rocks, alienBullets } = this.world;
        const check = !!alien || !!alienBullets.length;

        if (!check) {
            return;
        }

        const collisions = new Collisions();

        collisions.check([alien], rocks, false, (alien, rock) => {
            this.world.shake();
            this.world.alienDestroyed();
            this.world.rockDestroyed(rock);
        });

        collisions.check(alienBullets, rocks, false, (bullet, rock) => {
            this.world.shake();
            this.world.rockDestroyed(rock);
        });
    }

    render(delta?: number) {
        this.drawBackground();
        this.drawPushStart();
        this.world.render(delta);
    }

    private drawBackground() {
        screen.draw.background();
        screen.draw.scorePlayer1(this.world.score);
        screen.draw.oneCoinOnePlay();
        screen.draw.highscore(this.world.highscore);
        screen.draw.copyright();
    }

    private drawPushStart() {
        if (this.showPushStart) {
            screen.draw.pushStart();
        }
    }

   
}