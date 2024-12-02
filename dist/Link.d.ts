import { Empty, type AnyConstructor } from './constructor.js';
/**
 * A mixin class to add linked list functionality to any class.
 */
export declare function Link<T extends AnyConstructor = typeof Empty>(BaseClass?: T): {
    new (...a: any[]): {
        next: /*elided*/ any | null;
        prev: /*elided*/ any | null;
        /**
         * Set this to true if the linked list is circular.
         */
        circular: boolean;
        /**
         * Insert a Link after this Link in the linked list.
         */
        insertAfter(link: /*elided*/ any): void;
        /**
         * Insert a Link before this Link in the linked list.
         */
        insertBefore(link: /*elided*/ any): void;
        /**
         * Remove this Link from the linked list.
         */
        unlink(): void;
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
        iterator(forward?: boolean, checkCircular?: boolean): Iterator</*elided*/ any, any, any> & {
            [Symbol.iterator](): Iterator</*elided*/ any, any, any> & /*elided*/ any;
        };
        reverseIterator(checkCircular?: boolean): Iterator</*elided*/ any, any, any> & {
            [Symbol.iterator](): Iterator</*elided*/ any, any, any> & /*elided*/ any;
        };
        /**
         * Run a function for each Link in the linked list. If the function
         * returns `false`, the loop stops.
         */
        forEach(fn: (link: /*elided*/ any) => boolean | void, forward?: boolean, checkCircular?: boolean): void;
        forEachReverse(fn: (link: /*elided*/ any) => false | void, checkCircular?: boolean): void;
        includes(link: /*elided*/ any): boolean;
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
        [Symbol.iterator]: (forward?: boolean, checkCircular?: boolean) => Iterator</*elided*/ any, any, any> & {
            [Symbol.iterator](): Iterator</*elided*/ any, any, any> & /*elided*/ any;
        };
    };
} & T;
/** Use this to refer to any Link in general. F.e. `const someLink: AnyLink = someLink` */
export type AnyLink = InstanceType<ReturnType<typeof Link>>;
export declare class NonCircularError extends Error {
    constructor();
}
