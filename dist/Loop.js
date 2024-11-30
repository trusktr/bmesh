import { Edge } from './Edge.js';
import { Face, RadialLoopLink } from './Face.js';
import { Link } from './Link.js';
import { Vertex } from './Vertex.js';
/**
 * A circular linked list of Loops that go around a Face, useful for traversing
 * the Edges of a Face.
 */
export class Loop extends Link() {
    next = this;
    prev = this;
    circular = true;
    vertex;
    edge;
    face;
    /** A circular linked list of Loops that share the same Edge. This Link contains this Loop. */
    radialLink = new RadialLoopLink(this);
    /** Do not use this constructor directly, use Vertex, Edge, and Face constructors. */
    constructor(face, vertex, edge) {
        super();
        this.vertex = vertex;
        this.edge = edge;
        this.face = face;
    }
    /**
     * Returns true if the vertices match the loop, false otherwise.
     */
    verticesMatch(vertices, checkCircular = true, forward = true) {
        let l;
        let i = 0;
        for (l of this.iterator(forward, checkCircular))
            if (l.vertex !== vertices[i++])
                return false;
        return i === vertices.length;
    }
    /**
     * Returns true if the vertices in reverse match the loop, false otherwise.
     */
    verticesMatchReverse(vertices, check = true) {
        return this.verticesMatch(vertices, check, false);
    }
}
