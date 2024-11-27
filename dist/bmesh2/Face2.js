import { BMesh2 } from './BMesh2.js';
import { Loop2 } from './Loop2.js';
import { Edge2 } from './Edge2.js';
import { Link } from './Link.js';
import { Vertex2 } from './Vertex2.js';
import { BMeshElement } from './BMeshElement.js';
/**
 * To represent a linked list of Loops for faces that share the same edge.
 */
export class RadialLoopLink extends Link() {
    next = this;
    prev = this;
    circular = true;
    loop;
    constructor(loop) {
        super();
        this.loop = loop;
    }
}
export class Face2 extends BMeshElement {
    loop;
    edgeCount;
    // BM_face_create
    constructor(mesh, vertices, edges) {
        super(mesh);
        Face2.#validateInput(vertices, edges);
        this.edgeCount = vertices.length;
        this.loop = this.#createLoop(vertices[0], edges[0]);
        // avoid duplicate faces
        const face = BMesh2.existingFace(vertices);
        if (face)
            return face;
        // Run this *after* the existingFace check, or else existingFace will detect an invalid Loop.
        // edges[0]!.addLoop(this.loop)
        this.#createLoops(vertices, edges);
        mesh.addFace(this);
    }
    // BM_loop_create
    #createLoop(vertex, edge) {
        const loop = new Loop2(this, vertex, edge);
        const newLink = loop.radialLink;
        // @ts-expect-error internal write of radialLink
        if (!edge.radialLink)
            edge.radialLink = newLink;
        edge.radialLink.insertBefore(newLink);
        // @ts-expect-error internal write of faceCount
        edge.faceCount++;
        return loop;
    }
    #createLoops(vertices, edges) {
        const start = this.loop;
        let lastLoop = start;
        for (const [i, vert] of vertices.entries()) {
            if (i === 0)
                continue;
            const edge = edges[i];
            const nextVert = vertices[(i + 1) % vertices.length];
            if (!edge.hasVertex(vert))
                throw new TypeError("edge doesn't contain vertex. wrong order?");
            if (!edge.hasVertex(nextVert))
                throw new TypeError("edge doesn't contain vertex. wrong order?");
            const loop = this.#createLoop(vert, edge);
            lastLoop.insertAfter(loop);
            lastLoop = loop;
        }
    }
    static #validateInput(vertices, edges) {
        if (vertices.length < 3)
            throw new TypeError('a face must have at least 3 vertices');
        if (vertices.length !== edges.length)
            throw new TypeError('number of vertices must match number of edges');
        if (vertices.length !== new Set(vertices).size)
            throw new TypeError('duplicate vertices not allowed');
        if (edges.length !== new Set(edges).size)
            throw new TypeError('duplicate edges not allowed');
    }
    // BM_face_kill
    remove() {
        for (const [loop] of [...this.loop])
            this.#removeLoop(loop);
        this.mesh.faces.delete(this);
    }
    #removeLoop(loop) {
        loop.unlink();
        const isLastRemainingRadial = loop.radialLink.next === loop.radialLink;
        const { next: nextLink, prev: prevLink } = loop.radialLink;
        loop.radialLink.unlink();
        // @ts-expect-error internal write of radialLink
        if (isLastRemainingRadial)
            loop.edge.radialLink = null;
        // @ts-expect-error internal write of radialLink
        else if (loop.edge.radialLink === loop.radialLink)
            loop.edge.radialLink = nextLink ?? prevLink;
        // @ts-expect-error internal write of faceCount
        loop.edge.faceCount--;
    }
}
