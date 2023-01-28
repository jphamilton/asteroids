import screen from './screen';
import { Highscores } from './highscores';

export class HighScoreMode implements IGameState {

    blink: number = 0;
    showPushStart: boolean = true;
    highscore: number;

    constructor(private score) {
        this.highscore = Highscores.top.score;
    }

    update(dt) {
        this.blink += dt;
        
        if (this.blink >= .4) {
            this.blink = 0;
            this.showPushStart = !this.showPushStart;
        }
    }

    render(delta: number) {
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
        const startY = Math.ceil(screen.height / 4.5) + (screen.font.xlarge + screen.font.small);
        const spacing = screen.font.medium + screen.font.small;
        
        screen.draw.text2('high scores', screen.font.large, (width) => {
            return {
                x: screenX - (width / 2),
                y: screen.height / 4.5
            }
        });

        for (let i = 0; i < Highscores.scores.length; i++) {
            const y = startY + (i * spacing);
            const text = `${this.pad(i + 1, ' ', 2)}.${this.pad(Highscores.scores[i].score, ' ', 6)} ${Highscores.scores[i].initials}`;

            screen.draw.text2(text, screen.font.large, (width) => {
                return {
                    x: screenX - (width / 2),
                    y: y
                }
            });
        }
    }

    private drawPushStart() {
        if (this.showPushStart) {
            screen.draw.pushStart();
        }
    }
    
    private pad(text: any, char: string, count: number) {
        text = text.toString();
        while (text.length < count) {
            text = char + text;
        }
        return text;
    }

}