import { BMesh2 } from './BMesh2.js';
import { Loop2 } from './Loop2.js';
import { Edge2 } from './Edge2.js';
import { Vertex2 } from './Vertex2.js';
import { BMeshElement } from './BMeshElement.js';
declare const RadialLoopLink_base: {
    new (...a: any[]): {
        next: /*elided*/ any | null;
        prev: /*elided*/ any | null;
        circular: boolean;
        insertAfter(link: /*elided*/ any): void;
        insertBefore(link: /*elided*/ any): void;
        unlink(): void;
        links(forward?: boolean, check?: boolean): Generator<[loop: /*elided*/ any, index: number], void, void>;
        linksReverse(check?: boolean): Generator<[loop: /*elided*/ any, index: number], void, void>;
        [Symbol.iterator]: (forward?: boolean, check?: boolean) => Generator<[loop: /*elided*/ any, index: number], void, void>;
    };
} & typeof import("./constructor.js").Empty;
/**
 * To represent a linked list of Loops for faces that share the same edge.
 */
export declare class RadialLoopLink extends RadialLoopLink_base {
    next: RadialLoopLink;
    prev: RadialLoopLink;
    circular: boolean;
    readonly loop: Loop2;
    constructor(loop: Loop2);
}
export declare class Face2 extends BMeshElement {
    #private;
    readonly loop: Loop2;
    readonly edgeCount: number;
    constructor(mesh: BMesh2, vertices: Vertex2[], edges: Edge2[]);
    remove(): void;
}
export {};
