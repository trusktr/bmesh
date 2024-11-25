import { BMesh2 } from './BMesh2.js';
import { Loop2 } from './Loop2.js';
import { Link } from './Link.js';
export class RadialLink extends Link {
    next = null;
    prev = null;
    loop;
    constructor(loop) {
        super();
        this.loop = loop;
    }
}
export class Face2 {
    loop;
    length;
    // BM_face_create
    constructor(mesh, vertices, edges) {
        Face2.#validateInput(vertices, edges);
        this.length = vertices.length;
        this.loop = new Loop2(mesh, this, vertices[0], edges[0]);
        // avoid duplicate faces
        const face = BMesh2.existingFace(vertices);
        if (face)
            return face;
        // Run this *after* the existingFace check, or else existingFace will detect an invalid Loop.
        // edges[0]!.addLoop(this.loop)
        this.#createLoop(mesh, vertices, edges);
        mesh.addFace(this);
    }
    #createLoop(mesh, vertices, edges) {
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
            const loop = new Loop2(mesh, this, vert, edge);
            lastLoop.next = loop;
            loop.prev = lastLoop;
            lastLoop = loop;
        }
        start.prev = lastLoop;
        lastLoop.next = start;
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
}
