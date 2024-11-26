import { Edge2 } from './Edge2.js'
import { Face2, RadialLoopLink } from './Face2.js'
import { Link } from './Link.js'
import { Vertex2 } from './Vertex2.js'

export class Loop2 extends Link() {
	override next: Loop2 | null
	override prev: Loop2 | null
	readonly vertex: Vertex2
	readonly edge: Edge2
	readonly face: Face2

	/** A circular linked list of Loops that share the same edge. This Link contains this Loop. */
	readonly radialLink = new RadialLoopLink(this)

	/** Do not use this constructor directly, use Vertex, Edge, and Face constructors. */
	constructor(face: Face2, vertex: Vertex2, edge: Edge2, next: Loop2 | null = null, prev: Loop2 | null = null) {
		super()

		this.vertex = vertex
		this.edge = edge
		this.face = face
		this.next = next
		this.prev = prev
	}

	/**
	 * Iterate all the Loops of the current radial loop (the current face, the
	 * current circular linked list).
	 */
	*radial(forward = true, check = true): Generator<[loop: Loop2, index: number], void, void> {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let link: Loop2 | null = this
		let i = 0

		do {
			if (!link) throw new InvalidLoopError()
			yield [link, i++]
		} while ((link = forward ? link.next : link.prev) != this && (check || (!check && link)))
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
