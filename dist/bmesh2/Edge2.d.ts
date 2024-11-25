import { BMesh2 } from './BMesh2.js';
import { Loop2 } from './Loop2.js';
import { Link } from './Link.js';
import { Vertex2 } from './Vertex2.js';
import { RadialLink } from './Face2.js';
export declare class EdgeLink extends Link {
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
export declare class Edge2 {
    /** The first vertex of this edge (order independent). */
    vertexA: Vertex2;
    /** The second vertex of this edge (order independent). */
    vertexB: Vertex2;
    /**
     * A circular linked list of Loops, one per face that share this edge.
     * Unlike with face loops, the order of these loops does not matter.
     */
    radialLink: RadialLink | null;
    /** The number of faces that share this edge. */
    faceCount: number;
    /** A circular linked list of edges connected to vertexA. */
    edgeLinkA: EdgeLink;
    /** A circular linked list of edges connected to vertexB. */
    edgeLinkB: EdgeLink;
    constructor(mesh: BMesh2, vertA: Vertex2, vertB: Vertex2);
    hasVertex(vertex: Vertex2): boolean;
    otherVertex(vertex: Vertex2): Vertex2;
    addLoop(loop: Loop2): RadialLink;
    nextEdgeLink(vertex: Vertex2, forward?: boolean): EdgeLink;
    prevEdgeLink(vertex: Vertex2): EdgeLink;
    /**
     * Iterate all the Loops of the current radial loop (the current face, the
     * current circular linked list).
     */
    radialLinks(): Generator<[link: RadialLink, index: number], void, void>;
}
export declare class InvalidRadialLinkError extends Error {
    constructor();
}
