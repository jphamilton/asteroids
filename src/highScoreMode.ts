import screen from './screen';
import { Key } from './keys';
import { highscores } from './highscores';
import { Object2D } from './object2d';

export class HighScoreMode {

    blink: number = 0;
    showPushStart: boolean = true;
    highscore: number;

    constructor(private score) {
        this.highscore = highscores.top.score;
    }

    update(dt) {
        this.blink += dt;
        
        if (this.blink >= .4) {
            this.blink = 0;
            this.showPushStart = !this.showPushStart;
        }
    }

    render() {
        this.drawBackground();
        this.drawPushStart();
        this.drawHighScores();
    }

    private drawBackground() {
        screen.draw.background();
        screen.draw.scorePlayer1(this.score);
        screen.draw.oneCoinOnePlay();
        screen.draw.highscore(this.highscore);
        screen.draw.copyright();
    }

    private drawHighScores() {
        const screenX = screen.width / 2;

        screen.draw.text2('high scores', '30pt', (width) => {
            return {
                x: screenX - (width / 2),
                y: 200
            }
        });

        for (let i = 0; i < highscores.scores.length; i++) {
            const y = 280 + (i * 40);
            const text = `${this.pad(i + 1, ' ', 2)}.${this.pad(highscores.scores[i].score, ' ', 6)} ${highscores.scores[i].initials}`;

            screen.draw.text2(text, '30pt', (width) => {
                return {
                    x: screenX - (width / 2),
                    y: y
                }
            });
        }
    }

    drawPushStart() {
        if (this.showPushStart) {
            screen.draw.pushStart();
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