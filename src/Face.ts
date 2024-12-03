import { BMesh } from './BMesh.js'
import { Loop } from './Loop.js'
import { Edge } from './Edge.js'
import { Link } from './Link.js'
import { Vertex } from './Vertex.js'
import { BMeshElement } from './BMeshElement.js'

/**
 * To represent a linked list of Loops for faces that share the same edge.
 */
export class RadialLoopLink extends Link() {
	override next: RadialLoopLink = this
	override prev: RadialLoopLink = this
	override circular = true

	loop: Loop

	constructor(loop: Loop) {
		super()
		this.loop = loop
	}
}

export class Face extends BMeshElement {
	loop!: Loop
	edgeCount: number

	// BM_face_create
	constructor(mesh: BMesh, vertices: Vertex[], edges: Edge[] = mesh.edgesFromVerts(...vertices)) {
		super(mesh)

		Face.#validateInput(vertices, edges)

		this.edgeCount = vertices.length

		// avoid duplicate faces
		const face = BMesh.existingFace(vertices)
		if (face) return face

		this.#createLoops(vertices, edges)

		mesh.faces.add(this)
	}

	#createLoops(vertices: Vertex[], edges: Edge[]): void {
		let lastLoop

		for (const [i, vert] of vertices.entries()) {
			const edge = edges[i]!
			const nextVert = vertices[(i + 1) % vertices.length]!

			if (!edge.hasVertex(vert)) throw new TypeError("edge doesn't contain vertex. wrong order?")
			if (!edge.hasVertex(nextVert)) throw new TypeError("edge doesn't contain vertex. wrong order?")

			const loop = this.#createLoop(vert, edge)
			this.loop ??= loop

			lastLoop?.insertAfter(loop)
			lastLoop = loop
		}
	}

	// BM_loop_create
	#createLoop(vertex: Vertex, edge: Edge): Loop {
		const loop = new Loop(this, vertex, edge)
		const newLink = loop.radialLink

		if (!edge.radialLink) edge.radialLink = newLink
		edge.radialLink.insertBefore(newLink)
		edge.faceCount++

		return loop
	}

	static #validateInput(vertices: Vertex[], edges: Edge[]): void {
		if (!vertices || !edges) throw new TypeError('vertices and edges are required for a face')
		if (vertices.length < 3) throw new TypeError('a face must have at least 3 vertices')
		if (vertices.length !== edges.length) throw new TypeError('number of vertices must match number of edges')
		if (vertices.length !== new Set(vertices).size) throw new TypeError('duplicate vertices not allowed')
		if (edges.length !== new Set(edges).size) throw new TypeError('duplicate edges not allowed')
	}

	// BM_face_kill
	/**
	 * Remove this face and its loops from the mesh.
	 */
	remove(): void {
		for (const loop of [...this.loop]) this.#removeLoop(loop)

		this.mesh.faces.delete(this)
	}

	#removeLoop(loop: Loop): void {
		loop.unlink()

		const isLastRemainingRadial = loop.radialLink.next === loop.radialLink
		const { next: nextLink, prev: prevLink } = loop.radialLink
		loop.radialLink.unlink()
		if (isLastRemainingRadial) loop.edge.radialLink = null
		else if (loop.edge.radialLink === loop.radialLink) loop.edge.radialLink = nextLink ?? prevLink

		loop.edge.faceCount--
	}
}
