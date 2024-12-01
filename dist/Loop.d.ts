import { Edge } from './Edge.js';
import { Face, RadialLoopLink } from './Face.js';
import { Vertex } from './Vertex.js';
declare const Loop_base: {
    new (...a: any[]): {
        next: /*elided*/ any | null;
        prev: /*elided*/ any | null;
        circular: boolean;
        insertAfter(link: /*elided*/ any): void;
        insertBefore(link: /*elided*/ any): void;
        unlink(): void;
        iterator(forward?: boolean, checkCircular?: boolean): Iterator</*elided*/ any, any, any> & {
            [Symbol.iterator](): Iterator</*elided*/ any, any, any> & /*elided*/ any;
        };
        reverseIterator(checkCircular?: boolean): Iterator</*elided*/ any, any, any> & {
            [Symbol.iterator](): Iterator</*elided*/ any, any, any> & /*elided*/ any;
        };
        forEach(fn: (link: /*elided*/ any) => false | void, forward?: boolean, checkCircular?: boolean): void;
        forEachReverse(fn: (link: /*elided*/ any) => false | void, checkCircular?: boolean): void;
        [Symbol.iterator]: (forward?: boolean, checkCircular?: boolean) => Iterator</*elided*/ any, any, any> & {
            [Symbol.iterator](): Iterator</*elided*/ any, any, any> & /*elided*/ any;
        };
    };
} & typeof import("./constructor.js").Empty;
/**
 * A circular linked list of Loops that go around a Face, useful for traversing
 * the Edges of a Face.
 */
export declare class Loop extends Loop_base {
    next: Loop;
    prev: Loop;
    circular: boolean;
    vertex: Vertex;
    edge: Edge;
    face: Face;
    /** A circular linked list of Loops that share the same Edge. This Link contains this Loop. */
    radialLink: RadialLoopLink;
    /** Do not use this constructor directly, use Vertex, Edge, and Face constructors. */
    constructor(face: Face, vertex: Vertex, edge: Edge);
    /**
     * Returns true if the vertices match the loop, false otherwise.
     */
    verticesMatch(vertices: Vertex[], checkCircular?: boolean, forward?: boolean): boolean;
    /**
     * Returns true if the vertices in reverse match the loop, false otherwise.
     */
    verticesMatchReverse(vertices: Vertex[], check?: boolean): boolean;
}
export {};
