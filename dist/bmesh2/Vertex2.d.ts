import { BMesh2 } from './BMesh2.js';
import { Edge2, EdgeLink } from './Edge2.js';
export declare class Vertex2 {
    x: number;
    y: number;
    z: number;
    /** All edges that are connected to this vertex. */
    /** A circular linked list of edges that are connected to this vertex. */
    edgeLink: EdgeLink | null;
    /** The number of edges that share this vertex. */
    edgeCount: number;
    constructor(mesh: BMesh2, x?: number, y?: number, z?: number);
    toArray(): [number, number, number];
    edgeLinks(): Generator<[link: EdgeLink, index: number], void, void>;
    /** Add an edge to the linked list of edges connected to this vertex. */
    addEdge(edge: Edge2): EdgeLink;
}
export declare class InvalidEdgeLinkError extends Error {
    constructor();
}
