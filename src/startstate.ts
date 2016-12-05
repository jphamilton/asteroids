import screen from './screen';
import { highscores } from './highscores';
import { Object2D } from './object2d';
import { Bullet } from './bullet';
import { Rock, RockFactory, RockSize } from './rocks';
import { BigAlien } from './alien';

export class StartState {

    blink: number = 0;
    showPushStart: boolean = true;
    highscore: number;
    modeTimer:number = 0;
    alienTimer: number = 0;
    alienBullets: Bullet[] = [];
    demo: boolean = false;
    rocks: Object2D[];
    demoStarted: boolean = false;
    alien: BigAlien;

    constructor() {
        this.highscore = highscores.length ? highscores[0].score : 0;
        
        let rock1 = RockFactory.create(20, screen.height - 40, RockSize.Large); 
        rock1.vx = 2;
        rock1.vy = -2;

        let rock2 = RockFactory.create(screen.width - 40, 40, RockSize.Large);
        rock2.vx = -2;
        rock2.vy = 1;

        let rock3 = RockFactory.create(screen.width - 80, screen.height - 80, RockSize.Large);
        rock3.vx = 1;
        rock3.vy = -1.5;

        let rock4 = RockFactory.create(screen.width - 80, screen.height - 120, RockSize.Large);
        rock4.vx = -1;
        rock4.vy = 1.5;

        this.rocks = [rock1, rock2, rock3, rock4];
    }

    update(step) {
        //this.demo = true;

        this.modeTimer += step;
        
        if (this.modeTimer >= 15) {
            this.modeTimer = 0;
            this.demo = !this.demo;
            if (this.demo && !this.demoStarted) {
                this.demoStarted = true;
            }
        }
        
        if (this.demoStarted && !this.alien) {
            this.alienTimer += step;
        }

        if (this.alienTimer >= 7) {
            this.alien = new BigAlien(0, 0);
            
            this.alien.onDone = () => {
                this.alien = null;
                this.alienBullets = [];
            };

            this.alien.onFire = (bullet: Bullet) => {
                bullet.onDone = () => {
                    this.alienBullets = this.alienBullets.filter(x => x !== bullet);    
                }
                this.alienBullets.push(bullet);
            };

            this.alienTimer = 0;
        }

        this.blink += step;

        if (this.blink >= .4) {
            this.blink = 0;
            this.showPushStart = !this.showPushStart;
        }

        this.updateDemo(step);
    }

    render(step) {
        if (this.demo) {
            this.renderDemo();
        } else {
            this.renderStart();
        }
    }

    private renderStart() {
        this.drawBackground();
        this.drawPushStart();
        this.drawHighScores();
    }

    private updateDemo(step) {
        
        this.rocks.forEach(rock => {
            rock.update(step);
        });

        if (this.alien) {
            this.alien.update(step);
        }

        this.alienBullets.forEach(bullet => {
            bullet.update(step);
        });
    }

    private renderDemo() {
        this.drawBackground();
        this.drawPushStart();

        this.rocks.forEach(rock => {
            rock.render();
        });

        if (this.alien) {
            this.alien.render();
        }

        this.alienBullets.forEach(bullet => {
            bullet.render();
        });
    }

    private drawBackground() {
        screen.draw.background();
        screen.draw.scorePlayer1(0);
        screen.draw.highscore(this.highscore);
        screen.draw.copyright();
    }

    private drawHighScores() {
        let screenX = screen.width / 2;

        screen.draw.text2('high scores', '30pt', (width) => {    
            return {
                x: screenX - (width / 2),
                y: 200
            }
        });
        
        for(let i = 0; i < highscores.length; i++) {
            let y = 280 + (i * 40);
            let text = `${this.pad(i + 1, ' ', 3)}. ${this.pad(highscores[i].score, ' ', 6)} ${highscores[i].initials}`;
            
            screen.draw.text2(text, '30pt', (width) => {
                return {
                    x: screenX - (width / 2),
                    y: y
                }
            });
        }
    }

    private drawPushStart() {
        let screenX = screen.width / 2;

        if (this.showPushStart) {
            screen.draw.text2('push start', '30pt', (width) => {    
                return {
                    x: screenX - (width / 2),
                    y: 120
                }
            });
        }
    }

    private pad(text: any, char, count) {
        text = text.toString();
        while (text.length < count) {
            text = char + text;
        }
        return text;
    }
}