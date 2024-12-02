import { Vector3 } from 'three';
import { BMesh } from './BMesh.js';
import { BMeshElement } from './BMeshElement.js';
import { DiskLink, Edge } from './Edge.js';
export declare class Vertex extends BMeshElement {
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get z(): number;
    set z(value: number);
    position: Vector3;
    /**
     * A circular linked list of edges that are connected to this vertex.
     * Do not modify this directly, use the Edge constructor.
     */
    diskLink: DiskLink | null;
    /**
     * The number of edges that share this vertex.
     * Do not modify this directly, use the Edge constructor.
     */
    edgeCount: number;
    constructor(mesh: BMesh, x?: number, y?: number, z?: number);
    includesEdge(edge: Edge): boolean;
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
