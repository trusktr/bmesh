import { BMesh } from 'bmesh'
import { cyan, deeppink } from '../colors.js'
import { App, Debug } from '../app.js'
import { createTestMesh, drawMesh } from './002_traverse_edges.js'
import { drawFacePoint } from './001_create.js'

function main() {
	App.sphericalLook(0, 20, 6)
	App.camera.position.x = 5
	App.camCtrl.update()

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	const bmesh = createTestMesh()
	const v1 = [...bmesh.vertices][1]

	let vert = v1
	let edge = vert?.diskLink?.edge

	if (!edge) throw 'missing edge'

	update()

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	initUI()
	App.renderLoop()
	// App.createRenderLoop( onPreRender ).start();

	function initUI() {
		document.getElementById('btnPrev')!.addEventListener('click', prevEdge)
		document.getElementById('btnNext')!.addEventListener('click', nextEdge)
		document.getElementById('btnFlip')!.addEventListener('click', flip)
		document.getElementById('btnDelVert')!.addEventListener('click', deleteVert)
		document.getElementById('btnDelEdge')!.addEventListener('click', deleteEdge)
		document.getElementById('btnDelFace')!.addEventListener('click', deleteFace)
	}

	function update() {
		if (edge?.radialLink) {
			let err = BMesh.validateLoop(edge.radialLink.loop.face)
			if (err) throw err
			err = BMesh.validateRadial(edge.radialLink.loop)
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

	function deleteVert() {
		if (!vert) return

		const oldVert = vert

		// If we're on a lone vert dereference or we'll leak it and keep rendering
		// the selection.
		if (!vert.edgeCount) {
			vert = undefined
		}
		// not lone vert
		else {
			vert = edge!.otherVertex(vert!)

			const oldEdge = edge
			edge = edge!.nextEdgeLink(vert).edge

			// If we're on a standalone edge, dereference it.
			if (oldEdge === edge) edge = undefined
		}

		oldVert.remove()
		update()
	}

	function deleteEdge() {
		if (!edge) return

		const oldEdge = edge!

		// If the current edge is the last edge of the current vert, switch to the
		// other vert, otherwise we'll get stuck on a lone vert with no edges (and
		// we don't have click-to-select yet).
		let nextEdge = edge!.nextEdgeLink(vert!).edge
		let isLastEdge = edge === nextEdge
		if (isLastEdge) vert = edge!.otherVertex(vert!)

		edge = edge!.nextEdgeLink(vert!).edge

		// If the current edge is also the last edge of the second vert (i.e. the
		// current edge is a lone edge), dereference it otherwise we'll keep
		// erroneously rendering the edge selection and won't let the deleted edge
		// be GC'd.
		nextEdge = edge!.nextEdgeLink(vert!).edge
		isLastEdge = edge === nextEdge
		if (isLastEdge) edge = undefined

		oldEdge.remove()
		update()
	}

	function deleteFace() {
		edge?.radialLink?.loop.face?.remove()
		update()
	}
}

if (location.pathname.endsWith('003_delete.html')) main()
