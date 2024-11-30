import { BMesh, Edge, Face, Vertex } from 'bmesh'
import { cyan, deeppink } from '../colors.js'
import { drawFacePoint } from './001_create.js'
import { App, Debug } from '../app.js'
import { drawMesh } from './002_traverse_edges.js'

async function main() {
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
	new Face(bmesh, fVerts2, bmesh.edgesFromVerts(...fVerts2))

	const v8 = new Vertex(bmesh, 0, 1.5, 1.5)
	new Edge(bmesh, v7, v8)

	let vert = [...bmesh.vertices][1]
	if (!vert) throw 'missing vert'

	let edge = vert.diskLink?.edge
	if (!edge) throw 'missing edge'

	render()

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	initUI()
	App.renderLoop()

	function initUI() {
		document.getElementById('btnPrev')!.addEventListener('click', prevEdge)
		document.getElementById('btnNext')!.addEventListener('click', nextEdge)
		document.getElementById('btnFlip')!.addEventListener('click', flip)
	}

	function render() {
		Debug.pnt.reset()
		Debug.ln.reset()

		drawMesh(bmesh)

		const vertA = vert
		const vertB = vertA ? edge?.otherVertex(vertA) : null

		if (vertA) Debug.pnt.addPoint(vertA.toArray(), cyan, 6)
		if (vertA && vertB) Debug.ln.addPoint(vertA.toArray(), vertB.toArray(), cyan, deeppink)

		for (const f of bmesh.faces) drawFacePoint(f)
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
}

if (location.pathname.endsWith('002_traverse_vert.html')) main()
