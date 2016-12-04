import screen from './screen';
import { highscores } from './highscores';

export class StartState {

    blink: number = 0;
    show: boolean = true;

    constructor() {

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
        let text = 'PUSH START';

        screen.draw.background();
        screen.draw.scorePlayer1(0);

        if (this.show) {
            ctx.save();
            ctx.font = '30pt hyperspace';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeText(text, screenX - (ctx.measureText(text).width / 2), 120);
            ctx.restore();
        }

        text = 'HIGH SCORES';

        ctx.save();
        ctx.font = '30pt hyperspace';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeText(text, screenX - (ctx.measureText(text).width / 2), 200);
        ctx.restore();

        let width = ctx.measureText('_10._000000_AAA').width / 2;
        
        for(let i = 0; i < highscores.length; i++) {
            let y = 280 + (i * 40);
            ctx.font = '30pt hyperspace';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeText(`${this.pad(i + 1, ' ', 3)}. ${this.pad(highscores[i].score, ' ', 6)} ${highscores[i].initials}`, screenX - width, y);
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