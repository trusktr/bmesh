// #region IMPORTS
import Vertex from './ds/Vertex.js';
import Edge from './ds/Edge.js';
import Loop from './ds/Loop.js';
import Face from './ds/Face.js';
import CoreOps from './ops/CoreOps.js';
import QueryOps from './ops/QueryOps.js';
// #endregion
export class BMesh {
    // #region MAIN
    vertices = [];
    edges = [];
    loops = [];
    faces = [];
    // #endregion
    // #region CREATION
    // BM_vert_create : https://github.com/blender/blender/blob/48e60dcbffd86f3778ce75ab67f95461ffbe319c/source/blender/bmesh/intern/bmesh_core.cc#L45
    addVertex(pos) {
        const v = new Vertex(pos);
        this.vertices.push(v);
        return v;
    }
    addEdge(v1, v2) {
        let edge = QueryOps.edgeExists(v1, v2);
        if (edge)
            return edge;
        edge = CoreOps.edgeCreate(v1, v2);
        if (edge)
            this.edges.push(edge);
        return edge;
    }
    addLoop(v, e, f) {
        const loop = CoreOps.loopCreate(v, e, f);
        this.loops.push(loop);
        return loop;
    }
    addFace(ary) {
        if (ary)
            return CoreOps.faceCreateVerts(this, ary);
        const face = new Face();
        this.faces.push(face);
        return face;
    }
    // #endregion
    // #region REMOVING
    removeFace(f) {
        CoreOps.faceKill(this, f);
    }
    removeEdge(e) {
        CoreOps.edgeKill(this, e);
    }
    removeVertex(v) {
        CoreOps.vertKill(this, v);
    }
    cleanVert(v) {
        if (!this.cleanArray(v, this.vertices))
            console.log('Vertex not found for cleanup');
    }
    cleanEdge(e) {
        if (!this.cleanArray(e, this.edges))
            console.log('Edge not found for cleanup');
    }
    cleanLoop(l) {
        if (!this.cleanArray(l, this.loops))
            console.log('Loop not found for cleanup');
    }
    cleanFace(f) {
        if (!this.cleanArray(f, this.faces))
            console.log('Face not found for cleanup');
    }
    cleanArray(itm, ary) {
        const a = ary.indexOf(itm);
        if (a === -1)
            return false;
        const z = ary.length - 1;
        if (a !== z)
            ary[a] = ary[z];
        ary.length = z;
        return true;
    }
}
export default BMesh;
