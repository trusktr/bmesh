import { BMesh, type Edge, type Loop, type Vertex } from 'bmesh'
import { black, cyan, deeppink, plumParadise } from '../colors.js'
import { App, Debug } from '../app.js'
import { drawFacePoint, drawFaceVertsEdges } from './001_create.js'
import { createTestMesh, drawMesh } from './002_traverse_edges.js'
import { type PerspectiveCamera } from 'three'
import { movePointParallelScreen } from './004_split_edge.js'

function main() {
	App.sphericalLook(0, 20, 6)
	App.camera.position.x = 5
	App.camCtrl.update()
	const camera = App.camera as PerspectiveCamera

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	const bmesh = createTestMesh()
	const v1 = [...bmesh.vertices][1]

	let vert = v1
	let edge = vert?.diskLink?.edge
	let loop = edge?.radialLink?.loop

	if (!edge) throw 'missing edge'

	update()

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	initUI()
	handleEvents()
	App.renderLoop()

	function initUI() {
		document.getElementById('btnPrev')!.addEventListener('click', prevEdge)
		document.getElementById('btnNext')!.addEventListener('click', nextEdge)
		document.getElementById('btnFlip')!.addEventListener('click', flip)
		document.getElementById('btnExtrude')!.addEventListener('click', extrudeVert)
	}

	function update() {
		validate()

		Debug.pnt.reset()
		Debug.ln.reset()

		drawMesh(bmesh, black)

		if (loop) drawFaceVertsEdges(loop.face, plumParadise)

		const vertA = vert
		const vertB = vertA ? edge?.otherVertex(vertA) : null

		if (vertA) Debug.pnt.addPoint(vertA.toArray(), cyan, 6)
		if (vertA && vertB) Debug.ln.addPoint(vertA.toArray(), vertB.toArray(), cyan, deeppink)

		for (const f of bmesh.faces) drawFacePoint(f)
	}

	function validate() {
		if (loop && !edge) throw new Error('state sync error')
		if (edge && !vert) throw new Error('state sync error')
		if (loop && loop.edge !== edge) throw new Error('state sync error')
		if (loop && loop.vertex !== vert && loop.vertex !== (vert && edge?.otherVertex(vert)))
			throw new Error('state sync error')

		if (edge?.radialLink) {
			let err = BMesh.validateLoop(edge.radialLink.loop.face)
			if (err) throw err
			err = BMesh.validateRadial(edge.radialLink.loop)
			if (err) console.error(err)
		}

		if (vert) {
			const err = BMesh.validateDisk(vert, edge)
			if (err) throw err
		}

		if (loop) {
			let err = BMesh.validateLoop(loop.face)
			if (err) throw err
			err = BMesh.validateRadial(loop)
			if (err) throw err
		}
	}

	function nextEdge() {
		if (!edge || !vert) return
		edge = edge.nextEdgeLink(vert!).edge
		loop = edge?.radialLink?.loop
		update()
	}

	function prevEdge() {
		if (!edge || !vert) return
		edge = edge.prevEdgeLink(vert).edge
		loop = edge?.radialLink?.loop
		update()
	}

	function nextRadial() {
		loop = loop?.radialLink.next.loop
		update()
	}

	function prevRadial() {
		loop = loop?.radialLink.prev.loop
		update()
	}

	function flip() {
		if (!edge || !vert) return
		vert = edge.otherVertex(vert)
		update()
	}

	function extrudeVert() {
		if (!vert) return
		vert = vert.extrude(0, 0, 0)
		edge = vert.diskLink?.edge
		loop = edge?.radialLink?.loop
		update()
	}

	/** Iterate vertex edges with right/left. Iterate radials with up/down. Delete edges with 'e', faces with 'c', and vertices with 'v'. Use WASD to move the current vertex on X and Z. Use Q and E to move along Y. */
	function handleEvents() {
		window.addEventListener('keydown', e => {
			if (e.key === 'ArrowRight' || e.key === 'j') {
				nextEdge()
			} else if (e.key === 'ArrowLeft' || e.key === 'k') {
				prevEdge()
			} else if (e.key === 'ArrowUp' || e.key === 'l') {
				nextRadial()
			} else if (e.key === 'ArrowDown' || e.key === 'h') {
				prevRadial()
			} else if (e.key === 'f') {
				flip()
			} else if (e.key === 'e') {
				extrudeVert()
			}
		})

		// Hold shift and drag to move the current vertex on parallel to the screen.
		window.addEventListener('pointermove', event => {
			if (vert && event.shiftKey) {
				movePointParallelScreen(camera, vert.position, event.movementX, -event.movementY)
				update()
			}
		})
	}
}

if (location.pathname.endsWith('005_extrude_vert.html')) main()

/**
 * Validates the current selection. Assume that the current `vert`, `edge`, and
 * `loop` are in sync (edge has vert, loop has edge, etc).
 */
export function validate(vert?: Vertex, loop?: Loop, edge?: Edge) {
	if (loop && !edge) throw new Error('state sync error')
	if (edge && !vert) throw new Error('state sync error')
	if (loop && loop.edge !== edge) throw new Error('state sync error')
	if (loop && loop.vertex !== vert && loop.vertex !== (vert && edge?.otherVertex(vert)))
		throw new Error('state sync error')

	if (edge?.radialLink) {
		let err = BMesh.validateLoop(edge.radialLink.loop.face)
		if (err) throw err
		err = BMesh.validateRadial(edge.radialLink.loop)
		if (err) console.error(err)
	}

	if (vert) {
		const err = BMesh.validateDisk(vert, edge)
		if (err) throw err
	}

	if (loop) {
		let err = BMesh.validateLoop(loop.face)
		if (err) throw err
		err = BMesh.validateRadial(loop)
		if (err) throw err
	}
}
