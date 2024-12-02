import { BMesh, Edge, Face, Vertex } from 'bmesh';
import { black, cyan, deeppink, plumParadise } from '../colors.js';
import { App, Debug } from '../app.js';
import { drawFacePoint, drawFaceVertsEdges } from './001_create.js';
import { drawMesh } from './002_traverse_edges.js';
import { Vector3 } from 'three';
function main() {
    App.sphericalLook(0, 20, 6);
    App.camera.position.x = 5;
    App.camCtrl.update();
    const camera = App.camera;
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const bmesh = new BMesh();
    const v0 = new Vertex(bmesh, -2, 0, -1);
    const v1 = new Vertex(bmesh, 0, 0, -1);
    const v2 = new Vertex(bmesh, 2, 0, -1);
    const v3 = new Vertex(bmesh, -2, 0, 1);
    const v4 = new Vertex(bmesh, 0, 0, 1);
    const v5 = new Vertex(bmesh, 2, 0, 1);
    const v6 = new Vertex(bmesh, 0, 1, -1);
    const v7 = new Vertex(bmesh, 0, 1, 1);
    const fVerts0 = [v1, v4, v5, v2];
    new Face(bmesh, fVerts0, bmesh.edgesFromVerts(...fVerts0));
    const fVerts1 = [v0, v3, v4, v1];
    new Face(bmesh, fVerts1, bmesh.edgesFromVerts(...fVerts1));
    const fVerts2 = [v1, v6, v7, v4];
    new Face(bmesh, fVerts2, bmesh.edgesFromVerts(...fVerts2));
    const v8 = new Vertex(bmesh, 0, 1.5, 1.5);
    new Edge(bmesh, v7, v8);
    let vert = v1;
    let edge = vert.diskLink?.edge;
    let loop = edge?.radialLink?.loop;
    if (!edge)
        throw 'missing edge';
    render();
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    initUI();
    handleEvents();
    App.renderLoop();
    function initUI() {
        document.getElementById('btnPrev').addEventListener('click', prevEdge);
        document.getElementById('btnNext').addEventListener('click', nextEdge);
        document.getElementById('btnPrevRadial').addEventListener('click', nextRadial);
        document.getElementById('btnNextRadial').addEventListener('click', prevRadial);
        document.getElementById('btnFlip').addEventListener('click', flip);
        document.getElementById('btnDelVert').addEventListener('click', deleteVert);
        document.getElementById('btnDelEdge').addEventListener('click', deleteEdge);
        document.getElementById('btnDelFace').addEventListener('click', deleteFace);
        document.getElementById('btnSplitEdge').addEventListener('click', splitEdge);
    }
    function render() {
        Debug.pnt.reset();
        Debug.ln.reset();
        drawMesh(bmesh, black);
        if (loop)
            drawFaceVertsEdges(loop.face, plumParadise);
        const vertA = vert;
        const vertB = vertA ? edge?.otherVertex(vertA) : null;
        if (vertA)
            Debug.pnt.addPoint(vertA.toArray(), cyan, 6);
        if (vertA && vertB)
            Debug.ln.addPoint(vertA.toArray(), vertB.toArray(), cyan, deeppink);
        for (const f of bmesh.faces)
            drawFacePoint(f);
    }
    function nextEdge() {
        if (!edge || !vert)
            return;
        edge = edge.nextEdgeLink(vert).edge;
        loop = edge?.radialLink?.loop;
        render();
    }
    function prevEdge() {
        if (!edge || !vert)
            return;
        edge = edge.prevEdgeLink(vert).edge;
        loop = edge?.radialLink?.loop;
        render();
    }
    function nextRadial() {
        loop = loop?.radialLink.next.loop;
        render();
    }
    function prevRadial() {
        loop = loop?.radialLink.prev.loop;
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
        loop = edge?.radialLink?.loop;
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
        loop = edge?.radialLink?.loop;
        render();
    }
    function deleteFace() {
        loop?.face?.remove();
        loop = edge?.radialLink?.loop;
        render();
    }
    function splitEdge() {
        if (vert && edge)
            edge.split(edge.otherVertex(vert));
        render();
    }
    function moveVertX(delta) {
        if (vert)
            vert.x += delta;
        render();
    }
    function moveVertY(delta) {
        if (vert)
            vert.y += delta;
        render();
    }
    function moveVertZ(delta) {
        if (vert)
            vert.z += delta;
        render();
    }
    /** Iterate vertex edges with right/left. Iterate radials with up/down. Delete edges with 'e', faces with 'c', and vertices with 'v'. Use WASD to move the current vertex on X and Z. Use Q and E to move along Y. */
    function handleEvents() {
        window.addEventListener('keydown', e => {
            if (e.key === 'ArrowRight' || e.key === 'j') {
                nextEdge();
            }
            else if (e.key === 'ArrowLeft' || e.key === 'k') {
                prevEdge();
            }
            else if (e.key === 'ArrowUp' || e.key === 'l') {
                nextRadial();
            }
            else if (e.key === 'ArrowDown' || e.key === 'h') {
                prevRadial();
            }
            else if (e.key === 'f') {
                flip();
            }
            else if (e.key === 'v') {
                deleteVert();
            }
            else if (e.key === 'x') {
                deleteEdge();
            }
            else if (e.key === 'c') {
                deleteFace();
            }
            else if (e.key === '/') {
                splitEdge();
            }
            else if (e.key === 'w') {
                moveVertZ(-0.1);
            }
            else if (e.key === 's') {
                moveVertZ(0.1);
            }
            else if (e.key === 'a') {
                moveVertX(-0.1);
            }
            else if (e.key === 'd') {
                moveVertX(0.1);
            }
            else if (e.key === 'q') {
                moveVertY(-0.1);
            }
            else if (e.key === 'e') {
                moveVertY(0.1);
            }
        });
        let isPointerDown = false;
        window.addEventListener('pointermove', e => {
            isPointerDown = true;
        });
        window.addEventListener('pointermove', e => {
            if (vert && isPointerDown && e.shiftKey)
                movePointOnScreen(camera, vert.position, e.movementX, -e.movementY);
        });
    }
    // Assuming you have a camera and a vector3
    const camRight = new Vector3();
    const camUp = new Vector3();
    /**
     * Move a point in world space parallel to the display screen (perpendicular
     * to the camera's direction). Basic version, not accounting for scene
     * resolution.
     */
    function movePointOnScreen(camera, position, moveX, moveY) {
        // Get the camera's right and up vectors
        camera.getWorldDirection(camRight);
        camRight.cross(camera.up).normalize(); // Right vector is perpendicular to the camera's direction and up vector
        camera.getWorldDirection(camUp);
        camUp.cross(camRight).negate().normalize(); // Up vector is perpendicular to the camera's right vector and direction
        // Move the vector
        position.addScaledVector(camRight, moveX * 0.01);
        position.addScaledVector(camUp, moveY * 0.01);
        render();
    }
}
if (location.pathname.endsWith('004_split_edge.html'))
    main();
