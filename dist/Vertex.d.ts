import { BMesh } from './BMesh.js';
import { BMeshElement } from './BMeshElement.js';
import { DiskLink } from './Edge.js';
export declare class Vertex extends BMeshElement {
    x: number;
    y: number;
    z: number;
    /**
     * A circular linked list of edges that are connected to this vertex.
     * Do not modify this directly, use the Edge constructor.
     */
    readonly diskLink: DiskLink | null;
    /**
     * The number of edges that share this vertex.
     * Do not modify this directly, use the Edge constructor.
     */
    readonly edgeCount = 0;
    constructor(mesh: BMesh, x?: number, y?: number, z?: number);
    /**
     * Returns a tuple of the Vertex's xyz values. Pass an array if you want to
     * write to existing instead of new memory for performance.
     */
    toArray(target?: [number, number, number]): [number, number, number];
    /**
     * Remove this vertex from the mesh, also removing any connected edges, faces, and loops.
     */
    remove(): void;
}
