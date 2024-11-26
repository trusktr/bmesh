import { BMesh2 } from './BMesh2.js'
import { BMeshElement } from './BMeshElement.js'
import { EdgeLink } from './Edge2.js'

export class Vertex2 extends BMeshElement {
	x: number
	y: number
	z: number

	/**
	 * A circular linked list of edges that are connected to this vertex.
	 * Do not modify this directly, use the Edge constructor.
	 */
	readonly edgeLink: EdgeLink | null = null

	/**
	 * The number of edges that share this vertex.
	 * Do not modify this directly, use the Edge constructor.
	 */
	readonly edgeCount = 0

	// BM_vert_create
	constructor(mesh: BMesh2, x = 0, y = 0, z = 0) {
		super(mesh)

		this.x = x
		this.y = y
		this.z = z

		mesh.addVertex(this)
	}

	toArray(): [number, number, number] {
		return [this.x, this.y, this.z]
	}

	*edgeLinks(forward = true, check = true): Generator<[link: EdgeLink, index: number], void, void> {
		if (!this.edgeLink) return

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let link: EdgeLink | null = this.edgeLink
		let next: EdgeLink | null
		let prev: EdgeLink | null
		// let nextPrev: EdgeLink | null
		// let prevNext: EdgeLink | null
		let i = 0

		do {
			if (!link) throw new InvalidEdgeLinkError()

			// handle deleting during iteration
			next = link.next
			prev = link.prev
			// nextPrev = next?.prev
			// prevNext = prev?.next

			yield [link, i++]
		} while ((link = forward ? next : prev) != this.edgeLink && (check || (!check && link)))
	}

	// BM_vert_kill
	/** Remove this vertex from the mesh, also removing any connected edges, faces, and loops. */
	remove(): void {
		for (const [link] of [...this.edgeLinks()]) {
			// for (const [link] of this.edgeLinks(true, false)) {
			console.log(' ---- remove edge link (remove edge)')
			link.edge.remove()
		}

		// TODO remove vertex from mesh
		this.mesh.vertices.delete(this)
	}
}

export class InvalidEdgeLinkError extends Error {
	constructor() {
		super('Invalid EdgeLink loop detected. EdgeLinks should form a circular linked list.')
	}
}
