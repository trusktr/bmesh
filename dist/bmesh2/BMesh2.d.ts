import { Edge2 } from './Edge2.js';
import { Face2 } from './Face2.js';
import { Loop2 } from './Loop2.js';
import { Vertex2 } from './Vertex2.js';
/**
 * This is a port of Blender's BMesh data structure to JavaScript, but without
 * anything specific to rendering such as normals or material indices. Maybe
 * we'll add normals later if it would be useful for JS 3D engines like Threejs
 * or PlayCanvas to copy them from a bmesh, but for now they can generate their
 * own.
 */
export declare class BMesh2 {
    vertices: Set<Vertex2>;
    edges: Set<Edge2>;
    loops: Set<Loop2>;
    faces: Set<Face2>;
    addVertex(vertex: Vertex2): void;
    addEdge(edge: Edge2): void;
    addFace(face: Face2): void;
    addLoop(loop: Loop2): void;
    edgesFromVerts(...vertices: Vertex2[]): Edge2[];
    /** Returns the face that exists between the given vertices, or null if none. */
    static existingFace(vertices: Vertex2[]): Face2 | null;
    /** Returns the edge that exists between two vertices, or null if none. */
    static existingEdge(vertA: Vertex2, vertB: Vertex2): Edge2 | null;
    /** Returns true if a loop is valid, false otherwise. */
    static validateLoop(face: Face2): Error | null;
}
