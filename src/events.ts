export class EventSource {
    
    protected handlers: { [event: string]: ((...args: any[])=> void)[]} = {};

    on(event: string, handler: (...args: any[]) => void) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(handler); 
    }

    off(event: string, handler: (...args: any[]) => void) {
        this.handlers[event] = this.handlers[event].filter(x => x !== handler); 
    }

    trigger(event: string, ...args: any[] ) {
        const handlers = this.handlers[event] || [];
        handlers.forEach(x => x(this, ...args));
    }
    
}