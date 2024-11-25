import { BMesh2 } from './BMesh2.js';
import { Link } from './Link.js';
import { InvalidEdgeLinkError } from './Vertex2.js';
import { RadialLink } from './Face2.js';
export class EdgeLink extends Link {
    next = null;
    prev = null;
    edge;
    constructor(edge) {
        super();
        this.edge = edge;
    }
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
export class Edge2 {
    /** The first vertex of this edge (order independent). */
    vertexA;
    /** The second vertex of this edge (order independent). */
    vertexB;
    /**
     * A circular linked list of Loops, one per face that share this edge.
     * Unlike with face loops, the order of these loops does not matter.
     */
    radialLink = null;
    /** The number of faces that share this edge. */
    faceCount = 0;
    /** A circular linked list of edges connected to vertexA. */
    edgeLinkA;
    /** A circular linked list of edges connected to vertexB. */
    edgeLinkB;
    // BM_edge_create
    constructor(mesh, vertA, vertB) {
        this.vertexA = vertA;
        this.vertexB = vertB;
        // avoid duplicate edges
        const edge = BMesh2.existingEdge(vertA, vertB);
        if (edge)
            return edge;
        this.edgeLinkA = vertA.addEdge(this);
        this.edgeLinkB = vertB.addEdge(this);
        mesh.addEdge(this);
    }
    hasVertex(vertex) {
        return this.vertexA === vertex || this.vertexB === vertex;
    }
    otherVertex(vertex) {
        if (this.vertexA === vertex)
            return this.vertexB;
        if (this.vertexB === vertex)
            return this.vertexA;
        throw new TypeError('vertex is not from this edge');
    }
    addLoop(loop) {
        if (loop.radialLink)
            throw new TypeError('loop already belongs to another edge');
        loop.edge = this;
        const link = (loop.radialLink = new RadialLink(loop));
        if (!this.radialLink)
            this.radialLink = link.next = link.prev = link;
        const last = this.radialLink.prev;
        last.next = link;
        link.prev = last;
        link.next = this.radialLink;
        this.radialLink.prev = link;
        this.faceCount++;
        return link;
    }
    nextEdgeLink(vertex, forward = true) {
        let next = undefined;
        if (vertex === this.vertexA)
            next = forward ? this.edgeLinkA.next : this.edgeLinkA.prev;
        if (vertex === this.vertexB)
            next = forward ? this.edgeLinkB.next : this.edgeLinkB.prev;
        if (next === undefined)
            throw new TypeError('vertex is not from this edge');
        if (!next)
            throw new InvalidEdgeLinkError();
        return next;
    }
    prevEdgeLink(vertex) {
        return this.nextEdgeLink(vertex, false);
    }
    /**
     * Iterate all the Loops of the current radial loop (the current face, the
     * current circular linked list).
     */
    *radialLinks() {
        if (!this.radialLink)
            return;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let link = this.radialLink;
        let i = 0;
        do {
            if (!link)
                throw new InvalidRadialLinkError();
            yield [link, i++];
        } while ((link = link.next) != this.radialLink);
    }
}
export class InvalidRadialLinkError extends Error {
    constructor() {
        super('Invalid RadialLink loop detected. RadialLinks should form a circular linked list.');
    }
}
