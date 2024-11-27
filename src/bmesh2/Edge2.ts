import { BMesh2 } from './BMesh2.js'
import { Link, NonCircularError } from './Link.js'
import { Vertex2 } from './Vertex2.js'
import { RadialLoopLink } from './Face2.js'
import { BMeshElement } from './BMeshElement.js'

export class EdgeLink extends Link() {
	override next: EdgeLink = this
	override prev: EdgeLink = this
	override circular = true
	readonly edge: Edge2

	constructor(edge: Edge2) {
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
export class Edge2 extends BMeshElement {
	/** The first vertex of this edge (order independent). */
	readonly vertexA: Vertex2

	/** The second vertex of this edge (order independent). */
	readonly vertexB: Vertex2

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
	readonly edgeLinkA!: EdgeLink

	/** A circular linked list of edges connected to vertexB. */
	readonly edgeLinkB!: EdgeLink

	// BM_edge_create
	constructor(mesh: BMesh2, vertA: Vertex2, vertB: Vertex2) {
		super(mesh)

		this.vertexA = vertA
		this.vertexB = vertB

		// avoid duplicate edges
		const edge = BMesh2.existingEdge(vertA, vertB)
		if (edge) return edge

		this.edgeLinkA = this.#associateVert(vertA)
		this.edgeLinkB = this.#associateVert(vertB)

		mesh.addEdge(this)
	}

	/**
	 * Add an edge to the linked list of edges connected to this vertex.
	 */
	#associateVert(vert: Vertex2): EdgeLink {
		const link = new EdgeLink(this)

		// @ts-expect-error internal write of edgeLink
		if (!vert.edgeLink) vert.edgeLink = link.next = link.prev = link

		const last = vert.edgeLink.prev!
		last.next = link
		link.prev = last
		link.next = vert.edgeLink
		vert.edgeLink.prev = link

		// @ts-expect-error internal write of edgeCount
		vert.edgeCount++

		return link
	}

	hasVertex(vertex: Vertex2): boolean {
		return this.vertexA === vertex || this.vertexB === vertex
	}

	otherVertex(vertex: Vertex2): Vertex2 {
		if (this.vertexA === vertex) return this.vertexB
		if (this.vertexB === vertex) return this.vertexA
		throw new TypeError('vertex is not from this edge')
	}

	nextEdgeLink(vertex: Vertex2, forward = true): EdgeLink {
		let next: EdgeLink | undefined | null = undefined
		if (vertex === this.vertexA) next = forward ? this.edgeLinkA.next : this.edgeLinkA.prev
		if (vertex === this.vertexB) next = forward ? this.edgeLinkB.next : this.edgeLinkB.prev
		if (next === undefined) throw new TypeError('vertex is not from this edge')
		if (!next) throw new NonCircularError()
		return next
	}

	prevEdgeLink(vertex: Vertex2): EdgeLink {
		return this.nextEdgeLink(vertex, false)
	}

	// BM_edge_kill
	/** Remove this edge from the mesh, also removing any faces and loops. */
	remove(): void {
		for (const [link] of [...(this.radialLink ?? [])]) link.loop.face.remove()

		let isLastRemainingEdge = this.edgeLinkA.next === this.edgeLinkA
		let { next: nextLink, prev: prevLink } = this.edgeLinkA
		this.edgeLinkA.unlink()
		// @ts-expect-error internal write of edgeLink
		if (isLastRemainingEdge) this.vertexA.edgeLink = null
		// @ts-expect-error internal write of edgeLink
		else if (this.vertexA.edgeLink === this.edgeLinkA) this.vertexA.edgeLink = nextLink ?? prevLink
		// @ts-expect-error internal write of edgeCount
		this.vertexA.edgeCount--

		isLastRemainingEdge = this.edgeLinkB.next === this.edgeLinkB
		;({ next: nextLink, prev: prevLink } = this.edgeLinkB)
		this.edgeLinkB.unlink()
		// @ts-expect-error internal write of edgeLink
		if (isLastRemainingEdge) this.vertexB.edgeLink = null
		// @ts-expect-error internal write of edgeLink
		else if (this.vertexB.edgeLink === this.edgeLinkB) this.vertexB.edgeLink = nextLink ?? prevLink
		// @ts-expect-error internal write of edgeCount
		this.vertexB.edgeCount--

		this.mesh.edges.delete(this)
	}
}
