import { BMesh2 } from './BMesh2.js';
import { BMeshElement } from './BMeshElement.js';
import { EdgeLink } from './Edge2.js';
export class Vertex2 extends BMeshElement {
    x;
    y;
    z;
    /**
     * A circular linked list of edges that are connected to this vertex.
     * Do not modify this directly, use the Edge constructor.
     */
    edgeLink = null;
    /**
     * The number of edges that share this vertex.
     * Do not modify this directly, use the Edge constructor.
     */
    edgeCount = 0;
    // BM_vert_create
    constructor(mesh, x = 0, y = 0, z = 0) {
        super(mesh);
        this.x = x;
        this.y = y;
        this.z = z;
        mesh.addVertex(this);
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    // BM_vert_kill
    /** Remove this vertex from the mesh, also removing any connected edges, faces, and loops. */
    remove() {
        for (const [link] of [...(this.edgeLink ?? [])])
            link.edge.remove();
        this.mesh.vertices.delete(this);
    }
}
