import { Edge2 } from './Edge2.js';
/**
 * This is a port of Blender's BMesh data structure to JavaScript, but without
 * anything specific to rendering such as normals or material indices. Maybe
 * we'll add normals later if it would be useful for JS 3D engines like Threejs
 * or PlayCanvas to copy them from a bmesh, but for now they can generate their
 * own.
 */
export class BMesh2 {
    vertices = new Set();
    edges = new Set();
    loops = new Set();
    faces = new Set();
    addVertex(vertex) {
        this.vertices.add(vertex);
    }
    addEdge(edge) {
        this.edges.add(edge);
    }
    addFace(face) {
        const err = BMesh2.validateLoop(face);
        if (err)
            throw err;
        this.faces.add(face);
    }
    addLoop(loop) {
        this.loops.add(loop);
    }
    // BM_edges_from_verts_ensure
    edgesFromVerts(...vertices) {
        const edges = [];
        // ensure no duplicate vertices
        if (vertices.length !== new Set(vertices).size)
            throw new TypeError('duplicate vertices not allowed');
        console.log('verts:', ...vertices.map(v => v.toArray()));
        for (const [i, vertex] of vertices.entries()) {
            const next = vertices[(i + 1) % vertices.length];
            console.log('existing edge?', vertex.toArray(), next.toArray(), BMesh2.existingEdge(vertex, next));
            const edge = BMesh2.existingEdge(vertex, next) ?? new Edge2(this, vertex, next);
            edges.push(edge);
        }
        return edges;
    }
    // BM_face_exists
    /** Returns the face that exists between the given vertices, or null if none. */
    static existingFace(vertices) {
        if (!vertices[0])
            return null;
        for (const [edgeLink] of vertices[0].edgeLinks()) {
            for (const [radialLink] of edgeLink.edge.radialLinks()) {
                // check both directions, as we don't know which order `vertices` is in
                if (radialLink.loop.verticesMatch(vertices, false))
                    return radialLink.loop.face;
                if (radialLink.loop.verticesMatchReverse(vertices, false))
                    return radialLink.loop.face;
            }
        }
        return null;
    }
    // BM_edge_exists
    /** Returns the edge that exists between two vertices, or null if none. */
    static existingEdge(vertA, vertB) {
        if (vertA === vertB)
            throw new TypeError('edge vertices must be different');
        if (!vertA.edgeLink || !vertB.edgeLink)
            return null;
        // Iterate over the smaller set of edges.
        const edgeLinks = vertA.edgeCount < vertB.edgeCount ? vertA.edgeLinks() : vertB.edgeLinks();
        for (const [link] of edgeLinks) //
            if (link.edge.hasVertex(vertA) && link.edge.hasVertex(vertB))
                return link.edge;
        return null;
    }
    // bmesh_loop_validate
    /** Returns true if a loop is valid, false otherwise. */
    static validateLoop(face) {
        if (!face.loop)
            return new Error('face has no loop');
        const segments = Array.from(face.loop.radial());
        if (segments.length !== face.length)
            return new Error('face length does not match loop length');
        for (const [loop, i] of segments) {
            const nextLoop = segments[(i + 1) % face.length][0];
            if (nextLoop.prev !== loop)
                return new Error('reverse loop does not match forward loop');
            if (loop.face !== nextLoop.face)
                return new Error('each loop must belong to the same face');
            if (loop.edge === nextLoop.edge)
                return new Error('each loop must have a different edge');
            if (loop.vertex === nextLoop.vertex)
                return new Error('each loop must have a different vertex');
        }
        return null;
    }
}