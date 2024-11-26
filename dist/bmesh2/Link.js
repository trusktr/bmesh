import { Empty } from './constructor.js';
/** Linked list node mixin class. */
export function Link(BaseClass = Empty) {
    //
    return class Link extends BaseClass {
        next = null;
        prev = null;
        // /** The first link in the linked list. */
        // start: Link | null = null
        // /** True if the linked list is circular. */
        // circular: boolean = false
        // ... emit an event (or come up with some pattern) on links when they
        // or their siblings are modified connected/disconnected, so we can
        // update external code to have correct references in case a link they
        // reference gets deleted (for example, next/prev state in a UI) ...
        constructor(...args) {
            super(...args);
        }
    };
}
