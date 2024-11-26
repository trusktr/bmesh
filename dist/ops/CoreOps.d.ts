import type BMesh from '../BMesh.js';
import type Vertex from '../ds/Vertex.js';
import Edge from '../ds/Edge.js';
import Loop from '../ds/Loop.js';
import Face from '../ds/Face.js';
export declare class CoreOps {
    static faceCreateVerts(bm: BMesh, verts: Array<Vertex>, createEdges?: boolean): Face;
    static faceCreate(bm: BMesh, verts: Array<Vertex>, edges: Array<Edge>): Face;
    static faceBoundaryAdd(bm: BMesh, f: Face, v: Vertex, e: Edge): Loop;
    static faceKill(bm: BMesh, f: Face): void;
    static splitFaceMakeEdge(bm: BMesh, f: Face, l_v1: Loop, l_v2: Loop): Face;
    static joinFaceKillEdge(bm: BMesh, f1: Face, f2: Face, e: Edge): Face | null;
    static faceVertsKill(bm: BMesh, f: Face): void;
    static faceEdgesKill(bm: BMesh, f: Face): void;
    static facesJoin(bm: BMesh, faces: Array<Face>, totface: number, do_del?: boolean): Face | null;
    static loopCreate(v: Vertex, e: Edge, f: Face): Loop;
    static loopReverse(f: Face): void;
    static edgeCreate(v1: Vertex, v2: Vertex): Edge | null;
    static edgeKill(bm: BMesh, e: Edge): void;
    static splitEdgeMakeVert(bm: BMesh, tv: Vertex, e: Edge): Vertex;
    static joinEdgeKillVert(bm: BMesh, e_kill: Edge, v_kill: Vertex, do_del?: boolean, check_edge_exists?: boolean, kill_degenerate_faces?: boolean, kill_duplicate_faces?: boolean): Edge | null;
    static edgeSplice(bm: BMesh, e_dst: Edge, e_src: Edge): boolean;
    static vertKill(bm: BMesh, v: Vertex): void;
    static joinVertKillEdge(bm: BMesh, e_kill: Edge, v_kill: Vertex, do_del?: boolean, check_edge_exists?: boolean, kill_degenerate_faces?: boolean): Vertex;
    static vertIsManifold(v: Vertex): boolean;
    static vertSplice(bm: BMesh, v_dst: Vertex, v_src: Vertex): boolean;
}
export default CoreOps;
