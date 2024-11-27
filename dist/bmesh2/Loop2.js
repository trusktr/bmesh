import { Edge2 } from './Edge2.js';
import { Face2, RadialLoopLink } from './Face2.js';
import { Link } from './Link.js';
import { Vertex2 } from './Vertex2.js';
export class Loop2 extends Link() {
    next = this;
    prev = this;
    circular = true;
    vertex;
    edge;
    face;
    /** A circular linked list of Loops that share the same edge. This Link contains this Loop. */
    radialLink = new RadialLoopLink(this);
    /** Do not use this constructor directly, use Vertex, Edge, and Face constructors. */
    constructor(face, vertex, edge) {
        super();
        this.vertex = vertex;
        this.edge = edge;
        this.face = face;
    }
    verticesMatch(vertices, check = true, forward = true) {
        let l;
        let i = 0;
        for ([l, i] of this.links(forward, check))
            if (l.vertex !== vertices[i])
                return false;
        return i + 1 === vertices.length;
    }
    verticesMatchReverse(vertices, check = true) {
        return this.verticesMatch(vertices, check, false);
    }
}
