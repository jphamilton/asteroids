import { Howl } from 'howler';
import lifeSrc from './assets/life.wav';
import thumpHiSrc from './assets/thumphi.wav';
import thumpLoSrc from './assets/thumplo.wav';
import smallAlienSrc from './assets/ssaucer.wav';
import largeAlienSrc from './assets/lsaucer.wav';
import smallExplosionSrc from './assets/explode3.wav';
import mediumExplosionSrc from './assets/explode2.wav';
import largeExplosionSrc from './assets/explode1.wav';
import alienFireSrc from './assets/sfire.wav';
import thrustSrc from './assets/thrust.wav';
import fireSrc from './assets/fire.wav';

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
    src: [fireSrc],
    volume: .2
});

export const thrust = createSound({
    src: [thrustSrc],
    volume: 0.3,
    loop: true
});

export const alienFire = createSound({
    src: [alienFireSrc],
    volume: VOLUME
});

export const largeExplosion = createSound({
    src: [largeExplosionSrc],
    volume: VOLUME,
    max: 2
});

export const mediumExplosion = createSound({
    src: [mediumExplosionSrc],
    volume: VOLUME,
    max: 2
});

export const smallExplosion = createSound({
    src: [smallExplosionSrc],
    volume: VOLUME,
    max: 2
});

export const largeAlien = createSound({
    src: [largeAlienSrc],
    volume: VOLUME,
    loop: true
});

export const smallAlien = createSound({
    src: [smallAlienSrc],
    volume: VOLUME,
    loop: true
});

export const thumpLo = createSound({
    src: [thumpLoSrc],
    volume: .3
});

export const thumpHi = createSound({
    src: [thumpHiSrc],
    volume: .3
});

export const extraLife = createSound({
    src: [lifeSrc],
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