import type Vertex from '../ds/Vertex.js';
import type Edge from '../ds/Edge.js';
import type Loop from '../ds/Loop.js';
import type Face from '../ds/Face.js';
export declare class StructOps {
    static diskEdgeAppend(e: Edge, v: Vertex): void;
    static diskEdgeRemove(e: Edge, v: Vertex): void;
    static edgeVertSwap(e: Edge, v_dst: Vertex, v_src: Vertex): void;
    static diskVertReplace(e: Edge, v_dst: Vertex, v_src: Vertex): void;
    static diskVertSwap(e: Edge, v_dst: Vertex, v_src: Vertex): void;
    static diskCountAtMost(v: Vertex, count_max: number): number;
    static radialLoopAppend(e: Edge, l: Loop): void;
    static radialLoopRemove(e: Edge, l: Loop): void;
    static radialLoopInlink(l: Loop): void;
    static loopValidate(f: Face): boolean;
}
export default StructOps;
