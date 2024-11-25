import { BMesh2 } from './BMesh2.js';
import { Edge2 } from './Edge2.js';
import { Face2, RadialLink } from './Face2.js';
import { Link } from './Link.js';
import { Vertex2 } from './Vertex2.js';
export declare class Loop2 extends Link {
    vertex: Vertex2;
    edge: Edge2;
    face: Face2;
    next: Loop2 | null;
    prev: Loop2 | null;
    radialLink: RadialLink;
    constructor(mesh: BMesh2, face: Face2, vertex: Vertex2, edge: Edge2, next?: Loop2 | null, prev?: Loop2 | null);
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
