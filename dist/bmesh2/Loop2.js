import { Link } from './Link.js';
export class Loop2 extends Link {
    vertex;
    edge;
    face;
    next;
    prev;
    radialLink;
    // BM_loop_create
    constructor(mesh, face, vertex, edge, next = null, prev = null) {
        super();
        this.vertex = vertex;
        this.edge = edge;
        this.face = face;
        this.next = next;
        this.prev = prev;
        this.radialLink = edge.addLoop(this);
        mesh.addLoop(this);
    }
    /**
     * Iterate all the Loops of the current radial loop (the current face, the
     * current circular linked list).
     */
    *radial(forward = true, check = true) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let loop = this;
        let i = 0;
        do {
            if (!loop)
                throw new InvalidLoopError();
            yield [loop, i++];
        } while ((loop = forward ? loop.next : loop.prev) != this && (check || (!check && loop)));
    }
    /**
     * Iterate all the Loops of the current radial loop (the current face, the
     * current circular linked list) in reverse.
     */
    *radialReverse(check = true) {
        yield* this.radial(false, check);
    }
    verticesMatch(vertices, check = true, forward = true) {
        let l;
        let i = 0;
        for ([l, i] of this.radial(forward, check))
            if (l.vertex !== vertices[i])
                return false;
        return i + 1 === vertices.length;
    }
    verticesMatchReverse(vertices, check = true) {
        return this.verticesMatch(vertices, check, false);
    }
}
export class InvalidLoopError extends Error {
    constructor() {
        super('Invalid loop detected. Loops should form a circular linked list.');
    }
}
