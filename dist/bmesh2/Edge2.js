import { BMesh2 } from './BMesh2.js';
import { Link } from './Link.js';
import { InvalidEdgeLinkError, Vertex2 } from './Vertex2.js';
import { RadialLoopLink } from './Face2.js';
import { BMeshElement } from './BMeshElement.js';
export class EdgeLink extends Link() {
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
export class Edge2 extends BMeshElement {
    /** The first vertex of this edge (order independent). */
    vertexA;
    /** The second vertex of this edge (order independent). */
    vertexB;
    /**
     * A circular linked list of Loops, one per face that share this edge (each
     * linked item is a whole radial for a face, not the items of a single face
     * radial). Unlike with face loops (the loops of a single radial), the order
     * of these loops does not matter.
     *
     * Don't write this directly, use the Loop constructor.
     */
    radialLink = null;
    /**
     * The number of faces that share this edge (the number of radial loop links).
     *
     * Don't write this directly, use the Face constructor.
     */
    faceCount = 0;
    /** A circular linked list of edges connected to vertexA. */
    edgeLinkA;
    /** A circular linked list of edges connected to vertexB. */
    edgeLinkB;
    // BM_edge_create
    constructor(mesh, vertA, vertB) {
        super(mesh);
        this.vertexA = vertA;
        this.vertexB = vertB;
        // avoid duplicate edges
        const edge = BMesh2.existingEdge(vertA, vertB);
        if (edge)
            return edge;
        this.edgeLinkA = this.#associateVert(vertA);
        this.edgeLinkB = this.#associateVert(vertB);
        mesh.addEdge(this);
    }
    /**
     * Add an edge to the linked list of edges connected to this vertex.
     */
    #associateVert(vert) {
        const link = new EdgeLink(this);
        // @ts-expect-error internal write of edgeLink
        if (!vert.edgeLink)
            vert.edgeLink = link.next = link.prev = link;
        const last = vert.edgeLink.prev;
        last.next = link;
        link.prev = last;
        link.next = vert.edgeLink;
        vert.edgeLink.prev = link;
        // @ts-expect-error internal write of edgeCount
        vert.edgeCount++;
        return link;
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
     * Iterate all the Loops of the current face loop (current circular linked
     * list for the face).
     */
    *radialLinks(forward = true, check = true) {
        if (!this.radialLink)
            return;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let link = this.radialLink;
        let i = 0;
        do {
            if (!link)
                throw new InvalidRadialLinkError();
            yield [link, i++];
        } while ((link = forward ? link.next : link.prev) != this.radialLink && (check || (!check && link)));
    }
    *radialLinksReverse(check = true) {
        yield* this.radialLinks(false, check);
    }
    // BM_edge_kill
    /** Remove this edge from the mesh, also removing any faces and loops. */
    remove() {
        for (const [link] of [...this.radialLinks()]) {
            // for (const [link] of this.radialLinks(true, false)) {
            console.log('  --- remove radial link (remove face)');
            link.loop.face.remove();
        }
        let isLastRemainingEdge = this.edgeLinkA.next === this.edgeLinkA;
        // TODO consolidate into Link
        let link = this.edgeLinkA;
        let nextLink = link.next;
        let prevLink = link.prev;
        link.next = null;
        link.prev = null;
        if (prevLink)
            prevLink.next = nextLink; // if circular, and pointing to itself again, that's fine, it'll be GC'd
        if (nextLink)
            nextLink.prev = prevLink;
        // @ts-expect-error internal write of edgeLink
        if (isLastRemainingEdge)
            this.vertexA.edgeLink = null;
        // @ts-expect-error internal write of edgeLink
        else if (this.vertexA.edgeLink === link)
            this.vertexA.edgeLink = nextLink ?? prevLink;
        // @ts-expect-error internal write of edgeCount
        this.vertexA.edgeCount--;
        isLastRemainingEdge = this.edgeLinkB.next === this.edgeLinkB;
        // TODO consolidate into Link
        link = this.edgeLinkB;
        nextLink = link.next;
        prevLink = link.prev;
        link.next = null;
        link.prev = null;
        if (prevLink)
            prevLink.next = nextLink; // if circular, and pointing to itself again, that's fine, it'll be GC'd
        if (nextLink)
            nextLink.prev = prevLink;
        // @ts-expect-error internal write of edgeLink
        if (isLastRemainingEdge)
            this.vertexB.edgeLink = null;
        // @ts-expect-error internal write of edgeLink
        else if (this.vertexB.edgeLink === link)
            this.vertexB.edgeLink = nextLink ?? prevLink;
        // @ts-expect-error internal write of edgeCount
        this.vertexB.edgeCount--;
        // TODO remove from mesh
        this.mesh.edges.delete(this);
    }
}
export class InvalidRadialLinkError extends Error {
    constructor() {
        super('Invalid RadialLink loop detected. RadialLinks should form a circular linked list.');
    }
}
