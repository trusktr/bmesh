/**
 * This is a port of Blender's BMesh data structure to JavaScript, but without
 * anything specific to rendering such as normals or material indices. Maybe
 * we'll add normals later if it would be useful for JS 3D engines like Threejs
 * or PlayCanvas to copy them from a bmesh, but for now they can generate their
 * own.
 */
import { Edge } from './Edge.js';
import { Face } from './Face.js';
import type { Loop } from './Loop.js';
import { Vertex } from './Vertex.js';
/**
 * A BMesh is a collection of vertices, edges connecting vertices, and faces
 * defined by edges going in a loop.
 */
export declare class BMesh {
    vertices: Set<Vertex>;
    edges: Set<Edge>;
    faces: Set<Face>;
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
     * Returns an error if the loop is invalid, or null if it is valid.
     */
    static validateLoop(face: Face): Error | null;
    /**
     * Returns an error if the radial loop is invalid, or null if it is valid.
     */
    static validateRadial(loop: Loop): Error | null;
    /**
     * Returns an error if the disk link is invalid, or null if it is valid. If
     * an edge is provided, it will check if the disk includes the edge.
     */
    static validateDisk(vertex: Vertex, edge?: Edge | null): Error | null;
}
