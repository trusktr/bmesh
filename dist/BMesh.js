import { Edge } from './Edge.js';
import { Face } from './Face.js';
import { Vertex } from './Vertex.js';
/**
 * This is a port of Blender's BMesh data structure to JavaScript, but without
 * anything specific to rendering such as normals or material indices. Maybe
 * we'll add normals later if it would be useful for JS 3D engines like Threejs
 * or PlayCanvas to copy them from a bmesh, but for now they can generate their
 * own.
 */
export class BMesh {
    vertices = new Set();
    edges = new Set();
    faces = new Set();
    addVertex(vertex) {
        this.vertices.add(vertex);
    }
    addEdge(edge) {
        this.edges.add(edge);
    }
    addFace(face) {
        const err = BMesh.validateLoop(face);
        if (err)
            throw err;
        this.faces.add(face);
    }
    // BM_edges_from_verts_ensure
    edgesFromVerts(...vertices) {
        const edges = [];
        // ensure no duplicate vertices
        if (vertices.length !== new Set(vertices).size)
            throw new TypeError('duplicate vertices not allowed');
        for (const [i, vertex] of vertices.entries()) {
            const next = vertices[(i + 1) % vertices.length];
            const edge = BMesh.existingEdge(vertex, next) ?? new Edge(this, vertex, next);
            edges.push(edge);
        }
        return edges;
    }
    // BM_face_exists
    /**
     * Returns the face that exists between the given vertices, or null if none.
     */
    static existingFace(vertices) {
        if (!vertices[0])
            return null;
        for (const diskLink of vertices[0].diskLink ?? []) {
            for (const radialLink of diskLink.edge.radialLink ?? []) {
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
    /**
     * Returns the edge that exists between two vertices, or null if none.
     */
    static existingEdge(vertA, vertB) {
        if (vertA === vertB)
            throw new TypeError('edge vertices must be different');
        if (!vertA.diskLink || !vertB.diskLink)
            return null;
        // Iterate over the smaller set of edges.
        const diskLink = vertA.edgeCount < vertB.edgeCount ? vertA.diskLink : vertB.diskLink;
        for (const link of diskLink) //
            if (link.edge.hasVertex(vertA) && link.edge.hasVertex(vertB))
                return link.edge;
        return null;
    }
    // bmesh_loop_validate
    /**
     * Returns true if a loop is valid, false otherwise.
     */
    static validateLoop(face) {
        if (!face.loop)
            return new Error('face has no loop');
        const loops = [...face.loop];
        if (loops.length !== face.edgeCount)
            return new Error('face length does not match loop length');
        let i = 0;
        for (const loop of loops) {
            const nextLoop = loops[(i + 1) % face.edgeCount];
            if (nextLoop.prev !== loop)
                return new Error('reverse loop does not match forward loop');
            if (loop.face !== nextLoop.face)
                return new Error('each loop must belong to the same face');
            if (loop.edge === nextLoop.edge)
                return new Error('each loop must have a different edge');
            if (loop.vertex === nextLoop.vertex)
                return new Error('each loop must have a different vertex');
            if (!(loop.edge.hasVertex(loop.vertex) && loop.edge.hasVertex(nextLoop.vertex)))
                return new Error('each loop edge should have the vertex of the loop and the next loop');
            i++;
        }
        return null;
    }
}
