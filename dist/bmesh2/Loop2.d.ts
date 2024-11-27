import { Edge2 } from './Edge2.js';
import { Face2, RadialLoopLink } from './Face2.js';
import { Vertex2 } from './Vertex2.js';
declare const Loop2_base: {
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
export declare class Loop2 extends Loop2_base {
    next: Loop2;
    prev: Loop2;
    circular: boolean;
    readonly vertex: Vertex2;
    readonly edge: Edge2;
    readonly face: Face2;
    /** A circular linked list of Loops that share the same edge. This Link contains this Loop. */
    readonly radialLink: RadialLoopLink;
    /** Do not use this constructor directly, use Vertex, Edge, and Face constructors. */
    constructor(face: Face2, vertex: Vertex2, edge: Edge2);
    verticesMatch(vertices: Vertex2[], check?: boolean, forward?: boolean): boolean;
    verticesMatchReverse(vertices: Vertex2[], check?: boolean): boolean;
}
export {};
