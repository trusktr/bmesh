import { Empty } from './constructor.js';
/**
 * A mixin class to add linked list functionality to any class.
 */
// See https://jsperf.app/xuxuqo/5 for benchmarking iteration methods.
// TODO use an event pattern (or some pattern) for when links or their
// siblings are connected/disconnected, so we can update external code
// to have correct references in case a link they reference gets deleted
// (for example, next/prev state in a UI).
export function Link(BaseClass = Empty) {
    //
    return class Link extends BaseClass {
        next = null;
        prev = null;
        // /** The first link in the linked list. */
        // start: Link = this
        /**
         * Set this to true if the linked list is circular.
         */
        circular = false;
        /**
         * Insert a Link after this Link in the linked list.
         */
        insertAfter(link) {
            link.unlink(); // remove from previous list if any
            const next = this.next;
            this.next = link;
            link.prev = this;
            link.next = next;
            if (next)
                next.prev = link;
        }
        /**
         * Insert a Link before this Link in the linked list.
         */
        insertBefore(link) {
            link.unlink(); // remove from previous list if any
            const prev = this.prev;
            this.prev = link;
            link.next = this;
            link.prev = prev;
            if (prev)
                prev.next = link;
        }
        /**
         * Remove this Link from the linked list.
         */
        unlink() {
            const nextLink = this.next;
            const prevLink = this.prev;
            this.next = this.circular ? this : null;
            this.prev = this.circular ? this : null;
            if (prevLink)
                prevLink.next = nextLink; // if circular, and pointing to itself again, that's fine, it'll be GC'd
            if (nextLink)
                nextLink.prev = prevLink;
        }
        /**
         * Returns an iterator for iterating over all Links in th linked list.
         *
         * @param forward - True to iterate forward, false to iterate backward.
         *
         * @param checkCircular - True to check for circularity (throws if not
         * circular), false to skip. Skipping is useful when the list is in
         * process of being constructed.
         *
         * This handles several cases:
         * - circular linked list (throw if not circular)
         * - circular linked list but checkCircular is false (skip check, don't throw)
         * - non-circular linked list (stop at null)
         */
        iterator(forward = true, checkCircular = true) {
            // return a custom iterator without using the links() generator:
            let link = this;
            let i = 0;
            const iterator = {
                [Symbol.iterator]: () => iterator,
                next: () => {
                    if (!link || (i !== 0 && link === this)) {
                        if (!link && this.circular && checkCircular)
                            throw new NonCircularError();
                        return { done: true, value: undefined };
                    }
                    const value = link;
                    link = forward ? link.next : link.prev;
                    i++;
                    return { done: false, value };
                },
            };
            return iterator;
        }
        reverseIterator(checkCircular = true) {
            return this.iterator(true, checkCircular);
        }
        /**
         * This integrates linked list iteration with built-in syntax. For example:
         *
         * ```ts
         * class MyLink extends Link() {...}
         *
         * const link = new MyLink()
         *
         * // ... attach any number of links together ...
         *
         * // Iterate over them using for-of syntax:
         * for (const l of link) doSomething(l)
         *
         * // Spread into an array:
         * const array = [...link]
         *
         * // Log them all:
         * console.log(...link)
         * ```
         */
        // ~2.8 times slower than plain do-while loop (with for-of syntax).
        [Symbol.iterator] = this.iterator;
        /**
         * Run a function for each Link in the linked list. If the function
         * returns `false`, the loop stops.
         */
        // Also ~2.8 times slower than plain do-while loop.
        forEach(fn, forward = true, checkCircular = true) {
            let link = this;
            while (link) {
                const l = link;
                link = forward ? link.next : link.prev;
                if (this.circular && checkCircular && !link)
                    throw new NonCircularError();
                if (fn(l) === false)
                    break;
                if (link === this)
                    break; // circular done
            }
        }
        forEachReverse(fn, checkCircular = true) {
            this.forEach(fn, false, checkCircular);
        }
        includes(link) {
            let found = false;
            this.forEach(l => {
                if (l === link) {
                    found = true;
                    return false;
                }
                return true;
            });
            return found;
        }
    };
}
export class NonCircularError extends Error {
    constructor() {
        super('Expected linked list to be circular.');
    }
}
