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
export declare class BMesh {
    vertices: Set<Vertex>;
    edges: Set<Edge>;
    faces: Set<Face>;
    addVertex(vertex: Vertex): void;
    addEdge(edge: Edge): void;
    addFace(face: Face): void;
    edgesFromVerts(...vertices: Vertex[]): Edge[];
    /**
     * Returns the face that exists between the given vertices, or null if none.
     */
    static existingFace(vertices: Vertex[]): Face | null;
    /**
     * Returns the edge that exists between two vertices, or null if none.
     */
    static existingEdge(vertA: Vertex, vertB: Vertex): Edge | null;
    /**
     * Returns true if a loop is valid, false otherwise.
     */
    static validateLoop(face: Face): Error | null;
}
