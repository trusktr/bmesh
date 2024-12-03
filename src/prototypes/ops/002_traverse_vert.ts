import { BMesh } from 'bmesh'
import { cyan, deeppink } from '../colors.js'
import { drawFacePoint } from './001_create.js'
import { App, Debug } from '../app.js'
import { createTestMesh, drawMesh } from './002_traverse_edges.js'

async function main() {
	App.sphericalLook(0, 20, 6)
	App.camera.position.x = 5
	App.camCtrl.update()

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	const bmesh = createTestMesh()

	let vert = [...bmesh.vertices][1]
	if (!vert) throw 'missing vert'

	let edge = vert.diskLink?.edge
	if (!edge) throw 'missing edge'

	update()

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	initUI()
	App.renderLoop()

	function initUI() {
		document.getElementById('btnPrev')!.addEventListener('click', prevEdge)
		document.getElementById('btnNext')!.addEventListener('click', nextEdge)
		document.getElementById('btnFlip')!.addEventListener('click', flip)
	}

	function update() {
		if (edge?.radialLink) {
			let err = BMesh.validateLoop(edge.radialLink.loop.face)
			if (err) throw err
			err = BMesh.validateRadial(edge.radialLink.loop)
			if (err) throw err
		}

		if (vert) {
			const err = BMesh.validateDisk(vert, edge)
			if (err) throw err
		}

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
		update()
	}

	function prevEdge() {
		if (!edge || !vert) return
		edge = edge.prevEdgeLink(vert).edge
		update()
	}

	function flip() {
		if (!edge || !vert) return
		vert = edge.otherVertex(vert)
		update()
	}
}

if (location.pathname.endsWith('002_traverse_vert.html')) main()
