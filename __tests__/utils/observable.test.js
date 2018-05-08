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

        observable.on(testEventType, testHandler);
        expect(observable.observers[testEventType][0]).toBe(testHandler);
    });

    it('should execute handler with parameters when emitting event', async () => {
        expect.assertions(2);

        const observable = new Observable();
        const testEventType = 'testEventType';
        const testData = {
            a: 1,
            b: 1
        };

        await new Promise(resolve => {
            const testHandler = (eventType, data) => {
                expect(eventType).toBe(testEventType);
                expect(data).toBe(testData);
                resolve();
            };

            observable.on(testEventType, testHandler);
            observable.emit(testEventType, testData);
        });
    });

    it('should unsubscribe from all events', () => {
        const observable = new Observable();
        const testEventType = 'testEventType';
        const testHandler = () => {
        };

        observable.observers[testEventType] = [ testHandler ];
        observable.off();
        expect(observable.observers).toEqual({});
    });

    it('should unsubscribe from all events by type', () => {
        const observable = new Observable();
        const testEventType1 = 'testEventType1';
        const testEventType2 = 'testEventType2';
        const testHandler = () => {
        };

        observable.observers[testEventType1] = [ testHandler ];
        observable.observers[testEventType2] = [ testHandler ];
        observable.off(testEventType1);
        expect(observable.observers).toEqual({
            testEventType2: [ testHandler ]
        });
    });

    it('should unsubscribe from all events by type and handler', () => {
        const observable = new Observable();
        const testEventType = 'testEventType';
        const testHandler1 = () => {
        };
        const testHandler2 = () => {
        };

        observable.observers[testEventType] = [ testHandler1 ];
        observable.observers[testEventType] = [ testHandler2 ];
        observable.off(testEventType, testHandler1);
        expect(observable.observers).toEqual({
            testEventType: [ testHandler2 ]
        });
    });
});
