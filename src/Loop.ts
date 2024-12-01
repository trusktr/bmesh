import { Edge } from './Edge.js'
import { Face, RadialLoopLink } from './Face.js'
import { Link } from './Link.js'
import { Vertex } from './Vertex.js'

/**
 * A circular linked list of Loops that go around a Face, useful for traversing
 * the Edges of a Face.
 */
export class Loop extends Link() {
	override next: Loop = this
	override prev: Loop = this
	override circular = true

	vertex: Vertex
	edge: Edge
	face: Face

	/** A circular linked list of Loops that share the same Edge. This Link contains this Loop. */
	radialLink = new RadialLoopLink(this)

	/** Do not use this constructor directly, use Vertex, Edge, and Face constructors. */
	constructor(face: Face, vertex: Vertex, edge: Edge) {
		super()

		this.vertex = vertex
		this.edge = edge
		this.face = face
	}

	/**
	 * Returns true if the vertices match the loop, false otherwise.
	 */
	verticesMatch(vertices: Vertex[], checkCircular = true, forward = true): boolean {
		let l
		let i = 0
		for (l of this.iterator(forward, checkCircular)) if (l.vertex !== vertices[i++]) return false
		return i === vertices.length
	}

	/**
	 * Returns true if the vertices in reverse match the loop, false otherwise.
	 */
	verticesMatchReverse(vertices: Vertex[], check = true): boolean {
		return this.verticesMatch(vertices, check, false)
	}
}
