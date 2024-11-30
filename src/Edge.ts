import { BMesh } from './BMesh.js'
import { Link, NonCircularError } from './Link.js'
import { Vertex } from './Vertex.js'
import { RadialLoopLink } from './Face.js'
import { BMeshElement } from './BMeshElement.js'

/** A circular linked list of edges connected to a vertex. */
export class DiskLink extends Link() {
	override next: DiskLink = this
	override prev: DiskLink = this
	override circular = true
	readonly edge: Edge

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
	readonly vertexA: Vertex

	/** The second vertex of this edge (order independent). */
	readonly vertexB: Vertex

	/**
	 * A circular linked list of Loops, one per face that share this edge (each
	 * linked item is a whole radial for a face, not the items of a single face
	 * radial). Unlike with face loops (the loops of a single radial), the order
	 * of these loops does not matter.
	 *
	 * Don't write this directly, use the Loop constructor.
	 */
	readonly radialLink: RadialLoopLink | null = null

	/**
	 * The number of faces that share this edge (the number of radial loop links).
	 *
	 * Don't write this directly, use the Face constructor.
	 */
	readonly faceCount = 0

	/** A circular linked list of edges connected to vertexA. */
	readonly diskLinkA!: DiskLink

	/** A circular linked list of edges connected to vertexB. */
	readonly diskLinkB!: DiskLink

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

		mesh.addEdge(this)
	}

	/**
	 * Add an edge to the linked list of edges connected to this vertex.
	 */
	#associateVert(vert: Vertex): DiskLink {
		const link = new DiskLink(this)

		// @ts-expect-error internal write of diskLink
		if (!vert.diskLink) vert.diskLink = link.next = link.prev = link

		const last = vert.diskLink.prev!
		last.next = link
		link.prev = last
		link.next = vert.diskLink
		vert.diskLink.prev = link

		// @ts-expect-error internal write of edgeCount
		vert.edgeCount++

		return link
	}

	hasVertex(vertex: Vertex): boolean {
		return this.vertexA === vertex || this.vertexB === vertex
	}

	otherVertex(vertex: Vertex): Vertex {
		if (this.vertexA === vertex) return this.vertexB
		if (this.vertexB === vertex) return this.vertexA
		throw new TypeError('vertex is not from this edge')
	}

	nextEdgeLink(vertex: Vertex, forward = true): DiskLink {
		let next: DiskLink | undefined | null = undefined
		if (vertex === this.vertexA) next = forward ? this.diskLinkA.next : this.diskLinkA.prev
		if (vertex === this.vertexB) next = forward ? this.diskLinkB.next : this.diskLinkB.prev
		if (next === undefined) throw new TypeError('vertex is not from this edge')
		if (!next) throw new NonCircularError()
		return next
	}

	prevEdgeLink(vertex: Vertex): DiskLink {
		return this.nextEdgeLink(vertex, false)
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
	#removeEdgeLink(diskLink: DiskLink, vertex: Vertex): void {
		const isLastRemainingEdge = diskLink.next === diskLink
		const { next: nextLink, prev: prevLink } = diskLink
		diskLink.unlink()
		// @ts-expect-error internal write of diskLink
		if (isLastRemainingEdge) vertex.diskLink = null
		// @ts-expect-error internal write of diskLink
		else if (vertex.diskLink === diskLink) vertex.diskLink = nextLink ?? prevLink
		// @ts-expect-error internal write of edgeCount
		vertex.edgeCount--
	}
}
