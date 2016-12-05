import screen from './screen';
import { highscores } from './highscores';
import { Object2D } from './object2d';

import { Rock, RockFactory, RockSize } from './rocks';


export class StartState {

    blink: number = 0;
    showPushStart: boolean = true;
    highscore: number;
    modeTimer:number = 0;
    demo: boolean = false;
    rocks: Rock[];

    constructor() {
        this.highscore = highscores.length ? highscores[0].score : 0;
        
        let rock1 = RockFactory.create(20, screen.height - 40, RockSize.Large); 
        rock1.vx = 1;
        rock1.vy = -1;

        let rock2 = RockFactory.create(screen.width - 40, 40, RockSize.Large);
        rock2.vx = -1;
        rock2.vy = 1;

        let rock3 = RockFactory.create(screen.width - 80, screen.height - 80, RockSize.Large);
        rock3.vx = .5;
        rock3.vy = -1;

        let rock4 = RockFactory.create(screen.width - 80, screen.height - 120, RockSize.Large);
        rock4.vx = -.5;
        rock4.vy = 1.5;

        this.rocks = [rock1, rock2, rock3, rock4];
    }

    update(step) {
        this.modeTimer += step;
        
        if (this.modeTimer >= 15) {
            this.modeTimer = 0;
            this.demo = !this.demo;
        }
 
        this.blink += step;
        if (this.blink >= .4) {
            this.blink = 0;
            this.showPushStart = !this.showPushStart;
        }

        // this updates whether its being displayed or not
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
    }

    private renderDemo() {
        this.drawBackground();
        this.drawPushStart();

        this.rocks.forEach(rock => {
            rock.render();
        })
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