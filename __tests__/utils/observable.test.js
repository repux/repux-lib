import { Observable } from '../../src/utils/observable';

describe('Observable', () => {
    it('should initialize observers with empty literal', () => {
        const observable = new Observable();
        expect(observable.observers).toEqual({});
    });

    it('should subscribe a handler for an event', () => {
        const observable = new Observable();
        const testEventType = 'testEventType';
        const testHandler = () => {
        };

        observable.subscribe(testEventType, testHandler);
        expect(observable.observers[testEventType][0]).toBe(testHandler);
    });

    it('should execute handler with parameters when emitting event', () => {
        expect.assertions(2);

        const observable = new Observable();
        const testEventType = 'testEventType';
        const testData = {
            a: 1,
            b: 1
        };
        const testHandler = (eventType, data) => {
            expect(eventType).toBe(testEventType);
            expect(data).toBe(testData);
        };

        observable.subscribe(testEventType, testHandler);
        observable.emit(testEventType, testData);
    });
});
