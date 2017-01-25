import screen from './screen';
import { EventSource } from './events';

export class Flash extends EventSource implements IGameState { 

    constructor(private frames: number) {
        super();
    }

    render() {
        this.draw();   
    }

    update(dt: number) {
        this.frames--;
        if (this.frames <= 0) {
            this.trigger('expired');
        }
    }

    draw() {
        screen.draw.background('#ffffff');
        screen.draw.scanlines();
    }
    
}