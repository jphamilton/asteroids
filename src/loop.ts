const timestamp = () => {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

let now;
let dt   = 0;
let last = timestamp();
let step = 1/60;
let u;
let r;

const init = (update, render) => {

    const frame = () => {
        now = timestamp();
        dt = dt + Math.min(1, (now - last) / 1000);
        
        while(dt > step) {
            dt = dt - step;
            update(step);
        }

        render(dt);

        last = now;
        
        requestAnimationFrame(frame);        
    }

    frame();
}

export const loop = (update: (step: number)=> void, render: (delta: number) => void) => {
    init(update, render);
}





