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

	let err = BMesh.validateLoop(f)
	if (err) throw err
	err = BMesh.validateRadial(f.loop)
	if (err) throw err

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
export function drawFacePoint(face: Face, color = yellow) {
	const pointSize = 7
	Debug.pnt.addPoint(centroid(face), color, pointSize, 2)
}

/** get the centroid of a set of edges */
export function centroid(face: Face, target: [number, number, number] = [0, 0, 0]): [number, number, number] {
	let xSum = 0
	let ySum = 0
	let zSum = 0
	let lengthSum = 0

	for (const loop of face.loop) {
		const { x: x1, y: y1, z: z1 } = loop.edge.vertexA
		const { x: x2, y: y2, z: z2 } = loop.edge.vertexB

		// If zero length, use a small value to avoid NaN.
		const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2) || Number.MIN_VALUE
		const midX = (x1 + x2) / 2
		const midY = (y1 + y2) / 2
		const midZ = (z1 + z2) / 2

		xSum += midX * length
		ySum += midY * length
		zSum += midZ * length
		lengthSum += length
	}

	target[0] = xSum / lengthSum
	target[1] = ySum / lengthSum
	target[2] = zSum / lengthSum

	return target
}
