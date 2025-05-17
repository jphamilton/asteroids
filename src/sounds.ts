import w01 from './assets/getpowerup.wav';
import w02 from './assets/powerup.wav';
import w03 from './assets/life.wav';
import w04 from './assets/thumphi.wav';
import w05 from './assets/thumplo.wav';
import w06 from './assets/ssaucer.wav';
import w07 from './assets/lsaucer.wav';
import w08 from './assets/explode3.wav';
import w09 from './assets/explode2.wav';
import w10 from './assets/explode1.wav';
import w11 from './assets/sfire.wav';
import w12 from './assets/thrust.wav';
import w13 from './assets/fire.wav';

// hack for webpack to include sound files
console.log(w01 || 'loading sound');
console.log(w02 || 'loading sound');
console.log(w03 || 'loading sound');
console.log(w04 || 'loading sound');
console.log(w05 || 'loading sound');
console.log(w06 || 'loading sound');
console.log(w07 || 'loading sound');
console.log(w08 || 'loading sound');
console.log(w09 || 'loading sound');
console.log(w10 || 'loading sound');
console.log(w11 || 'loading sound');
console.log(w12 || 'loading sound');
console.log(w13 || 'loading sound');

import { Howl } from 'howler';

const VOLUME = .5;

let soundOn: boolean = true;

export const all = [];

function createSound(options) {
    let count = 0;

    const sound = new Howl(options);

    sound.on('end', () => {
        if (options.max) {
            count--;
        }
    });

    const play = sound.play.bind(sound);
    const canPlay = options.max ? count < options.max && soundOn : soundOn;

    sound.play = () => {
        if (soundOn) {
            
            if (options.max) {
                if (count < options.max) {
                    play();
                    count++;
                }
            } else {
                play();
            }
        }
    };

    sound._origVolume = options.volume;

    all.push(sound);
    return sound;
}

export const fire = createSound({
    src: ['./assets/fire.wav'],
    volume: .2
});

export const thrust = createSound({
    src: ['./assets/thrust.wav'],
    volume: 0.3
});

export const alienFire = createSound({
    src: ['./assets/sfire.wav'],
    volume: VOLUME
});

export const largeExplosion = createSound({
    src: ['./assets/explode1.wav'],
    volume: VOLUME,
    max: 2
});

export const mediumExplosion = createSound({
    src: ['./assets/explode2.wav'],
    volume: VOLUME,
    max: 2
});

export const smallExplosion = createSound({
    src: ['./assets/explode3.wav'],
    volume: VOLUME,
    max: 2
});

export const largeAlien = createSound({
    src: ['./assets/lsaucer.wav'],
    volume: VOLUME,
    loop: true
});

export const smallAlien = createSound({
    src: ['./assets/ssaucer.wav'],
    volume: VOLUME,
    loop: true
});

export const thumpLo = createSound({
    src: ['./assets/thumplo.wav'],
    volume: .3
});

export const thumpHi = createSound({
    src: ['./assets/thumphi.wav'],
    volume: .3
});

export const extraLife = createSound({
    src: ['./assets/life.wav'],
    volume: .5
});

export const powerup = createSound({
    src: ['./assets/powerup.wav'],
    volume: .5
});

export const getPowerup = createSound({
    src: ['./assets/getpowerup.wav'],
    volume: .5
});

export const Sound = {
    on: () => {
        soundOn = true;
        all.forEach(sound => sound.volume(sound._origVolume));
    },
    off: () => {
        soundOn = false;
        // do not "stop" sound, just set volume to 0.
        all.forEach(sound => sound.volume(0));
    },
    stop: () => {
        all.forEach(sound => sound.stop());
    }
}