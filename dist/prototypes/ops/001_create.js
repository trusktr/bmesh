import useThreeWebGL2, { useDarkScene, useVisualDebug } from '../../../prototypes/_lib/useThreeWebGL2.js';
import { BMesh, Edge, Face, Vertex } from 'bmesh';
/** @import { Face, Vertex } from 'bmesh' */
const App = useDarkScene(useThreeWebGL2());
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Setup
const Debug = await useVisualDebug(App);
App.sphericalLook(0, 20, 6);
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const mesh = new BMesh();
const v0 = new Vertex(mesh, -1, 0, -1);
const v1 = new Vertex(mesh, 1, 0, -1);
const v2 = new Vertex(mesh, 1, 0, 1);
const f = new Face(mesh, [v0, v1, v2]);
// drawVertEdges(v1)
// drawMeshVertsEdges(mesh)
drawFaceVertsEdges(f);
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
App.renderLoop();
function drawMeshVertsEdges(mesh) {
    for (const v of mesh.vertices)
        Debug.pnt.addPoint(v.toArray(), 0x00ff00, 3);
    for (const e of mesh.edges)
        Debug.ln.addPoint(e.vertexA.toArray(), e.vertexB.toArray(), 0x00ffff);
}
function drawFaceVertsEdges(f) {
    for (const l of f.loop) {
        console.log(l);
        Debug.pnt.addPoint(l.vertex.toArray(), 0x00ff00, 3);
        Debug.ln.addPoint(l.edge.vertexA.toArray(), l.edge.vertexB.toArray(), 0x00ffff);
    }
}
function drawVertEdges(v) {
    for (const link of v.diskLink ?? []) {
        Debug.ln.addPoint(link.edge.vertexA.toArray(), link.edge.vertexB.toArray(), 0x00ffff);
    }
}
