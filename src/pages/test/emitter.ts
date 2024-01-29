// EventEmitter.ts
type EventHandler<T> = (data?: T) => void;

export class EventEmitter<T> {
    private events: Map<string, EventHandler<T>[]>;

    constructor() {
        this.events = new Map();
    }

    on(event: string, handler: EventHandler<T>): void {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)!.push(handler);
    }

    off(event: string, handler: EventHandler<T>): void {
        const handlers = this.events.get(event);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
    }

    emit(event: string, data?: T): void {
        const handlers = this.events.get(event);
        if (handlers) {
            handlers.forEach((handler) => handler(data));
        }
    }
}
