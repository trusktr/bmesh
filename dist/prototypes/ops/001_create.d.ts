import { BMesh, Face, Vertex } from 'bmesh';
export declare function drawMeshVertsEdges(mesh: BMesh): void;
export declare function drawFaceVertsEdges(f: Face, lineColor?: number): void;
export declare function drawVertEdges(v: Vertex): void;
export declare function drawFacePoint(face: Face): void;
/** get the centroid of a set of edges */
export declare function centroid(face: Face, target?: [number, number, number]): [number, number, number];
