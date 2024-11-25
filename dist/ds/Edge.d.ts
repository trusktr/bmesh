import type Vertex from './Vertex.js';
import type Loop from './Loop.js';
export declare class DiskLink {
    next: Edge;
    prev: Edge;
}
export declare class Edge {
    id: string;
    v1: Vertex;
    v2: Vertex;
    loop: Loop | null;
    v1_disk: DiskLink;
    v2_disk: DiskLink;
    constructor(v1?: Vertex, v2?: Vertex);
    getDiskFromVert(v: Vertex): DiskLink;
    diskEdgeNext(v: Vertex): Edge;
    diskEdgePrev(v: Vertex): Edge;
    vertExists(v: Vertex): boolean;
    getOtherVert(v: Vertex): Vertex | null;
}
export default Edge;
