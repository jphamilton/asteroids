import screen from './screen';
import { Key } from './keys';
import { highscores } from './highscores';
import { Object2D } from './object2d';
import { EventSource } from './events';

const letters = '_abcdefghijklmnopqrstuvwxyz';

export class InitialsMode extends EventSource {
    index: number = 1;
    position: number;
    score: number;
    initials: string[];
    
    constructor(score: number) {
        super();
        this.score = score;
        this.init();
    }

    init() {
        this.position = 0;
        this.index = 1;
        this.initials = ['a', '_', '_'];
    }

    update(dt) {
        if (Key.isPressed(Key.LEFT)) {
            this.index--;
            if (this.index < 0) {
                this.index = letters.length - 1;
            }
            this.initials[this.position] = letters[this.index];
        }

        if (Key.isPressed(Key.RIGHT)) {
            this.index++;
            if (this.index > letters.length - 1) {
                this.index = 0;
            }
            this.initials[this.position] = letters[this.index];
        }

        if (Key.isPressed(Key.SPACE)) {
            this.position++;
            
            if (this.position >= 3) {
                highscores.save(this.score, this.initials.join('').replace('_',' '));
                this.init();
                this.trigger('done');
            }

            this.index = 1;
            this.initials[this.position] = letters[this.index];
        }
    }

    render() {
        let offset: number = 165;
        const text = (t => screen.draw.text(t, 50, offset += 35, '30pt'));
        
        screen.draw.background();
        screen.draw.highscore(highscores.top.score);
        screen.draw.scorePlayer1(this.score);
        screen.draw.copyright();

        text('your score is one of the ten best');
        text('please enter your initials');
        text('push rotate to select letter');
        text('push hyperspace when letter is correct');

        screen.draw.text3(this.initials.join(''), '60pt', (width) => {
            return { x: (screen.width / 2) - width, y: screen.height / 2 };
        });
    }
}