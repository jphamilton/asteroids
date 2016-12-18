declare var require;

import { Howl } from 'howler';

let shipFireWav  = require('../assets/fire.wav');
let explode1Wav = require('../assets/explode1.wav');
let explode2Wav = require('../assets/explode2.wav');
let explode3Wav = require('../assets/explode3.wav');
let alienFireWav = require('../assets/sfire.wav');
let thrustWav = require('../assets/thrust.wav');
let largeAlienWav = require('../assets/lsaucer.wav');
let loWav = require('../assets/thumplo.wav');
let hiWav = require('../assets/thumphi.wav');
let extraLifeWav = require('../assets/life.wav');

const VOLUME = .5;

let soundOn: boolean = true;

export const all = [];

function createSound(options) {
    const sound = new Howl(options);

    const play = sound.play.bind(sound);

    sound.play = () => {
        if (soundOn) {
            play();
        }
    };

    sound._origVolume = options.volume;

    all.push(sound);
    return sound;
}

export const fire = createSound({
    src: [shipFireWav],
    volume: VOLUME
});

export const thrust = createSound({
    src: [thrustWav],
    volume: 0.4
});

export const alienFire = createSound({
    src: [alienFireWav],
    volume: VOLUME
});

export const largeExplosion = createSound({
    src: [explode1Wav],
    volume: VOLUME
});

export const mediumExplosion = createSound({
    src: [explode2Wav],
    volume: VOLUME
});

export const smallExplosion = createSound({
    src: [explode3Wav],
    volume: VOLUME
});

export const largeAlien = createSound({
    src: [largeAlienWav],
    volume: VOLUME,
    loop: true
});

export const thumpLo = createSound({
    src: [loWav],
    volume: 1
});

export const thumpHi = createSound({
    src: [hiWav],
    volume: 1
});

export const extraLife = createSound({
    src: [extraLifeWav],
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
    }
}