import { Vector3 } from 'three'
import { BMesh } from './BMesh.js'
import { BMeshElement } from './BMeshElement.js'
import { DiskLink } from './Edge.js'

export class Vertex extends BMeshElement {
	get x(): number {
		return this.position.x
	}
	set x(value: number) {
		this.position.x = value
	}

	get y(): number {
		return this.position.y
	}
	set y(value: number) {
		this.position.y = value
	}

	get z(): number {
		return this.position.z
	}
	set z(value: number) {
		this.position.z = value
	}

	position: Vector3 = new Vector3()

	/**
	 * A circular linked list of edges that are connected to this vertex.
	 * Do not modify this directly, use the Edge constructor.
	 */
	diskLink: DiskLink | null = null

	/**
	 * The number of edges that share this vertex.
	 * Do not modify this directly, use the Edge constructor.
	 */
	edgeCount = 0

	// BM_vert_create
	constructor(mesh: BMesh, x = 0, y = 0, z = 0) {
		super(mesh)

		this.x = x
		this.y = y
		this.z = z

		mesh.addVertex(this)
	}

	/**
	 * Returns a tuple of the Vertex's xyz values. Pass an array if you want to
	 * write to existing instead of new memory for performance.
	 */
	toArray(target: [number, number, number] = [this.x, this.y, this.z]): [number, number, number] {
		if (target) (target[0] = this.x), (target[1] = this.y), (target[2] = this.z)
		return target
	}

	// BM_vert_kill
	/**
	 * Remove this vertex from the mesh, also removing any connected edges, faces, and loops.
	 */
	remove(): void {
		for (const link of [...(this.diskLink ?? [])]) {
			console.log('link to remove:', link)
			link.edge.remove()
		}

		this.mesh.vertices.delete(this)
	}
}
