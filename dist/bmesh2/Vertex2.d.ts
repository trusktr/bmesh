import { BMesh2 } from './BMesh2.js';
import { BMeshElement } from './BMeshElement.js';
import { EdgeLink } from './Edge2.js';
export declare class Vertex2 extends BMeshElement {
    x: number;
    y: number;
    z: number;
    /**
     * A circular linked list of edges that are connected to this vertex.
     * Do not modify this directly, use the Edge constructor.
     */
    readonly edgeLink: EdgeLink | null;
    /**
     * The number of edges that share this vertex.
     * Do not modify this directly, use the Edge constructor.
     */
    readonly edgeCount = 0;
    constructor(mesh: BMesh2, x?: number, y?: number, z?: number);
    toArray(): [number, number, number];
    edgeLinks(forward?: boolean, check?: boolean): Generator<[link: EdgeLink, index: number], void, void>;
    /** Remove this vertex from the mesh, also removing any connected edges, faces, and loops. */
    remove(): void;
}
export declare class InvalidEdgeLinkError extends Error {
    constructor();
}
