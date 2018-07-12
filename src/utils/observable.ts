import { EventType } from '../types/event-type';

export interface EventHandler {
  (eventType: EventType, ...args: any[]): any
}

export class Observable {
  private handlers: Map<EventType, EventHandler[]>;

  constructor() {
    this.handlers = new Map<EventType, EventHandler[]>();
  }

  emit(eventTypes: EventType[] | EventType, ...args: any[]): Observable {
    setTimeout(() => {
      this.forEachEventType(eventTypes, (eventType: EventType) => {
          const handlers = this.handlers.get(eventType);

          if (!handlers) {
            return;
          }

          handlers.forEach((handler: EventHandler) => handler.apply(null, [ eventType, ...args ]));
        }
      );
    });

    return this;
  }

  on(eventTypes: EventType[] | EventType, handler: EventHandler): Observable {
    this.forEachEventType(eventTypes, eventType => {
      let handlers = this.handlers.get(eventType);

      if (!handlers) {
        handlers = [];
        this.handlers.set(eventType, handlers);
      }

      handlers.push(handler);
    });

    return this;
  }

  off(eventTypes?: EventType[] | EventType, handler?: any): Observable {
    if (!eventTypes || Array.isArray(eventTypes) && eventTypes.length === 0) {
      this.handlers = new Map<EventType, EventHandler[]>();
      return this;
    }

    this.forEachEventType(eventTypes, eventType => {
      if (!handler) {
        this.handlers.delete(eventType);
        return;
      }

      const handlers = this.handlers.get(eventType);

      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
      }
    });

    return this;
  }

  private forEachEventType(eventTypes: EventType[] | EventType, methodToExecute: (eventType: EventType) => void): void {
    if (!Array.isArray(eventTypes)) {
      eventTypes = [ eventTypes ];
    }

    eventTypes.forEach((eventType: EventType) => methodToExecute(eventType));
  }
}
