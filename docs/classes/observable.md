[API Reference](../README.md) > [Observable](../classes/observable.md)

# Class: Observable

## Hierarchy

**Observable**

↳  [ProgressCrypto](progresscrypto.md)

## Index

### Constructors

* [constructor](observable.md#constructor)

### Methods

* [emit](observable.md#emit)
* [off](observable.md#off)
* [on](observable.md#on)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Observable**(): [Observable](observable.md)

*Defined in [src/utils/observable.ts:8](https://github.com/repux/repux-lib/blob/dcfa8fe/src/utils/observable.ts#L8)*

**Returns:** [Observable](observable.md)

___

## Methods

<a id="emit"></a>

###  emit

▸ **emit**(eventTypes: * [EventType](../enums/eventtype.md)[] &#124; [EventType](../enums/eventtype.md)*, ...args: *`any`[]*): [Observable](observable.md)

*Defined in [src/utils/observable.ts:19](https://github.com/repux/repux-lib/blob/dcfa8fe/src/utils/observable.ts#L19)*

Emits event

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| eventTypes |  [EventType](../enums/eventtype.md)[] &#124; [EventType](../enums/eventtype.md)|  types of events to emit |
| `Rest` args | `any`[] |  event data |

**Returns:** [Observable](observable.md)

___
<a id="off"></a>

###  off

▸ **off**(eventTypes?: * [EventType](../enums/eventtype.md)[] &#124; [EventType](../enums/eventtype.md)*, handler?: *`any`*): [Observable](observable.md)

*Defined in [src/utils/observable.ts:61](https://github.com/repux/repux-lib/blob/dcfa8fe/src/utils/observable.ts#L61)*

Usbuscribes from events

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| `Optional` eventTypes |  [EventType](../enums/eventtype.md)[] &#124; [EventType](../enums/eventtype.md)|  types of events to unsubscribe |
| `Optional` handler | `any` |  handler method |

**Returns:** [Observable](observable.md)

___
<a id="on"></a>

###  on

▸ **on**(eventTypes: * [EventType](../enums/eventtype.md)[] &#124; [EventType](../enums/eventtype.md)*, handler: *[EventHandler](../interfaces/eventhandler.md)*): [Observable](observable.md)

*Defined in [src/utils/observable.ts:41](https://github.com/repux/repux-lib/blob/dcfa8fe/src/utils/observable.ts#L41)*

Subscribes to events

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| eventTypes |  [EventType](../enums/eventtype.md)[] &#124; [EventType](../enums/eventtype.md)|  types of events to subscribe |
| handler | [EventHandler](../interfaces/eventhandler.md) |  handler method |

**Returns:** [Observable](observable.md)

___

