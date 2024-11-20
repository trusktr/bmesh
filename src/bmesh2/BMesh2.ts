/**
 * This is a port of Blender's BMesh data structure to JavaScript, but without
 * anything specific to rendering such as normals or material indices. Maybe
 * we'll add normals later if it would be useful for JS 3D engines like Threejs
 * or PlayCanvas to copy them from a bmesh, but for now they can generate their
 * own.
 */
export class BMesh2 {
	vertices: Set<Vertex2> = new Set()
	edges: Set<Edge2> = new Set()
	loops: Set<Loop2> = new Set()
	faces: Set<Face2> = new Set()

	addVertex(vertex: Vertex2): void {
		this.vertices.add(vertex)
	}

	addEdge(edge: Edge2): void {
		this.edges.add(edge)
	}

	addFace(face: Face2): void {
		this.faces.add(face)
	}

	addLoop(loop: Loop2): void {
		this.loops.add(loop)
	}

	// BM_face_exists
	/** Returns the face that exists between the given vertices, or null if none. */
	static existingFace(vertices: Vertex2[]): Face2 | null {
		if (!vertices[0]) return null

		for (const edge of vertices[0].edges) {
			if (!edge.radials.size) continue

			for (const radial of edge.radials) {
				// check both directions, as we don't know which order `vertices` is in

				let i = 0
				let loop

				for ([i, loop] of radial.radial()) if (loop.vertex !== vertices[i]) break
				if (i + 1 === vertices.length) return radial.face

				for ([i, loop] of radial.radialReverse()) if (loop.vertex !== vertices[i]) break
				if (i + 1 === vertices.length) return radial.face
			}
		}

		return null
	}

	// BM_edge_exists
	/** Returns the edge that exists between two vertices, or null if none. */
	static existingEdge(start: Vertex2, end: Vertex2): Edge2 | null {
		if (start === end) throw new TypeError('start and end vertices must be different')

		if (!start.edges.size || !end.edges.size) return null

		// Iterate over the smaller set of edges.
		const edges = start.edges.size < end.edges.size ? start.edges : end.edges

		for (const edge of edges) {
			if (edge.start === start && edge.end === end) return edge
			if (edge.start === end && edge.end === start) return edge
		}

		return null
	}

	// bmesh_loop_validate
	/** Returns true if a loop is valid, false otherwise. */
	validateLoop(face: Face2): boolean {
		if (!face.loop) return false

		let loop = face.loop
		let i = 0

		for ([i, loop] of face.loop.radial()) if (i + 1 > face.length) return false
		if (i + 1 !== face.length) return false
		if (loop.next !== face.loop) return false

		// verify the other direction too

		for ([i, loop] of face.loop.radialReverse()) if (i + 1 > face.length) return false
		if (i + 1 !== face.length) return false
		if (loop.prev !== face.loop) return false

		return true
	}
}

export class Vertex2 {
	x: number
	y: number
	z: number

	/** All edges that start or end at this vertex. */
	// Not a circular linked list because order doesn't matter.
	edges: Set<Edge2> = new Set()

	constructor(mesh: BMesh2, x = 0, y = 0, z = 0) {
		this.x = x
		this.y = y
		this.z = z

		mesh.addVertex(this)
	}
}

export class Edge2 {
	start: Vertex2
	end: Vertex2

	/** A set of Loops, one per face that share this same edge. */
	// Not a circular linked list because order doesn't matter.
	radials: Set<Loop2> = new Set()

	constructor(mesh: BMesh2, start: Vertex2, end: Vertex2, loop: Loop2 | null = null) {
		this.start = start
		this.end = end

		// avoid duplicate edges
		const edge = BMesh2.existingEdge(start, end)
		if (edge) return edge

		start.edges.add(this)
		end.edges.add(this)

		if (loop) {
			if (loop.edge) throw new TypeError('loop already has an edge')
			loop.edge = this
			this.radials.add(loop)
		}

		mesh.addEdge(this)
	}

	hasVertex(vertex: Vertex2): boolean {
		return this.start === vertex || this.end === vertex
	}
}

export class Face2 {
	loop: Loop2
	length: number

	constructor(mesh: BMesh2, vertices: Vertex2[], edges: Edge2[]) {
		Face2.validateInput(vertices, edges)

		this.length = vertices.length

		const start = new Loop2(mesh, vertices[0]!, edges[0]!, this)
		let last = (this.loop = start)

		// avoid duplicate faces
		const face = BMesh2.existingFace(vertices)
		if (face) return face

		for (const [i, vertex] of vertices.entries()) {
			if (i === 1) continue

			const edge = edges[i]!
			if (!edge.hasVertex(vertex)) throw new TypeError("edge doesn't contain vertex. wrong order?")

			const loop = new Loop2(mesh, vertex, edge, this)
			edge.radials.add(loop)

			loop.prev = last
			last.next = loop
			last = loop
		}

		start.prev = last
		last.next = start

		mesh.addFace(this)
	}

	static validateInput(vertices: Vertex2[], edges: Edge2[]): void {
		if (vertices.length < 3) throw new TypeError('a face must have at least 3 vertices')
		if (vertices.length !== edges.length) throw new TypeError('number of vertices must match number of edges')
		if (vertices.length !== new Set(vertices).size) throw new TypeError('duplicate vertices not allowed')
		if (edges.length !== new Set(edges).size) throw new TypeError('duplicate edges not allowed')
	}
}

export class Loop2 {
	vertex: Vertex2
	edge: Edge2
	face: Face2
	next: Loop2 | null
	prev: Loop2 | null

	constructor(
		mesh: BMesh2,
		vertex: Vertex2,
		edge: Edge2,
		face: Face2,
		next: Loop2 | null = null,
		prev: Loop2 | null = null,
	) {
		this.vertex = vertex
		this.edge = edge
		this.face = face
		this.next = next
		this.prev = prev

		mesh.addLoop(this)
	}

	/**
	 * Iterate the Loops of the current radial loop (the current face, the current
	 * circular linked list).
	 */
	*radial(): Generator<[index: number, loop: Loop2], void, void> {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let loop: Loop2 | null = this
		let i = 0

		do {
			if (!loop) throw new InvalidLoopError()
			yield [i++, loop]
		} while ((loop = loop.next) != this)
	}

	/**
	 * Iterate the Loops of the current radial loop (the current face, the current
	 * circular linked list) in reverse.
	 */
	*radialReverse(): Generator<[index: number, loop: Loop2], void, void> {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let loop: Loop2 | null = this
		let i = 0

		do {
			if (!loop) throw new InvalidLoopError()
			yield [i++, loop]
		} while ((loop = loop.prev) != this)
	}
}

class InvalidLoopError extends Error {
	constructor() {
		super('Invalid loop detected. Loops should form a circular linked list.')
	}
}

/**
 * - Monday: setup new computer (yay, finally something decent)
 *   - compiled blender to get intellisense and type checking working in blender source for easy navigation and learning.
 *   - exploring blender bmesh source
 *   - started working on bmesh2 in JS
 * - Tuesday: got creation ops basically done, should be enough to create a mesh
 * - Wednesday: create mesh, render it, replicate the edge iteration demo
 */
