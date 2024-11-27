import useThreeWebGL2, { useDarkScene, useVisualDebug } from '../../../prototypes/_lib/useThreeWebGL2.js'

import { BMesh2, Edge2, Face2, vec3, Vertex2 } from 'bmesh'
import { cyan, deeppink, yellow } from '../colors.js'

const App = useDarkScene(useThreeWebGL2())

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Setup
const Debug = await useVisualDebug(App)
App.sphericalLook(0, 20, 6)
App.camera.position.x = 5
App.camCtrl.update()

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const bmesh = new BMesh2()
const v0 = new Vertex2(bmesh, -2, 0, -1)
const v1 = new Vertex2(bmesh, 0, 0, -1)
const v2 = new Vertex2(bmesh, 2, 0, -1)
const v3 = new Vertex2(bmesh, -2, 0, 1)
const v4 = new Vertex2(bmesh, 0, 0, 1)
const v5 = new Vertex2(bmesh, 2, 0, 1)
const v6 = new Vertex2(bmesh, 0, 1, -1)
const v7 = new Vertex2(bmesh, 0, 1, 1)

const fVerts0 = [v1, v4, v5, v2]
new Face2(bmesh, fVerts0, bmesh.edgesFromVerts(...fVerts0))
const fVerts1 = [v0, v3, v4, v1]
new Face2(bmesh, fVerts1, bmesh.edgesFromVerts(...fVerts1))
const fVerts2 = [v1, v6, v7, v4]
new Face2(bmesh, fVerts2, bmesh.edgesFromVerts(...fVerts2))

const v8 = new Vertex2(bmesh, 0, 1.5, 1.5)
new Edge2(bmesh, v7, v8)

let vert = [...bmesh.vertices][1]
if (!vert) throw 'missing vert'

let edge = vert.edgeLink?.edge
if (!edge) throw 'missing edge'

/* eslint-disable */

render()

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
initUI()
App.renderLoop()
// App.createRenderLoop( onPreRender ).start();

function initUI() {
	document.getElementById('btnPrev')!.addEventListener('click', prevEdge)
	document.getElementById('btnNext')!.addEventListener('click', nextEdge)
	document.getElementById('btnFlip')!.addEventListener('click', flip)
}

function render() {
	Debug.pnt.reset()
	Debug.ln.reset()

	for (const v of bmesh.vertices) Debug.pnt.addPoint(v.toArray(), deeppink, 6)
	for (const e of bmesh.edges) Debug.ln.addPoint(e.vertexA.toArray(), e.vertexB.toArray(), deeppink)

	const vertA = vert
	const vertB = vertA ? edge?.otherVertex(vertA) : null

	if (vertA) Debug.pnt.addPoint(vertA.toArray(), cyan, 6)
	if (vertA && vertB) Debug.ln.addPoint(vertA.toArray(), vertB.toArray(), cyan, deeppink)

	for (const f of bmesh.faces) renderFace(f)
}

function nextEdge() {
	if (!edge || !vert) return
	edge = edge.nextEdgeLink(vert!).edge
	render()
}

function prevEdge() {
	if (!edge || !vert) return
	edge = edge.prevEdgeLink(vert).edge
	render()
}

function flip() {
	if (!edge || !vert) return
	vert = edge.otherVertex(vert)
	render()
}

function renderFace(f: Face2) {
	const avg = vec3.avg(...[...f.loop].map(([l]) => l.vertex.toArray()))
	const pointSize = 7
	Debug.pnt.addPoint(avg, yellow, pointSize, 2)
}
