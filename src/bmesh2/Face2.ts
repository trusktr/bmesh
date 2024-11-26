import { BMesh2 } from './BMesh2.js'
import { Loop2 } from './Loop2.js'
import { Edge2 } from './Edge2.js'
import { Link, type AnyLink } from './Link.js'
import { Vertex2 } from './Vertex2.js'
import { BMeshElement } from './BMeshElement.js'

/**
 * To represent a linked list of Loops for faces that share the same edge.
 */
export class RadialLoopLink extends Link() {
	override next: RadialLoopLink | null = null
	override prev: RadialLoopLink | null = null
	readonly loop: Loop2

	constructor(loop: Loop2) {
		super()
		this.loop = loop
	}
}

export class Face2 extends BMeshElement {
	readonly loop: Loop2
	readonly edgeCount: number

	// BM_face_create
	constructor(mesh: BMesh2, vertices: Vertex2[], edges: Edge2[]) {
		super(mesh)

		Face2.#validateInput(vertices, edges)

		this.edgeCount = vertices.length
		this.loop = this.#createLoop(vertices[0]!, edges[0]!)

		// avoid duplicate faces
		const face = BMesh2.existingFace(vertices)
		if (face) return face

		// Run this *after* the existingFace check, or else existingFace will detect an invalid Loop.
		// edges[0]!.addLoop(this.loop)
		this.#createLoops(vertices, edges)

		mesh.addFace(this)
	}

	// BM_loop_create
	#createLoop(vertex: Vertex2, edge: Edge2): Loop2 {
		const loop = new Loop2(this, vertex, edge)
		const link = loop.radialLink

		// @ts-expect-error internal write of radialLink
		if (!edge.radialLink) edge.radialLink = link.next = link.prev = link

		// TODO consolidate into Link
		const last = edge.radialLink.prev!
		last.next = link
		link.prev = last
		link.next = edge.radialLink
		edge.radialLink.prev = link

		// @ts-expect-error internal write of faceCount
		edge.faceCount++

		return loop
	}

	#createLoops(vertices: Vertex2[], edges: Edge2[]): void {
		const start = this.loop
		let lastLoop = start

		for (const [i, vert] of vertices.entries()) {
			if (i === 0) continue

			const edge = edges[i]!
			const nextVert = vertices[(i + 1) % vertices.length]!

			if (!edge.hasVertex(vert)) throw new TypeError("edge doesn't contain vertex. wrong order?")
			if (!edge.hasVertex(nextVert)) throw new TypeError("edge doesn't contain vertex. wrong order?")

			const loop = this.#createLoop(vert, edge)

			lastLoop.next = loop
			loop.prev = lastLoop
			lastLoop = loop
		}

		start.prev = lastLoop
		lastLoop.next = start
	}

	static #validateInput(vertices: Vertex2[], edges: Edge2[]): void {
		if (vertices.length < 3) throw new TypeError('a face must have at least 3 vertices')
		if (vertices.length !== edges.length) throw new TypeError('number of vertices must match number of edges')
		if (vertices.length !== new Set(vertices).size) throw new TypeError('duplicate vertices not allowed')
		if (edges.length !== new Set(edges).size) throw new TypeError('duplicate edges not allowed')
	}

	// BM_face_kill
	remove(): void {
		for (const [loop] of [...this.loop.radial()]) {
			// for (const [loop] of this.loop.radial(true, false)) {
			console.log('   -- remove loop link (remove face loop)')
			this.#removeLoop(loop)
		}

		// TODO remove from mesh
		this.mesh.faces.delete(this)
	}

	#removeLoop(loop: Loop2): void {
		// TODO consolidate into Link
		let link: AnyLink = loop
		let nextLink = link.next
		let prevLink = link.prev
		link.next = null
		link.prev = null
		if (prevLink) prevLink.next = nextLink // if circular, and pointing to itself again, that's fine, it'll be GC'd
		if (nextLink) nextLink.prev = prevLink

		const isLastRemainingRadial = loop.radialLink.next === loop.radialLink

		// TODO consolidate into Link
		link = loop.radialLink
		nextLink = link.next
		prevLink = link.prev
		link.next = null
		link.prev = null
		if (prevLink) prevLink.next = nextLink // if circular, and pointing to itself again, that's fine, it'll be GC'd
		if (nextLink) nextLink.prev = prevLink

		// @ts-expect-error internal write of radialLink
		if (isLastRemainingRadial) loop.edge.radialLink = null
		// @ts-expect-error internal write of radialLink
		else if (loop.edge.radialLink === link) loop.edge.radialLink = nextLink ?? prevLink

		// @ts-expect-error internal write of faceCount
		loop.edge.faceCount--
	}
}
