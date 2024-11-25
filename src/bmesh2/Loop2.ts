import { BMesh2 } from './BMesh2'
import { Edge2 } from './Edge2'
import { Face2, RadialLink } from './Face2'
import { Link } from './Link'
import { Vertex2 } from './Vertex2'

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
