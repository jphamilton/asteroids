const timestamp = () => {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

let now;
let delta = 0;
let last = timestamp();
let step = 1/60;

const init = (update, render) => {

    const frame = () => {
        now = timestamp();
        delta = delta + Math.min(1, (now - last) / 1000);
        
        while(delta > step) {
            delta -= step;
            update(step);
            //update(delta);
        }

        render(delta);

        last = now;
        
        requestAnimationFrame(frame);        
    }

    frame();
}

export const loop = (update: (step: number)=> void, render: (delta: number) => void) => {
    init(update, render);
}





