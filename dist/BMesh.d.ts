import Vertex from './ds/Vertex.js';
import Edge from './ds/Edge.js';
import Loop from './ds/Loop.js';
import Face from './ds/Face.js';
export declare class BMesh {
    vertices: Array<Vertex>;
    edges: Array<Edge>;
    loops: Array<Loop>;
    faces: Array<Face>;
    addVertex(pos: Array<number>): Vertex;
    addEdge(v1: Vertex, v2: Vertex): Edge | null;
    addLoop(v: Vertex, e: Edge, f: Face): Loop;
    addFace(ary?: Array<Vertex>): Face;
    removeFace(f: Face): void;
    removeEdge(e: Edge): void;
    removeVertex(v: Vertex): void;
    cleanVert(v: Vertex): void;
    cleanEdge(e: Edge): void;
    cleanLoop(l: Loop): void;
    cleanFace(f: Face): void;
    cleanArray(itm: any, ary: Array<any>): boolean;
}
export default BMesh;
