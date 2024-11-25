import { EdgeLink } from './Edge2.js';
export class Vertex2 {
    x;
    y;
    z;
    /** All edges that are connected to this vertex. */
    // edges: Set<Edge2> = new Set()
    /** A circular linked list of edges that are connected to this vertex. */
    edgeLink = null;
    /** The number of edges that share this vertex. */
    edgeCount = 0;
    // BM_vert_create
    constructor(mesh, x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        mesh.addVertex(this);
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    *edgeLinks() {
        if (!this.edgeLink)
            return;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let link = this.edgeLink;
        let i = 0;
        do {
            if (!link)
                throw new InvalidEdgeLinkError();
            yield [link, i++];
        } while ((link = link.next) != this.edgeLink);
    }
    /** Add an edge to the linked list of edges connected to this vertex. */
    addEdge(edge) {
        // if (!edge.hasVertex(this))
        const link = new EdgeLink(edge);
        if (!this.edgeLink)
            this.edgeLink = link.next = link.prev = link;
        const last = this.edgeLink.prev;
        last.next = link;
        link.prev = last;
        link.next = this.edgeLink;
        this.edgeLink.prev = link;
        this.edgeCount++;
        return link;
    }
}
export class InvalidEdgeLinkError extends Error {
    constructor() {
        super('Invalid EdgeLink loop detected. EdgeLinks should form a circular linked list.');
    }
}
