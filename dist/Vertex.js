import { Vector3 } from 'three';
import { BMesh } from './BMesh.js';
import { BMeshElement } from './BMeshElement.js';
import { DiskLink, Edge } from './Edge.js';
export class Vertex extends BMeshElement {
    get x() {
        return this.position.x;
    }
    set x(value) {
        this.position.x = value;
    }
    get y() {
        return this.position.y;
    }
    set y(value) {
        this.position.y = value;
    }
    get z() {
        return this.position.z;
    }
    set z(value) {
        this.position.z = value;
    }
    position = new Vector3();
    /**
     * A circular linked list of edges that are connected to this vertex.
     * Do not modify this directly, use the Edge constructor.
     */
    diskLink = null;
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
    // bmo_extrude_vert_indiv_exec (but for one vertex only, the UI operations call it with multiple selected vertices)
    /**
     * Create a new vertex at the given offset from this vertex, and connect
     * them. The UI will call this, then the user will move the new vertex.
     */
    extrude(x = 0, y = 0, z = 0) {
        const newVert = new Vertex(this.mesh, this.x + x, this.y + y, this.z + z);
        new Edge(this.mesh, this, newVert);
        return newVert;
    }
    includesEdge(edge) {
        return this.diskLink?.includes(edge.diskLink(this)) ?? false;
    }
    /**
     * Returns a tuple of the Vertex's xyz values. Pass an array if you want to
     * write to existing instead of new memory for performance.
     */
    toArray(target = [this.x, this.y, this.z]) {
        if (target)
            (target[0] = this.x), (target[1] = this.y), (target[2] = this.z);
        return target;
    }
    // BM_vert_kill
    /**
     * Remove this vertex from the mesh, also removing any connected edges, faces, and loops.
     */
    remove() {
        for (const link of [...(this.diskLink ?? [])])
            link.edge.remove();
        this.mesh.vertices.delete(this);
    }
}
