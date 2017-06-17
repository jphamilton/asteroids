interface TimerOptions {
    seconds: number;
    delay?: number;
    repeat?: boolean;
}

export class Timer {
    
    private repeat: boolean;
    private time: number = 0;
    private delay: number;
    private delayTime: number = 0;
    private seconds: number;
    private triggered: boolean;
    private cb: () => void;

    constructor(options: TimerOptions) {
        this.seconds = options.seconds;
        this.repeat = options.repeat !== undefined ? options.repeat : true;
        this.delay = options.delay !== undefined ? options.delay : 0;
    }

    update(dt: number) {
        if (this.triggered) {
            return;
        }

        if (this.delay && this.delayTime < this.delay) {
            this.delayTime += dt;
            if (this.delayTime > this.delay) {
                this.cb();
            }
            return;
        }

        this.time += dt;

        if (this.time >= this.seconds) {
            this.time = 0;
            this.cb();

            if (!this.repeat) {
                this.triggered = true;
            }
        } 
    }

    on(cb: () => void) {
        this.cb = cb;
    }
}

export class Timers {
    private timers: Timer[] = [];

    add(options: TimerOptions, cb: () => void) {
        const timer = new Timer(options);
        timer.on(cb);
        this.timers.push(timer);
    }

    update(dt: number) {
        this.timers.forEach(timer => timer.update(dt));
    }
}

