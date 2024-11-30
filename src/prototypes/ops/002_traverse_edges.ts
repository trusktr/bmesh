import useThreeWebGL2, { useDarkScene, useVisualDebug } from '../../../prototypes/_lib/useThreeWebGL2.js'

import { BMesh, Face, type Loop, vec3, Vertex } from 'bmesh'
import { cyan, deeppink, yellow } from '../colors.js'

const App = useDarkScene(useThreeWebGL2())

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Setup
const Debug = await useVisualDebug(App)
App.sphericalLook(0, 20, 6)
App.camera.position.x = 5
App.camCtrl.update()

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const bmesh = new BMesh()
const v0 = new Vertex(bmesh, -2, 0, -1)
const v1 = new Vertex(bmesh, 0, 0, -1)
const v2 = new Vertex(bmesh, 2, 0, -1)
const v3 = new Vertex(bmesh, -2, 0, 1)
const v4 = new Vertex(bmesh, 0, 0, 1)
const v5 = new Vertex(bmesh, 2, 0, 1)
const v6 = new Vertex(bmesh, 0, 1, -1)
const v7 = new Vertex(bmesh, 0, 1, 1)

const fVerts0 = [v1, v4, v5, v2]
new Face(bmesh, fVerts0, bmesh.edgesFromVerts(...fVerts0))
const fVerts1 = [v0, v3, v4, v1]
new Face(bmesh, fVerts1, bmesh.edgesFromVerts(...fVerts1))
const fVerts2 = [v1, v6, v7, v4]
const f = new Face(bmesh, fVerts2, bmesh.edgesFromVerts(...fVerts2))

// tests ///////////////////////////////////////////////////

const set = new Set()
for (const [loop, nextLoop] of f.loop) {
	console.assert(loop!.next === nextLoop, 'should be valid next loops')
	set.add(loop)
}
console.assert(set.size === 4, 'iteration should work, size should match')

set.clear()

f.loop.forEach(l => {
	set.add(l)
})
console.assert(set.size === 4, 'forEach should work')

set.clear()

const arr = [...f.loop.iterator()]
arr.forEach(l => {
	set.add(l)
})
console.assert(set.size === 4, 'subsequent iteration should work')

// three faces
console.assert(bmesh.faces.size === 3)

// two faces share the same edge as the first face (12 - 2)
console.assert(bmesh.edges.size === 10)

// two faces share the same two vertices as the first face (12 - 4)
console.assert(bmesh.vertices.size === 8)

const loops = new Set<Loop>()
for (const edge of bmesh.edges)
	for (const radialLink of edge.radialLink ?? []) for (const loop of radialLink.loop) loops.add(loop)

const loops2 = new Set<Loop>()
for (const face of bmesh.faces) for (const loop of face.loop) loops2.add(loop)

// Loops are unique to each face, not shared (4 * 3).
console.assert(loops.size === 12)

// Ensure we didn't do anything funky like add loops to edges but not faces.
console.assert(setEquals(loops, loops2))

////////////////////////////////////////////////////////////

let loop = [...bmesh.faces][0]!.loop.prev!

console.log(bmesh)

render()

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
initUI()
App.renderLoop()
// App.createRenderLoop( onPreRender ).start();

function initUI() {
	document.getElementById('btnPrev')!.addEventListener('click', loopPrev)
	document.getElementById('btnNext')!.addEventListener('click', loopNext)

	document.getElementById('btnRPrev')!.addEventListener('click', radialPrev)
	document.getElementById('btnRNext')!.addEventListener('click', radialNext)
}

function render() {
	Debug.pnt.reset()
	Debug.ln.reset()

	drawMesh(bmesh)

	const a = loop.vertex.toArray()
	const b = loop.edge.otherVertex(loop.vertex).toArray()

	// TODO normals
	// const n = loop.face.normal.toArray()
	// vec3.scale(n, 0.2, n)
	// vec3.add(a, n, a)
	// vec3.add(b, n, b)

	const pointSize = 5
	Debug.pnt.addPoint(a, cyan, pointSize)
	Debug.ln.addPoint(a, b, cyan)

	renderFace()
}

function renderFace() {
	const avg = vec3.avg(...[...loop].map(l => l.vertex.toArray()))
	const pointSize = 7
	Debug.pnt.addPoint(avg, yellow, pointSize, 2)
}

function loopNext() {
	loop = loop.next!
	render()
}

function loopPrev() {
	loop = loop.prev!
	render()
}

function radialNext() {
	loop = loop.radialLink.next!.loop
	render()
}

function radialPrev() {
	loop = loop.radialLink.prev!.loop
	render()
}

// function drawFace(f: Face2, lineColor = deeppink) {
// 	// const offset = Math.random()
// 	const offset = 0
// 	for (const [l] of f.loop.links()) {
// 		const pointSize = 5
// 		Debug.pnt.addPoint(vec3.add(l.vertex.toArray(), [offset, offset, offset]), deeppink, pointSize)
// 		Debug.ln.addPoint(
// 			vec3.add(l.edge.vertexA.toArray(), [offset, offset, offset]),
// 			vec3.add(l.edge.vertexB.toArray(), [offset, offset, offset]),
// 			lineColor,
// 		)
// 	}
// }

function drawMesh(bmesh: BMesh) {
	// This duplicates the rendering of shared edges and vertices.
	// let i = 0
	// for (const f of bmesh.faces) {
	// 	if (i === 0) drawFace(f, red)
	// 	if (i === 1) drawFace(f, cyan)
	// 	if (i === 2) drawFace(f, orange)
	// 	i++
	// }

	// This does not duplicate edges/vertices, and it covers non-faces too (f.e. standalone edges)
	const pointSize = 5
	for (const v of bmesh.vertices) Debug.pnt.addPoint(v.toArray(), deeppink, pointSize)
	for (const e of bmesh.edges) Debug.ln.addPoint(e.vertexA.toArray(), e.vertexB.toArray(), deeppink)
}

// function onPreRender( dt, et ){}

function setEquals<T>(a: Set<T>, b: Set<T>) {
	if (a.size !== b.size) return false
	for (const elem of a) if (!b.has(elem)) return false
	return true
}
