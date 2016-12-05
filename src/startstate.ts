import screen from './screen';
import { highscores } from './highscores';

export class StartState {

    blink: number = 0;
    show: boolean = true;
    highscore: number;

    constructor() {
        this.highscore = highscores.length ? highscores[0].score : 0;
    }

    update(step) {
        this.blink += step;
        if (this.blink >= .4) {
            this.blink = 0;
            this.show = !this.show;
        }
    }

    render(step) {
        let ctx = screen.ctx;
        let screenX = screen.width / 2;

        screen.draw.background();
        screen.draw.scorePlayer1(0);
        screen.draw.highscore(this.highscore);
        screen.draw.copyright();
        
        if (this.show) {
            screen.draw.text2('PUSH START', '30pt', (width) => {    
                return {
                    x: screenX - (width / 2),
                    y: 120
                }
            });
        }

        screen.draw.text2('HIGH SCORES', '30pt', (width) => {    
            return {
                x: screenX - (width / 2),
                y: 200
            }
        });
        
        let width = ctx.measureText('_10._000000_AAA').width / 2;
        
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

    private pad(text: any, char, count) {
        text = text.toString();
        while (text.length < count) {
            text = char + text;
        }
        return text;
    }
}