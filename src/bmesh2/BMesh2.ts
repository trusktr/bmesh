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
		const err = BMesh2.validateLoop(face)
		if (err) throw err
		this.faces.add(face)
	}

	addLoop(loop: Loop2): void {
		this.loops.add(loop)
	}

	// BM_edges_from_verts_ensure
	edgesFromVerts(...vertices: Vertex2[]): Edge2[] {
		const edges: Edge2[] = []

		// ensure no duplicate vertices
		if (vertices.length !== new Set(vertices).size) throw new TypeError('duplicate vertices not allowed')

		console.log('verts:', ...vertices.map(v => v.toArray()))
		for (const [i, vertex] of vertices.entries()) {
			const next = vertices[(i + 1) % vertices.length]!
			console.log('existing edge?', vertex.toArray(), next.toArray(), BMesh2.existingEdge(vertex, next))
			const edge = BMesh2.existingEdge(vertex, next) ?? new Edge2(this, vertex, next)
			edges.push(edge)
		}

		return edges
	}

	// BM_face_exists
	/** Returns the face that exists between the given vertices, or null if none. */
	static existingFace(vertices: Vertex2[]): Face2 | null {
		if (!vertices[0]) return null

		for (const edge of vertices[0].edges) {
			for (const [link] of edge.radialLinks()) {
				// check both directions, as we don't know which order `vertices` is in
				if (link.loop.verticesMatch(vertices, false)) return link.loop.face
				if (link.loop.verticesMatchReverse(vertices, false)) return link.loop.face
			}
		}

		return null
	}

	// BM_edge_exists
	/** Returns the edge that exists between two vertices, or null if none. */
	static existingEdge(vertA: Vertex2, vertB: Vertex2): Edge2 | null {
		if (vertA === vertB) throw new TypeError('edge vertices must be different')

		if (!vertA.edges.size || !vertB.edges.size) return null

		// Iterate over the smaller set of edges.
		const edges = vertA.edges.size < vertB.edges.size ? vertA.edges : vertB.edges

		for (const edge of edges) if (edge.hasVertex(vertA) && edge.hasVertex(vertB)) return edge

		return null
	}

	// bmesh_loop_validate
	/** Returns true if a loop is valid, false otherwise. */
	static validateLoop(face: Face2): Error | null {
		if (!face.loop) return new Error('face has no loop')

		const segments = Array.from(face.loop.radial())
		if (segments.length !== face.length) return new Error('face length does not match loop length')

		for (const [loop, i] of segments) {
			const nextLoop = segments[(i + 1) % face.length]![0]
			if (nextLoop.prev !== loop) return new Error('reverse loop does not match forward loop')
			if (loop.face !== nextLoop.face) return new Error('each loop must belong to the same face')
			if (loop.edge === nextLoop.edge) return new Error('each loop must have a different edge')
			if (loop.vertex === nextLoop.vertex) return new Error('each loop must have a different vertex')
		}

		return null
	}
}

export class Vertex2 {
	x: number
	y: number
	z: number

	/** All edges that are connected to this vertex. */
	// Not a circular linked list because order doesn't matter.
	edges: Set<Edge2> = new Set()

	// BM_vert_create
	constructor(mesh: BMesh2, x = 0, y = 0, z = 0) {
		this.x = x
		this.y = y
		this.z = z

		mesh.addVertex(this)
	}

	toArray(): [number, number, number] {
		return [this.x, this.y, this.z]
	}
}

export class RadialLink implements Link {
	next: RadialLink | null = null
	prev: RadialLink | null = null
	readonly loop: Loop2

	constructor(loop: Loop2) {
		this.loop = loop
	}
}

/**
 * Edges connect two vertices. They are non-directional, meaning an edge with
 * two vertices for vertexA and vertexB is the same edge if the same two
 * vertices are assigned to vertexB and vertexA instead.
 *
 * Only Loops determine direction for a given loop. Within a particular loop an
 * some edges may go from vertexA to vertexB, and others from vertexB to
 * vertexA.
 */
export class Edge2 {
	/** The first vertex of this edge (order independent). */
	vertexA: Vertex2
	/** The second vertex of this edge (order independent). */
	vertexB: Vertex2

	/**
	 * A circular linked list of Loops, one per face that share this edge.
	 * Unlike with face loops, the order of these loops does not matter.
	 */
	radialLink: RadialLink | null = null

	/** Number of faces that share this edge. */
	faceCount = 0

	// BM_edge_create
	constructor(mesh: BMesh2, vertA: Vertex2, vertB: Vertex2) {
		this.vertexA = vertA
		this.vertexB = vertB

		// avoid duplicate edges
		const edge = BMesh2.existingEdge(vertA, vertB)
		if (edge) return edge

		vertA.edges.add(this)
		vertB.edges.add(this)

		mesh.addEdge(this)
	}

	hasVertex(vertex: Vertex2): boolean {
		return this.vertexA === vertex || this.vertexB === vertex
	}

	otherVertex(vertex: Vertex2): Vertex2 {
		if (this.vertexA === vertex) return this.vertexB
		if (this.vertexB === vertex) return this.vertexA
		throw new TypeError('vertex is not part of this edge')
	}

	addLoop(loop: Loop2): RadialLink {
		if (loop.radialLink) throw new TypeError('loop already belongs to another edge')

		loop.edge = this
		const link = (loop.radialLink = new RadialLink(loop))

		if (!this.radialLink) this.radialLink = link.next = link.prev = link

		const last = this.radialLink.prev!
		last.next = link
		link.prev = last
		link.next = this.radialLink
		this.radialLink.prev = link

		this.faceCount++

		return link
	}

	/**
	 * Iterate all the Loops of the current radial loop (the current face, the
	 * current circular linked list).
	 */
	*radialLinks(): Generator<[link: RadialLink, index: number], void, void> {
		if (!this.radialLink) return
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let link: RadialLink | null = this.radialLink
		let i = 0

		do {
			if (!link) throw new InvalidRadialLinkError()
			yield [link, i++]
		} while ((link = link.next) != this.radialLink)
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

export interface Link {
	next: Link | null
	prev: Link | null
}

export class Loop2 implements Link {
	vertex: Vertex2
	edge: Edge2
	face: Face2
	next: Loop2 | null
	prev: Loop2 | null
	radialLink: RadialLink

	// BM_loop_create
	constructor(
		mesh: BMesh2,
		face: Face2,
		vertex: Vertex2,
		edge: Edge2,
		next: Loop2 | null = null,
		prev: Loop2 | null = null,
	) {
		this.vertex = vertex
		this.edge = edge
		this.face = face
		this.next = next
		this.prev = prev
		this.radialLink = edge.addLoop(this)

		mesh.addLoop(this)
	}

	/**
	 * Iterate all the Loops of the current radial loop (the current face, the
	 * current circular linked list).
	 */
	*radial(forward = true, check = true): Generator<[loop: Loop2, index: number], void, void> {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let loop: Loop2 | null = this
		let i = 0

		do {
			if (!loop) throw new InvalidLoopError()
			yield [loop, i++]
		} while ((loop = forward ? loop.next : loop.prev) != this && (check || (!check && loop)))
	}

	/**
	 * Iterate all the Loops of the current radial loop (the current face, the
	 * current circular linked list) in reverse.
	 */
	*radialReverse(check = true): Generator<[loop: Loop2, index: number], void, void> {
		yield* this.radial(false, check)
	}

	verticesMatch(vertices: Vertex2[], check = true, forward = true): boolean {
		let l
		let i = 0
		for ([l, i] of this.radial(forward, check)) if (l.vertex !== vertices[i]) return false
		return i + 1 === vertices.length
	}

	verticesMatchReverse(vertices: Vertex2[], check = true): boolean {
		return this.verticesMatch(vertices, check, false)
	}
}

export class InvalidLoopError extends Error {
	constructor() {
		super('Invalid loop detected. Loops should form a circular linked list.')
	}
}

export class InvalidRadialLinkError extends Error {
	constructor() {
		super('Invalid RadialLink loop detected. RadialLinks should form a circular linked list.')
	}
}

/**
 * - Monday: setup new computer (yay, finally something decent)
 *   - compiled blender to get intellisense and type checking working in blender source for easy navigation and learning.
 *   - exploring blender bmesh source
 *   - started working on bmesh2 in JS
 * - Tuesday: got creation ops basically done, should be enough to create a mesh
 * - Wed: create mesh, render it, replicate the edge iteration demo
 * - Thurs: finish edge iteration, make radial loop (face) iteration
 */
