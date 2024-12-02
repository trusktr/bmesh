import { BMesh, Face, Vertex } from 'bmesh';
import { App, Debug } from '../app.js';
import { cyan, deeppink, orange, red } from '../colors.js';
import { drawFacePoint, drawFaceVertsEdges } from './001_create.js';
async function main() {
    App.sphericalLook(0, 20, 6);
    App.camera.position.x = 5;
    App.camCtrl.update();
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
    const f = new Face(bmesh, fVerts2, bmesh.edgesFromVerts(...fVerts2));
    // tests ///////////////////////////////////////////////////
    const set = new Set();
    for (const [loop, nextLoop] of f.loop) {
        console.assert(loop.next === nextLoop, 'should be valid next loops');
        set.add(loop);
    }
    console.assert(set.size === 4, 'iteration should work, size should match');
    set.clear();
    f.loop.forEach(l => {
        set.add(l);
    });
    console.assert(set.size === 4, 'forEach should work');
    set.clear();
    const arr = [...f.loop.iterator()];
    arr.forEach(l => {
        set.add(l);
    });
    console.assert(set.size === 4, 'subsequent iteration should work');
    // three faces
    console.assert(bmesh.faces.size === 3);
    // two faces share the same edge as the first face (12 - 2)
    console.assert(bmesh.edges.size === 10);
    // two faces share the same two vertices as the first face (12 - 4)
    console.assert(bmesh.vertices.size === 8);
    const loops = new Set();
    for (const edge of bmesh.edges)
        for (const radialLink of edge.radialLink ?? [])
            for (const loop of radialLink.loop)
                loops.add(loop);
    const loops2 = new Set();
    for (const face of bmesh.faces)
        for (const loop of face.loop)
            loops2.add(loop);
    // Loops are unique to each face, not shared (4 * 3).
    console.assert(loops.size === 12);
    // Ensure we didn't do anything funky like add loops to edges but not faces.
    console.assert(setEquals(loops, loops2));
    ////////////////////////////////////////////////////////////
    let loop = [...bmesh.faces][0].loop.prev;
    console.log(bmesh);
    update();
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    initUI();
    App.renderLoop();
    function initUI() {
        document.getElementById('btnPrev').addEventListener('click', loopPrev);
        document.getElementById('btnNext').addEventListener('click', loopNext);
        document.getElementById('btnRPrev').addEventListener('click', radialPrev);
        document.getElementById('btnRNext').addEventListener('click', radialNext);
    }
    function update() {
        let err = BMesh.validateLoop(loop.face);
        if (err)
            throw err;
        err = BMesh.validateRadial(loop);
        if (err)
            throw err;
        Debug.pnt.reset();
        Debug.ln.reset();
        drawMesh(bmesh);
        const a = loop.vertex.toArray();
        const b = loop.edge.otherVertex(loop.vertex).toArray();
        // TODO normals
        // const n = loop.face.normal.toArray()
        // vec3.scale(n, 0.2, n)
        // vec3.add(a, n, a)
        // vec3.add(b, n, b)
        const pointSize = 5;
        Debug.pnt.addPoint(a, cyan, pointSize);
        Debug.ln.addPoint(a, b, cyan);
        drawFacePoint(loop.face);
    }
    function loopNext() {
        loop = loop.next;
        update();
    }
    function loopPrev() {
        loop = loop.prev;
        update();
    }
    function radialNext() {
        loop = loop.radialLink.next.loop;
        update();
    }
    function radialPrev() {
        loop = loop.radialLink.prev.loop;
        update();
    }
}
if (location.pathname.endsWith('002_traverse_edges.html'))
    main();
export function drawMesh(bmesh, color = deeppink) {
    const drawFaces = false;
    if (drawFaces) {
        // This duplicates the rendering of shared edges and vertices.
        let i = 0;
        for (const f of bmesh.faces) {
            if (i === 0)
                drawFaceVertsEdges(f, red);
            if (i === 1)
                drawFaceVertsEdges(f, cyan);
            if (i === 2)
                drawFaceVertsEdges(f, orange);
            i++;
        }
    }
    else {
        // This does not duplicate edges/vertices, and it covers non-faces too (f.e. standalone edges)
        const pointSize = 5;
        for (const v of bmesh.vertices)
            Debug.pnt.addPoint(v.toArray(), color, pointSize);
        for (const e of bmesh.edges)
            Debug.ln.addPoint(e.vertexA.toArray(), e.vertexB.toArray(), color);
    }
}
export function setEquals(a, b) {
    if (a.size !== b.size)
        return false;
    for (const elem of a)
        if (!b.has(elem))
            return false;
    return true;
}
