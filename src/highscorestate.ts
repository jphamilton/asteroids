import screen from './screen';
import { Key } from './keys';
import { highscores } from './highscores';
import { Object2D } from './object2d';

export class HighScoreState {

    blink: number = 0;
    showPushStart: boolean = true;
    highscore: number;

    constructor() {
        this.highscore = highscores.length ? highscores[0].score : 0;
    }

    update(step) {
        this.blink += step;
        
        if (this.blink >= .4) {
            this.blink = 0;
            this.showPushStart = !this.showPushStart;
        }
    }

    render(step) {
        this.drawBackground();
        this.drawPushStart();
        this.drawHighScores();
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

        for (let i = 0; i < highscores.length; i++) {
            let y = 280 + (i * 40);
            let text = `${this.pad(i + 1, ' ', 2)}.${this.pad(highscores[i].score, ' ', 6)} ${highscores[i].initials}`;

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