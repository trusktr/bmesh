import { Edge2 } from './Edge2.js'
import { Face2 } from './Face2.js'
import { Vertex2 } from './Vertex2.js'

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

	// BM_edges_from_verts_ensure
	edgesFromVerts(...vertices: Vertex2[]): Edge2[] {
		const edges: Edge2[] = []

		// ensure no duplicate vertices
		if (vertices.length !== new Set(vertices).size) throw new TypeError('duplicate vertices not allowed')

		for (const [i, vertex] of vertices.entries()) {
			const next = vertices[(i + 1) % vertices.length]!
			const edge = BMesh2.existingEdge(vertex, next) ?? new Edge2(this, vertex, next)
			edges.push(edge)
		}

		return edges
	}

	// BM_face_exists
	/** Returns the face that exists between the given vertices, or null if none. */
	static existingFace(vertices: Vertex2[]): Face2 | null {
		if (!vertices[0]) return null

		for (const [edgeLink] of vertices[0].edgeLink ?? []) {
			for (const [radialLink] of edgeLink.edge.radialLink ?? []) {
				// check both directions, as we don't know which order `vertices` is in
				if (radialLink.loop.verticesMatch(vertices, false)) return radialLink.loop.face
				if (radialLink.loop.verticesMatchReverse(vertices, false)) return radialLink.loop.face
			}
		}

		return null
	}

	// BM_edge_exists
	/** Returns the edge that exists between two vertices, or null if none. */
	static existingEdge(vertA: Vertex2, vertB: Vertex2): Edge2 | null {
		if (vertA === vertB) throw new TypeError('edge vertices must be different')

		if (!vertA.edgeLink || !vertB.edgeLink) return null

		// Iterate over the smaller set of edges.
		const edgeLink = vertA.edgeCount < vertB.edgeCount ? vertA.edgeLink : vertB.edgeLink

		for (const [link] of edgeLink) //
			if (link.edge.hasVertex(vertA) && link.edge.hasVertex(vertB)) return link.edge

		return null
	}

	// bmesh_loop_validate
	/** Returns true if a loop is valid, false otherwise. */
	static validateLoop(face: Face2): Error | null {
		if (!face.loop) return new Error('face has no loop')

		const segments = Array.from(face.loop.links())
		if (segments.length !== face.edgeCount) return new Error('face length does not match loop length')

		for (const [loop, i] of segments) {
			const nextLoop = segments[(i + 1) % face.edgeCount]![0]
			if (nextLoop.prev !== loop) return new Error('reverse loop does not match forward loop')
			if (loop.face !== nextLoop.face) return new Error('each loop must belong to the same face')
			if (loop.edge === nextLoop.edge) return new Error('each loop must have a different edge')
			if (loop.vertex === nextLoop.vertex) return new Error('each loop must have a different vertex')
		}

		return null
	}
}
