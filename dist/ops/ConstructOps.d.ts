import type BMesh from '../BMesh.js';
import type Vertex from '../ds/Vertex.js';
import type Edge from '../ds/Edge.js';
import type Face from '../ds/Face.js';
export declare class ConstructOps {
    static edgesFromVertsEnsure(bm: BMesh, verts: Array<Vertex>): Array<Edge>;
    static edgesSortWinding(v1: Vertex, v2: Vertex, edges: Array<Edge>, len: number, edges_sort: Array<Edge>, verts_sort: Array<Vertex>): boolean;
    static faceCreateNgon(bm: BMesh, v1: Vertex, v2: Vertex, edges: Array<Edge>, len: number): Face | null;
}
export default ConstructOps;
