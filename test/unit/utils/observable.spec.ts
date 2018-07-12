import { expect } from 'chai';
import { Observable } from '../../../src/utils/observable';
import { EventType } from '../../../src/types/event-type';

describe('Observable', () => {
  it('should initialize handlers with empty literal', () => {
    const observable = new Observable();
    expect(observable[ 'handlers' ].size).to.equal(0);
  });

  it('should subscribe a handler for an event', () => {
    const observable = new Observable();
    const testEventType = EventType.FINISH;
    const testHandler = () => {
    };

    observable.on(testEventType, testHandler);

    const eventTypeHandlers = observable[ 'handlers' ].get(testEventType);
    expect(eventTypeHandlers).to.not.equal(undefined);

    if (eventTypeHandlers) {
      expect(eventTypeHandlers[ 0 ]).to.deep.equal(testHandler);
    }
  });

  it('should execute handler with parameters when emitting event', async () => {
    const observable = new Observable();
    const testEventType = EventType.FINISH;
    const testData = {
      a: 1,
      b: 1
    };

    await new Promise(resolve => {
      const testHandler = (eventType: EventType, data: {}) => {
        expect(eventType).to.deep.equal(testEventType);
        expect(data).to.deep.equal(testData);
        resolve();
      };

      observable.on(testEventType, testHandler);
      observable.emit(testEventType, testData);
    });
  });

  it('should unsubscribe from all events', () => {
    const observable = new Observable();
    const testEventType = EventType.FINISH;
    const testHandler = () => {
    };

    observable[ 'handlers' ].set(testEventType, [ testHandler ]);
    observable.off();
    expect(observable[ 'handlers' ].size).to.equal(0);
  });

  it('should unsubscribe from all events by type', () => {
    const observable = new Observable();
    const testEventType1 = EventType.FINISH;
    const testEventType2 = EventType.PROGRESS;
    const testHandler = () => {
    };

    observable[ 'handlers' ].set(testEventType1, [ testHandler ]);
    observable[ 'handlers' ].set(testEventType2, [ testHandler ]);
    observable.off(testEventType1);
    expect(observable[ 'handlers' ].has(testEventType1)).to.equal(false);
    expect(observable[ 'handlers' ].has(testEventType2)).to.equal(true);
  });

  it('should unsubscribe from all events by type and handler', () => {
    const observable = new Observable();
    const testEventType = EventType.FINISH;
    const testHandler1 = () => {
    };
    const testHandler2 = () => {
    };

    observable[ 'handlers' ].set(testEventType, [ testHandler1 ]);
    observable[ 'handlers' ].set(testEventType, [ testHandler2 ]);
    observable.off(testEventType, testHandler1);
    expect(observable[ 'handlers' ].get(testEventType)).to.deep.equal([ testHandler2 ]);
  });
});
