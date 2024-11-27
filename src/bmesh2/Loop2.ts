import { Edge2 } from './Edge2.js'
import { Face2, RadialLoopLink } from './Face2.js'
import { Link } from './Link.js'
import { Vertex2 } from './Vertex2.js'

export class Loop2 extends Link() {
	override next: Loop2 = this
	override prev: Loop2 = this
	override circular = true
	readonly vertex: Vertex2
	readonly edge: Edge2
	readonly face: Face2

	/** A circular linked list of Loops that share the same edge. This Link contains this Loop. */
	readonly radialLink = new RadialLoopLink(this)

	/** Do not use this constructor directly, use Vertex, Edge, and Face constructors. */
	constructor(face: Face2, vertex: Vertex2, edge: Edge2) {
		super()

		this.vertex = vertex
		this.edge = edge
		this.face = face
	}

	verticesMatch(vertices: Vertex2[], check = true, forward = true): boolean {
		let l
		let i = 0
		for ([l, i] of this.links(forward, check)) if (l.vertex !== vertices[i]) return false
		return i + 1 === vertices.length
	}

	verticesMatchReverse(vertices: Vertex2[], check = true): boolean {
		return this.verticesMatch(vertices, check, false)
	}
}
