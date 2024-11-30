// Basic creation of a mesh with a face and drawing of vertices and edges.

import { BMesh, Face, vec3, Vertex } from 'bmesh'
import { App, Debug } from '../app.js'
import { deeppink, yellow } from '../colors.js'
/** @import { Face, Vertex } from 'bmesh' */

async function main() {
	App.sphericalLook(0, 20, 6)

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	const mesh = new BMesh()
	const v0 = new Vertex(mesh, -1, 0, -1)
	const v1 = new Vertex(mesh, 1, 0, -1)
	const v2 = new Vertex(mesh, 1, 0, 1)

	const f = new Face(mesh, [v0, v1, v2])

	// drawVertEdges(v1)
	// drawMeshVertsEdges(mesh)
	drawFaceVertsEdges(f)

	drawFacePoint(f)

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	App.renderLoop()
}

// Don't run demo if being imported in other demo.
if (location.pathname.endsWith('001_create.html')) main()

export function drawMeshVertsEdges(mesh: BMesh) {
	for (const v of mesh.vertices) Debug.pnt.addPoint(v.toArray(), 0x00ff00, 3)
	for (const e of mesh.edges) Debug.ln.addPoint(e.vertexA.toArray(), e.vertexB.toArray(), 0x00ffff)
}

export function drawFaceVertsEdges(f: Face, lineColor = deeppink) {
	// const offset = Math.random()
	const offset = 0

	for (const l of f.loop) {
		const pointSize = 5
		Debug.pnt.addPoint(vec3.add(l.vertex.toArray(), [offset, offset, offset]), deeppink, pointSize)
		Debug.ln.addPoint(
			vec3.add(l.edge.vertexA.toArray(), [offset, offset, offset]),
			vec3.add(l.edge.vertexB.toArray(), [offset, offset, offset]),
			lineColor,
		)
	}
}

export function drawVertEdges(v: Vertex) {
	for (const link of v.diskLink ?? []) {
		Debug.ln.addPoint(link.edge.vertexA.toArray(), link.edge.vertexB.toArray(), 0x00ffff)
	}
}

// We could use center of mass instead of average to make this better.
export function drawFacePoint(face: Face) {
	const points = [...face.loop].map(l => l.vertex.toArray())
	const avg = vec3.avg(...points)
	const pointSize = 7
	Debug.pnt.addPoint(avg, yellow, pointSize, 2)
}
