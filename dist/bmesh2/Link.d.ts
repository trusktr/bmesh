import { Empty, type AnyConstructor } from './constructor.js';
/** Linked list node mixin class. */
export declare function Link<T extends AnyConstructor = typeof Empty>(BaseClass?: T): {
    new (...args: any[]): {
        next: /*elided*/ any | null;
        prev: /*elided*/ any | null;
    };
} & T;
/** Use this to refer to any Link in general. F.e. `const someLink: TLink = anyLink` */
export type AnyLink = InstanceType<ReturnType<typeof Link>>;
