import { BMesh2 } from './BMesh2'
import { Loop2 } from './Loop2'
import { Edge2 } from './Edge2'
import { Link } from './Link'
import { Vertex2 } from './Vertex2'

export class RadialLink extends Link {
	override next: RadialLink | null = null
	override prev: RadialLink | null = null
	readonly loop: Loop2

	constructor(loop: Loop2) {
		super()
		this.loop = loop
	}
}

export class Face2 {
	loop: Loop2
	length: number

	// BM_face_create
	constructor(mesh: BMesh2, vertices: Vertex2[], edges: Edge2[]) {
		Face2.#validateInput(vertices, edges)

		this.length = vertices.length
		this.loop = new Loop2(mesh, this, vertices[0]!, edges[0]!)

		// avoid duplicate faces
		const face = BMesh2.existingFace(vertices)
		if (face) return face

		// Run this *after* the existingFace check, or else existingFace will detect an invalid Loop.
		// edges[0]!.addLoop(this.loop)
		this.#createLoop(mesh, vertices, edges)

		mesh.addFace(this)
	}

	#createLoop(mesh: BMesh2, vertices: Vertex2[], edges: Edge2[]): void {
		const start = this.loop
		let lastLoop = start

		for (const [i, vert] of vertices.entries()) {
			if (i === 0) continue

			const edge = edges[i]!
			const nextVert = vertices[(i + 1) % vertices.length]!

			if (!edge.hasVertex(vert)) throw new TypeError("edge doesn't contain vertex. wrong order?")
			if (!edge.hasVertex(nextVert)) throw new TypeError("edge doesn't contain vertex. wrong order?")

			const loop = new Loop2(mesh, this, vert, edge)

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
}
