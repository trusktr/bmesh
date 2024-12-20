import { BMesh } from './BMesh.js';
import { Vertex } from './Vertex.js';
import { RadialLoopLink } from './Face.js';
import { BMeshElement } from './BMeshElement.js';
declare const DiskLink_base: {
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
/** A circular linked list of edges connected to a vertex. */
export declare class DiskLink extends DiskLink_base {
    next: DiskLink;
    prev: DiskLink;
    circular: boolean;
    edge: Edge;
    constructor(edge: Edge);
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
export declare class Edge extends BMeshElement {
    #private;
    /** The first vertex of this edge (order independent). */
    vertexA: Vertex;
    /** The second vertex of this edge (order independent). */
    vertexB: Vertex;
    /**
     * A circular linked list of Loops, one per face that share this edge (each
     * linked item is a whole radial for a face, not the items of a single face
     * radial). Unlike with face loops (the loops of a single radial), the order
     * of these loops does not matter.
     *
     * Don't write this directly, use the Loop constructor.
     */
    radialLink: RadialLoopLink | null;
    /**
     * The number of faces that share this edge (the number of radial loop links).
     *
     * Don't write this directly, use the Face constructor.
     */
    faceCount: number;
    /** A circular linked list of edges connected to vertexA, starting with this Edge. */
    diskLinkA: DiskLink;
    /** A circular linked list of edges connected to vertexB, starting with this Edge. */
    diskLinkB: DiskLink;
    constructor(mesh: BMesh, vertA: Vertex, vertB: Vertex);
    /**
     * Returns the DiskLink that connects this edge to the given vertex.
     */
    diskLink(vertex: Vertex): DiskLink;
    /**
     * Returns true if the vertex is one of the two vertices of this edge.
     */
    hasVertex(vertex: Vertex): boolean;
    /**
     * Returns the other vertex of this edge, given one of the two vertices.
     */
    otherVertex(vertex: Vertex): Vertex;
    /**
     * Returns the next edge link in the circular linked list of edges connected
     * to the given vertex.
     */
    nextEdgeLink(vertex: Vertex, forward?: boolean): DiskLink;
    /**
     * Returns the previous edge link in the circular linked list of edges
     * connected to the given vertex.
     */
    prevEdgeLink(vertex: Vertex): DiskLink;
    /**
     * Split this edge into two edges (one new edge) with a new vertex between
     * them. Optionally provide the vertex to place in the middle.
     *
     * @param existingVert - The existing vertex that is on one end of the edge
     * to split. The new Edge will be created between this vertex and the new
     * vertex.
     *
     * @param newVert - The vertex to place in between the old edge and the new
     * edge. If not provided, a new Vertex will be created, which will be located at
     * the midpoint of the old edge.
     *
     * @returns A tuple of the new vertex and the new edge.
     */
    split(existingVert: Vertex, newVert?: Vertex): [Vertex, Edge];
    /**
     * Extrude this edge by duplicating it and moving the vertices in the given direction. It will
     * create two new vertices, three new edges, and a new face.
     *
     * @returns The new edge that is parallel to this edge, typically the edge
     * that will be the new selection and will be translated by the user.
     */
    extrude(x?: number, y?: number, z?: number): Edge;
    /**
     * Remove this edge from the mesh, also removing any faces and loops.
     */
    remove(): void;
}
export declare class InvalidVertexError extends Error {
    constructor();
}
export {};
