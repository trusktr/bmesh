import { Edge2 } from './Edge2.js';
import { Face2, RadialLoopLink } from './Face2.js';
import { Vertex2 } from './Vertex2.js';
declare const Loop2_base: {
    new (...args: any[]): {
        next: /*elided*/ any | null;
        prev: /*elided*/ any | null;
    };
} & typeof import("./constructor.js").Empty;
export declare class Loop2 extends Loop2_base {
    next: Loop2 | null;
    prev: Loop2 | null;
    readonly vertex: Vertex2;
    readonly edge: Edge2;
    readonly face: Face2;
    /** A circular linked list of Loops that share the same edge. This Link contains this Loop. */
    readonly radialLink: RadialLoopLink;
    /** Do not use this constructor directly, use Vertex, Edge, and Face constructors. */
    constructor(face: Face2, vertex: Vertex2, edge: Edge2, next?: Loop2 | null, prev?: Loop2 | null);
    /**
     * Iterate all the Loops of the current radial loop (the current face, the
     * current circular linked list).
     */
    radial(forward?: boolean, check?: boolean): Generator<[loop: Loop2, index: number], void, void>;
    /**
     * Iterate all the Loops of the current radial loop (the current face, the
     * current circular linked list) in reverse.
     */
    radialReverse(check?: boolean): Generator<[loop: Loop2, index: number], void, void>;
    verticesMatch(vertices: Vertex2[], check?: boolean, forward?: boolean): boolean;
    verticesMatchReverse(vertices: Vertex2[], check?: boolean): boolean;
}
export declare class InvalidLoopError extends Error {
    constructor();
}
export {};
