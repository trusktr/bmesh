import { BMesh } from './BMesh.js'
import { Link, NonCircularError } from './Link.js'
import { Vertex } from './Vertex.js'
import { Face, RadialLoopLink } from './Face.js'
import { BMeshElement } from './BMeshElement.js'
import { Loop } from './Loop.js'

/** A circular linked list of edges connected to a vertex. */
export class DiskLink extends Link() {
	override next: DiskLink = this
	override prev: DiskLink = this
	override circular = true

	edge: Edge

	constructor(edge: Edge) {
		super()
		this.edge = edge
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
export class Edge extends BMeshElement {
	/** The first vertex of this edge (order independent). */
	vertexA: Vertex

	/** The second vertex of this edge (order independent). */
	vertexB: Vertex

	/**
	 * A circular linked list of Loops, one per face that share this edge (each
	 * linked item is a whole radial for a face, not the items of a single face
	 * radial). Unlike with face loops (the loops of a single radial), the order
	 * of these loops does not matter.
	 *
	 * Don't write this directly, use the Loop constructor.
	 */
	radialLink: RadialLoopLink | null = null

	/**
	 * The number of faces that share this edge (the number of radial loop links).
	 *
	 * Don't write this directly, use the Face constructor.
	 */
	faceCount = 0

	/** A circular linked list of edges connected to vertexA, starting with this Edge. */
	diskLinkA!: DiskLink

	/** A circular linked list of edges connected to vertexB, starting with this Edge. */
	diskLinkB!: DiskLink

	// BM_edge_create
	constructor(mesh: BMesh, vertA: Vertex, vertB: Vertex) {
		super(mesh)

		this.vertexA = vertA
		this.vertexB = vertB

		// avoid duplicate edges
		const edge = BMesh.existingEdge(vertA, vertB)
		if (edge) return edge

		this.diskLinkA = this.#associateVert(vertA)
		this.diskLinkB = this.#associateVert(vertB)

		mesh.edges.add(this)
	}

	/**
	 * Add an edge to the linked list of edges connected to this vertex.
	 */
	#associateVert(vert: Vertex): DiskLink {
		const link = new DiskLink(this)

		if (!vert.diskLink) vert.diskLink = link
		vert.diskLink.insertBefore(link)
		vert.edgeCount++

		return link
	}

	// bmesh_disk_edge_link_from_vert
	/**
	 * Returns the DiskLink that connects this edge to the given vertex.
	 */
	diskLink(vertex: Vertex): DiskLink {
		if (this.vertexA === vertex) return this.diskLinkA
		if (this.vertexB === vertex) return this.diskLinkB
		throw new InvalidVertexError()
	}

	// BM_vert_in_edge
	/**
	 * Returns true if the vertex is one of the two vertices of this edge.
	 */
	hasVertex(vertex: Vertex): boolean {
		return this.vertexA === vertex || this.vertexB === vertex
	}

	// BM_edge_other_vert
	/**
	 * Returns the other vertex of this edge, given one of the two vertices.
	 */
	otherVertex(vertex: Vertex): Vertex {
		if (this.vertexA === vertex) return this.vertexB
		if (this.vertexB === vertex) return this.vertexA
		throw new InvalidVertexError()
	}

	// bmesh_disk_edge_next
	/**
	 * Returns the next edge link in the circular linked list of edges connected
	 * to the given vertex.
	 */
	nextEdgeLink(vertex: Vertex, forward = true): DiskLink {
		let next: DiskLink | null = null
		if (vertex === this.vertexA) next = forward ? this.diskLinkA.next : this.diskLinkA.prev
		else if (vertex === this.vertexB) next = forward ? this.diskLinkB.next : this.diskLinkB.prev
		else throw new InvalidVertexError()
		if (!next) throw new NonCircularError()
		return next
	}

	// bmesh_disk_edge_prev
	/**
	 * Returns the previous edge link in the circular linked list of edges
	 * connected to the given vertex.
	 */
	prevEdgeLink(vertex: Vertex): DiskLink {
		return this.nextEdgeLink(vertex, false)
	}

	// bmesh_kernel_split_edge_make_vert
	/**
	 * Split this edge into two edges (one new edge) with a new vertex between
	 * them. Optionally provide the vertex to place in the middle.
	 *
	 * @param existingVert - The existing vertex that is on one end of the edge
	 * to split. The new Edge will be created between this vertex and the new
	 * vertex.
	 *
	 * @param newVert - The vertex to place in between the old edge and the new
	 * edge. If not provided, a new Vertex will be created, which will be located at
	 * the midpoint of the old edge.
	 *
	 * @returns A tuple of the new vertex and the new edge.
	 */
	split(existingVert: Vertex, newVert?: Vertex): [Vertex, Edge] {
		if (!this.hasVertex(existingVert)) throw new InvalidVertexError()

		newVert ??= new Vertex(
			this.mesh,
			(this.vertexA.x + this.vertexB.x) / 2,
			(this.vertexA.y + this.vertexB.y) / 2,
			(this.vertexA.z + this.vertexB.z) / 2,
		)

		/* order of new edge's verts should match this edge's verts
		 * (so extruded faces don't flip) */
		// TODO ^ verify this once we add normals
		const newEdge = new Edge(this.mesh, existingVert, newVert)
		newEdge.faceCount = this.faceCount

		// Order here matters
		this.#splitRadialLoops(existingVert, newEdge, newVert)
		this.#replaceVertex(existingVert, newVert)

		return [newVert, newEdge]
	}

	// this is equivalent of both bmesh_disk_edge_remove and bmesh_disk_edge_append
	/**
	 * Split the radial loops of this edge into two radial loops, one for the
	 * existing vertex and one for the new vertex.
	 */
	#splitRadialLoops(existingVert: Vertex, newEdge: Edge, newVert: Vertex): void {
		let lastNewLoop

		// (for each face)
		for (const { loop } of this.radialLink ?? []) {
			if (loop.vertex === existingVert) {
				// the existing loop is going from existingVert to otherVertex

				loop.vertex = newVert
				const newLoop = new Loop(loop.face, existingVert, newEdge)
				loop.insertBefore(newLoop)
				if (!newEdge.radialLink) newEdge.radialLink = newLoop.radialLink
				if (lastNewLoop) lastNewLoop.radialLink.insertAfter(newLoop.radialLink)
				lastNewLoop = newLoop
			} else if (loop.vertex === this.otherVertex(existingVert)) {
				// the existing loop is going from otherVertex to existingVert

				const newLoop = new Loop(loop.face, newVert, newEdge)
				loop.insertAfter(newLoop)
				if (!newEdge.radialLink) newEdge.radialLink = newLoop.radialLink
				if (lastNewLoop) lastNewLoop.radialLink.insertAfter(newLoop.radialLink)
				lastNewLoop = newLoop
			} else throw new TypeError('loop vertex is not from this edge')

			loop.face.edgeCount++
		}

		console.log('INCREMENTING FACE EDGE COUNT', lastNewLoop!.face.edgeCount, lastNewLoop!.face.edgeCount + 1)
		console.log('INCREMENTED FACE EDGE COUNT', lastNewLoop!.face.edgeCount)
	}

	// bmesh_disk_vert_replace
	/**
	 * Replace one vertex of this edge with another vertex.
	 */
	#replaceVertex(existingVert: Vertex, newVert: Vertex): void {
		// Remove the edge from the old vertex's disk linked list.
		const diskLink = this.diskLink(existingVert)
		this.#removeEdgeLink(diskLink, existingVert)

		// Not needed because the new vertex is already associated with the new Edge in split().
		// if (!existingVert.diskLink) existingVert.diskLink = newEdge.#diskLink(existingVert)

		// Add the edge to the new vertex's disk linked list.
		// TODO consolidate this with #associateVert
		if (!newVert.diskLink) newVert.diskLink = diskLink
		newVert.diskLink.insertBefore(diskLink)
		newVert.edgeCount++

		if (this.vertexA === existingVert) this.vertexA = newVert
		else if (this.vertexB === existingVert) this.vertexB = newVert
		else throw new InvalidVertexError()
	}

	/**
	 * Extrude this edge by duplicating it and moving the vertices in the given direction. It will
	 * create two new vertices, three new edges, and a new face.
	 *
	 * @returns The new edge that is parallel to this edge, typically the edge
	 * that will be the new selection and will be translated by the user.
	 */
	extrude(x = 0, y = 0, z = 0): Edge {
		const newVertA = new Vertex(this.mesh, this.vertexA.x + x, this.vertexA.y + y, this.vertexA.z + z)
		const newEdgeA = new Edge(this.mesh, this.vertexA, newVertA)

		const newVertB = new Vertex(this.mesh, this.vertexB.x + x, this.vertexB.y + y, this.vertexB.z + z)
		const newEdgeB = new Edge(this.mesh, this.vertexB, newVertB)

		const newParallelEdge = new Edge(this.mesh, newVertA, newVertB)

		// TODO Ensure the same normal direction (winding) to match adjacent faces once we add normals.
		new Face(this.mesh, [this.vertexA, this.vertexB, newVertB, newVertA], [this, newEdgeB, newParallelEdge, newEdgeA])

		// debugger

		return newParallelEdge
	}

	// BM_edge_kill
	/**
	 * Remove this edge from the mesh, also removing any faces and loops.
	 */
	remove(): void {
		for (const link of [...(this.radialLink ?? [])]) link.loop.face.remove()

		this.#removeEdgeLink(this.diskLinkA, this.vertexA)
		this.#removeEdgeLink(this.diskLinkB, this.vertexB)

		this.mesh.edges.delete(this)
	}

	// bmesh_disk_edge_remove
	/**
	 * Remove an edge from the linked list of edges connected to a vertex.
	 */
	#removeEdgeLink(diskLink: DiskLink, vertex: Vertex): void {
		const isLastRemainingEdge = diskLink.next === diskLink
		const { next: nextLink, prev: prevLink } = diskLink
		diskLink.unlink()
		if (isLastRemainingEdge) vertex.diskLink = null
		else if (vertex.diskLink === diskLink) vertex.diskLink = nextLink ?? prevLink
		vertex.edgeCount--
	}
}

export class InvalidVertexError extends Error {
	constructor() {
		super('vertex is not from this edge')
	}
}
