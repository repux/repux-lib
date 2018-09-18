import { EventType } from '../types/event-type';
export interface EventHandler {
    (eventType: EventType, ...args: any[]): any;
}
export declare class Observable {
    private handlers;
    constructor();
    /**
     * Emits event
     * @param eventTypes - types of events to emit
     * @param args - event data
     */
    emit(eventTypes: EventType[] | EventType, ...args: any[]): Observable;
    /**
     * Subscribes to events
     * @param eventTypes - types of events to subscribe
     * @param handler - handler method
     */
    on(eventTypes: EventType[] | EventType, handler: EventHandler): Observable;
    /**
     * Usbuscribes from events
     * @param eventTypes - types of events to unsubscribe
     * @param handler - handler method
     */
    off(eventTypes?: EventType[] | EventType, handler?: any): Observable;
    private forEachEventType;
}
