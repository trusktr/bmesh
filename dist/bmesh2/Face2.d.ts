import { BMesh2 } from './BMesh2.js';
import { Loop2 } from './Loop2.js';
import { Edge2 } from './Edge2.js';
import { Vertex2 } from './Vertex2.js';
import { BMeshElement } from './BMeshElement.js';
declare const RadialLoopLink_base: {
    new (...args: any[]): {
        next: /*elided*/ any | null;
        prev: /*elided*/ any | null;
    };
} & typeof import("./constructor.js").Empty;
/**
 * To represent a linked list of Loops for faces that share the same edge.
 */
export declare class RadialLoopLink extends RadialLoopLink_base {
    next: RadialLoopLink | null;
    prev: RadialLoopLink | null;
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
