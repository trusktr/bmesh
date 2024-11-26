import useThreeWebGL2, { useDarkScene, useVisualDebug } from '../../../prototypes/_lib/useThreeWebGL2.js';
import { BMesh2, Edge2, Face2, vec3, Vertex2 } from 'bmesh';
import { cyan, deeppink, yellow } from '../colors.js';
const App = useDarkScene(useThreeWebGL2());
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Setup
const Debug = await useVisualDebug(App);
App.sphericalLook(0, 20, 6);
App.camera.position.x = 5;
App.camCtrl.update();
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const bmesh = new BMesh2();
const v0 = new Vertex2(bmesh, -2, 0, -1);
const v1 = new Vertex2(bmesh, 0, 0, -1);
const v2 = new Vertex2(bmesh, 2, 0, -1);
const v3 = new Vertex2(bmesh, -2, 0, 1);
const v4 = new Vertex2(bmesh, 0, 0, 1);
const v5 = new Vertex2(bmesh, 2, 0, 1);
const v6 = new Vertex2(bmesh, 0, 1, -1);
const v7 = new Vertex2(bmesh, 0, 1, 1);
const fVerts0 = [v1, v4, v5, v2];
new Face2(bmesh, fVerts0, bmesh.edgesFromVerts(...fVerts0));
const fVerts1 = [v0, v3, v4, v1];
new Face2(bmesh, fVerts1, bmesh.edgesFromVerts(...fVerts1));
const fVerts2 = [v1, v6, v7, v4];
new Face2(bmesh, fVerts2, bmesh.edgesFromVerts(...fVerts2));
const v8 = new Vertex2(bmesh, 0, 1.5, 1.5);
new Edge2(bmesh, v7, v8);
let vert = [...bmesh.vertices][1];
if (!vert)
    throw 'missing vert';
let edge = vert.edgeLink?.edge;
if (!edge)
    throw 'missing edge';
/* eslint-disable */
render();
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
initUI();
App.renderLoop();
// App.createRenderLoop( onPreRender ).start();
function initUI() {
    document.getElementById('btnPrev').addEventListener('click', prevEdge);
    document.getElementById('btnNext').addEventListener('click', nextEdge);
    document.getElementById('btnFlip').addEventListener('click', flip);
    document.getElementById('btnDelVert').addEventListener('click', deleteVert);
    document.getElementById('btnDelEdge').addEventListener('click', deleteEdge);
    document.getElementById('btnDelFace').addEventListener('click', deleteFace);
}
function render() {
    Debug.pnt.reset();
    Debug.ln.reset();
    for (const v of bmesh.vertices)
        Debug.pnt.addPoint(v.toArray(), deeppink, 6);
    for (const e of bmesh.edges)
        Debug.ln.addPoint(e.vertexA.toArray(), e.vertexB.toArray(), deeppink);
    const vertA = vert;
    const vertB = vertA ? edge?.otherVertex(vertA) : null;
    if (vertA)
        Debug.pnt.addPoint(vertA.toArray(), cyan, 6);
    if (vertA && vertB)
        Debug.ln.addPoint(vertA.toArray(), vertB.toArray(), cyan, deeppink);
    for (const f of bmesh.faces)
        renderFace(f);
}
function nextEdge() {
    if (!edge || !vert)
        return;
    edge = edge.nextEdgeLink(vert).edge;
    render();
}
function prevEdge() {
    if (!edge || !vert)
        return;
    edge = edge.prevEdgeLink(vert).edge;
    render();
}
function flip() {
    if (!edge || !vert)
        return;
    vert = edge.otherVertex(vert);
    render();
}
function deleteVert() {
    if (!vert)
        return;
    const oldVert = vert;
    // If we're on a lone vert dereference or we'll leak it and keep rendering
    // the selection.
    if (!vert.edgeCount) {
        vert = undefined;
    }
    // not lone vert
    else {
        vert = edge.otherVertex(vert);
        const oldEdge = edge;
        edge = edge.nextEdgeLink(vert).edge;
        // If we're on a standalone edge, dereference it.
        if (oldEdge === edge)
            edge = undefined;
    }
    oldVert.remove();
    render();
}
function deleteEdge() {
    if (!edge)
        return;
    const oldEdge = edge;
    // If the current edge is the last edge of the current vert, switch to the
    // other vert, otherwise we'll get stuck on a lone vert with no edges (and
    // we don't have click-to-select yet).
    let nextEdge = edge.nextEdgeLink(vert).edge;
    let isLastEdge = edge === nextEdge;
    if (isLastEdge)
        vert = edge.otherVertex(vert);
    edge = edge.nextEdgeLink(vert).edge;
    // If the current edge is also the last edge of the second vert (i.e. the
    // current edge is a lone edge), dereference it otherwise we'll keep
    // erroneously rendering the edge selection and won't let the deleted edge
    // be GC'd.
    nextEdge = edge.nextEdgeLink(vert).edge;
    isLastEdge = edge === nextEdge;
    if (isLastEdge)
        edge = undefined;
    oldEdge.remove();
    render();
}
function deleteFace() {
    edge?.radialLink?.loop.face?.remove();
    render();
}
function renderFace(f) {
    const avg = vec3.avg(...[...f.loop.radial()].map(([l]) => l.vertex.toArray()));
    const pointSize = 7;
    Debug.pnt.addPoint(avg, yellow, pointSize, 2);
}
