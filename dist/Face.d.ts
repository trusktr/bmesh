import { BMesh } from './BMesh.js';
import { Loop } from './Loop.js';
import { Edge } from './Edge.js';
import { Vertex } from './Vertex.js';
import { BMeshElement } from './BMeshElement.js';
declare const RadialLoopLink_base: {
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
        forEach(fn: (link: /*elided*/ any) => boolean | void, forward?: boolean, checkCircular?: boolean): void;
        forEachReverse(fn: (link: /*elided*/ any) => false | void, checkCircular?: boolean): void;
        includes(link: /*elided*/ any): boolean;
        [Symbol.iterator]: (forward?: boolean, checkCircular?: boolean) => Iterator</*elided*/ any, any, any> & {
            [Symbol.iterator](): Iterator</*elided*/ any, any, any> & /*elided*/ any;
        };
    };
} & typeof import("./constructor.js").Empty;
/**
 * To represent a linked list of Loops for faces that share the same edge.
 */
export declare class RadialLoopLink extends RadialLoopLink_base {
    next: RadialLoopLink;
    prev: RadialLoopLink;
    circular: boolean;
    loop: Loop;
    constructor(loop: Loop);
}
export declare class Face extends BMeshElement {
    #private;
    loop: Loop;
    edgeCount: number;
    constructor(mesh: BMesh, vertices: Vertex[], edges?: Edge[]);
    extrude(x?: number, y?: number, z?: number, dupeFace?: boolean): Face;
    /**
     * Remove this face and its loops from the mesh.
     */
    remove(): void;
}
export {};
