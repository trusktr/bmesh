import { Empty, type AnyConstructor } from './constructor.js';
/** Linked list node mixin class. */
export declare function Link<T extends AnyConstructor = typeof Empty>(BaseClass?: T): {
    new (...a: any[]): {
        next: /*elided*/ any | null;
        prev: /*elided*/ any | null;
        /**
         * Set this to true if the linked list is circular.
         */
        circular: boolean;
        insertAfter(link: /*elided*/ any): void;
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
         * @param check - True to check for circularity (throws if not
         * circular), false to skip. Skipping is useful when the list is in
         * process of being constructed.
         */
        links(forward?: boolean, check?: boolean): Generator<[loop: /*elided*/ any, index: number], void, void>;
        linksReverse(check?: boolean): Generator<[loop: /*elided*/ any, index: number], void, void>;
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
         * for (const [l, i] of link) {
         *   doSomething(l, i)
         * }
         *
         * // Spread into an array:
         * const array = [...link]
         *
         * // Log them all:
         * console.log(...link)
         * ```
         */
        [Symbol.iterator]: (forward?: boolean, check?: boolean) => Generator<[loop: /*elided*/ any, index: number], void, void>;
    };
} & T;
/** Use this to refer to any Link in general. F.e. `const someLink: AnyLink = someLink` */
export type AnyLink = InstanceType<ReturnType<typeof Link>>;
export declare class NonCircularError extends Error {
    constructor();
}
