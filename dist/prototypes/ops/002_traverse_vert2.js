import useThreeWebGL2, { useDarkScene, useVisualDebug } from '../../../prototypes/_lib/useThreeWebGL2.js';
import { BMesh2, Edge2, Face2, Vertex2 } from 'bmesh';
import { cyan, deeppink } from '../colors.js';
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
    const btn = document.getElementById('btnPrev');
    if (!btn)
        throw 'missing btnPrev';
    btn.addEventListener('click', prevEdge);
    const btn2 = document.getElementById('btnNext');
    if (!btn2)
        throw 'missing btnNext';
    btn2.addEventListener('click', nextEdge);
    const btn3 = document.getElementById('btnFlip');
    if (!btn3)
        throw 'missing btnFlip';
    btn3.addEventListener('click', flip);
}
function render() {
    Debug.pnt.reset();
    Debug.ln.reset();
    for (const v of bmesh.vertices)
        Debug.pnt.addPoint(v.toArray(), deeppink, 6);
    for (const e of bmesh.edges)
        Debug.ln.addPoint(e.vertexA.toArray(), e.vertexB.toArray(), deeppink);
    const vertA = vert;
    const vertB = edge.otherVertex(vertA);
    Debug.pnt.addPoint(vertA.toArray(), cyan, 6);
    Debug.ln.addPoint(vertA.toArray(), vertB.toArray(), cyan, deeppink);
}
function nextEdge() {
    edge = edge.nextEdgeLink(vert).edge;
    render();
}
function prevEdge() {
    edge = edge.prevEdgeLink(vert).edge;
    render();
}
function flip() {
    vert = edge.otherVertex(vert);
    render();
}
