import type Vertex from '../ds/Vertex.js';
import type Edge from '../ds/Edge.js';
import type Loop from '../ds/Loop.js';
import type Face from '../ds/Face.js';
export declare class QueryOps {
    static edgeExists(v1: Vertex, v2: Vertex): Edge | null;
    static edgeIsManifold(e: Edge): boolean;
    static edgeInFace(e: Edge, f: Face): boolean;
    static edgeIsBoundary(e: Edge): boolean;
    static edgeFaceCountIsOver(e: Edge, n: number): boolean;
    static edgeFaceCountAtMost(e: Edge, count_max: number): number;
    static faceExists(verts: Array<Vertex>): Face | null;
    static loopCalcFaceNormal(l: Loop, n: Array<number>): void;
    static faceFindDouble(f: Face): Face | null;
    static faceEdgeShareLoop(f: Face, e: Edge): Loop | null;
    static faceShareEdgeCount(f_a: Face, f_b: Face): number;
    static loopRadialCount(l: Loop): number;
    static vertsInEdge(v1: Vertex, v2: Vertex, e: Edge): boolean;
    static vertInFace(v: Vertex, f: Face): boolean;
    static vertPairShareFaceCheck(v_a: Vertex, v_b: Vertex): boolean;
}
export default QueryOps;
