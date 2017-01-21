declare var require;

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