import screen from './screen';
import { Sound } from './sounds';
import { Key } from './keys';
import { Highscores } from './highscores';
import { EventSource } from './events';

const letters = '_abcdefghijklmnopqrstuvwxyz';

export class InitialsMode extends EventSource implements IGameState {
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

        Sound.stop();
        Sound.off();
    }

    update(dt) {
        if (Key.wasRotateLeft()) {
            this.index--;
            if (this.index < 0) {
                this.index = letters.length - 1;
            }
            this.initials[this.position] = letters[this.index];
        }

        if (Key.wasRotateRight()) {
            this.index++;
            if (this.index > letters.length - 1) {
                this.index = 0;
            }
            this.initials[this.position] = letters[this.index];
        }

        if (Key.wasHyperspace()) {
            this.position++;
            
            if (this.position >= 3) {
                Highscores.save(this.score, this.initials.join('').replace('_',' '));
                this.init();
                this.trigger('done');
            }

            this.index = 1;
            this.initials[this.position] = letters[this.index];
        }
    }

    render(delta: number) {
        let offset: number = screen.height / 4.5;
        const text = (t => screen.draw.text(t, 50, offset += screen.font.large + 5, screen.font.large));
        
        screen.draw.background();
        screen.draw.highscore(Highscores.top.score);
        screen.draw.scorePlayer1(this.score);
        screen.draw.copyright();

        text('your score is one of the ten best');
        text('please enter your initials');
        text('push rotate to select letter');
        text('push hyperspace when letter is correct');

        screen.draw.text3(this.initials.join(''), screen.font.xlarge, (width) => {
            return { x: screen.width2 - (width / 2), y: screen.height / 2 + screen.font.xlarge };
        });
    }
}