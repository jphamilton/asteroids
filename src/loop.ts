const timestamp = () => {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

let now;
let delta = 0;
let last = timestamp();
let dt = 1/60;

const init = (state: IGameState) => {

    const frame = () => {
        now = timestamp();
        delta += Math.min(1, (now - last) / 1000);
        
        while(delta > dt) {
            state.update(dt);
            delta -= dt;
        }

        state.render(delta);

        last = now;
        
        requestAnimationFrame(frame);        
    }

    frame();
}

export const loop = (state: IGameState) => {
    init(state);
}





