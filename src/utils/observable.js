function _forEachEventType(eventTypes, methodToExecute) {
    const eventNames = eventTypes.replace(/\s/g, '').split(',');
    eventNames.forEach(eventName => methodToExecute(eventName));
}

export class Observable {
    constructor() {
        this.observers = {};
    }

    emit(eventTypes, ...args) {
        const eventData = arguments;

            _forEachEventType(eventTypes, eventType => {
                const observers = this.observers[ eventType ];

                if (!observers) {
                    return;
                }

                observers.forEach(observer => observer.apply(null, eventData));
            });

        return this;
    }

    on(eventTypes, handler) {
        _forEachEventType(eventTypes, eventType => {
            if (!this.observers[ eventType ]) {
                this.observers[ eventType ] = [];
            }

            this.observers[ eventType ].push(handler);
        });

        return this;
    }

    off(eventTypes, handler) {
        if (!eventTypes) {
            this.observers = {};
            return this;
        }

        _forEachEventType(eventTypes, eventType => {
            if (!handler) {
                delete this.observers[ eventType ];
                return;
            }

            delete this.observers[ eventType ][ handler ];
        });

        return this;
    }
}
