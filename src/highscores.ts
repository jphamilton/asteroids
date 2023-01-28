// move to local storage at some point

const defaults = [
    { score: 20140, initials: 'J H'},
    { score: 20050, initials: 'P A'},
    { score: 19930, initials: '  M'},
    { score: 19870, initials: 'G I'},
    { score: 19840, initials: 'A L'},
    { score: 19790, initials: 'M T'},
    { score: 19700, initials: 'E O'},
    { score: 19660, initials: 'S N'},
    { score:   190, initials: '   '},
    { score:    70, initials: '   '},
];

const SCORE_KEY = 'jph_asteroids_hs';

class Highscores {

    scores: { score: number, initials: string}[] = [];

    constructor() {
        const str = window.localStorage.getItem(SCORE_KEY);
        this.scores = str ? JSON.parse(str) || [] : defaults;
    }

    get top() {
        return this.scores[0];
    }

    qualifies(score: number) {
        const less = highscores.scores.filter(x => x.score < score);
        return !!less.length;
    }

    save(score: number, initials: string) {
        if (this.qualifies(score)) {
            this.scores.push({score: score, initials: initials});
            this.scores = this.scores.sort((a, b) => a.score > b.score ? -1 : 1).slice(0, 10);
            window.localStorage.setItem(SCORE_KEY, JSON.stringify(this.scores));
        }
    }

}

const highscores = new Highscores()

export { highscores as Highscores }
