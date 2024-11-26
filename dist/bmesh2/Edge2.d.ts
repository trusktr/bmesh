import { BMesh2 } from './BMesh2.js';
import { Vertex2 } from './Vertex2.js';
import { RadialLoopLink } from './Face2.js';
import { BMeshElement } from './BMeshElement.js';
declare const EdgeLink_base: {
    new (...args: any[]): {
        next: /*elided*/ any | null;
        prev: /*elided*/ any | null;
    };
} & typeof import("./constructor.js").Empty;
export declare class EdgeLink extends EdgeLink_base {
    next: EdgeLink | null;
    prev: EdgeLink | null;
    readonly edge: Edge2;
    constructor(edge: Edge2);
}
/**
 * Edges connect two vertices. They are non-directional, meaning an edge with
 * two vertices for vertexA and vertexB is the same edge if the same two
 * vertices are assigned to vertexB and vertexA instead.
 *
 * Only Loops determine direction for a given loop. Within a particular loop an
 * some edges may go from vertexA to vertexB, and others from vertexB to
 * vertexA.
 */
export declare class Edge2 extends BMeshElement {
    #private;
    /** The first vertex of this edge (order independent). */
    readonly vertexA: Vertex2;
    /** The second vertex of this edge (order independent). */
    readonly vertexB: Vertex2;
    /**
     * A circular linked list of Loops, one per face that share this edge (each
     * linked item is a whole radial for a face, not the items of a single face
     * radial). Unlike with face loops (the loops of a single radial), the order
     * of these loops does not matter.
     *
     * Don't write this directly, use the Loop constructor.
     */
    readonly radialLink: RadialLoopLink | null;
    /**
     * The number of faces that share this edge (the number of radial loop links).
     *
     * Don't write this directly, use the Face constructor.
     */
    readonly faceCount = 0;
    /** A circular linked list of edges connected to vertexA. */
    readonly edgeLinkA: EdgeLink;
    /** A circular linked list of edges connected to vertexB. */
    readonly edgeLinkB: EdgeLink;
    constructor(mesh: BMesh2, vertA: Vertex2, vertB: Vertex2);
    hasVertex(vertex: Vertex2): boolean;
    otherVertex(vertex: Vertex2): Vertex2;
    nextEdgeLink(vertex: Vertex2, forward?: boolean): EdgeLink;
    prevEdgeLink(vertex: Vertex2): EdgeLink;
    /**
     * Iterate all the Loops of the current face loop (current circular linked
     * list for the face).
     */
    radialLinks(forward?: boolean, check?: boolean): Generator<[link: RadialLoopLink, index: number], void, void>;
    radialLinksReverse(check?: boolean): Generator<[link: RadialLoopLink, index: number], void, void>;
    /** Remove this edge from the mesh, also removing any faces and loops. */
    remove(): void;
}
export declare class InvalidRadialLinkError extends Error {
    constructor();
}
export {};
