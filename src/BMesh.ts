/**
 * This is a port of Blender's BMesh data structure to JavaScript, but without
 * anything specific to rendering such as normals or material indices. Maybe
 * we'll add normals later if it would be useful for JS 3D engines like Threejs
 * or PlayCanvas to copy them from a bmesh, but for now they can generate their
 * own.
 */

import { Edge } from './Edge.js'
import { Face } from './Face.js'
import type { Loop } from './Loop.js'
import { Vertex } from './Vertex.js'

/**
 * A BMesh is a collection of vertices, edges connecting vertices, and faces
 * defined by edges going in a loop.
 */
export class BMesh {
	vertices: Set<Vertex> = new Set()
	edges: Set<Edge> = new Set()
	faces: Set<Face> = new Set()

	// BM_edges_from_verts_ensure
	edgesFromVerts(...vertices: Vertex[]): Edge[] {
		const edges: Edge[] = []

		// ensure no duplicate vertices
		if (vertices.length !== new Set(vertices).size) throw new TypeError('duplicate vertices not allowed')

		for (const [i, vertex] of vertices.entries()) {
			const next = vertices[(i + 1) % vertices.length]!
			const edge = BMesh.existingEdge(vertex, next) ?? new Edge(this, vertex, next)
			edges.push(edge)
		}

		return edges
	}

	// BM_face_exists
	/**
	 * Returns the face that exists between the given vertices, or null if none.
	 */
	static existingFace(vertices: Vertex[]): Face | null {
		if (!vertices[0]) return null

		for (const diskLink of vertices[0].diskLink ?? []) {
			for (const radialLink of diskLink.edge.radialLink ?? []) {
				// check both directions, as we don't know which order `vertices` is in
				if (radialLink.loop.verticesMatch(vertices, false)) return radialLink.loop.face
				if (radialLink.loop.verticesMatchReverse(vertices, false)) return radialLink.loop.face
			}
		}

		return null
	}

	// BM_edge_exists
	/**
	 * Returns the edge that exists between two vertices, or null if none.
	 */
	static existingEdge(vertA: Vertex, vertB: Vertex): Edge | null {
		if (vertA === vertB) throw new TypeError('edge vertices must be different')

		if (!vertA.diskLink || !vertB.diskLink) return null

		// Iterate over the smaller set of edges.
		const diskLink = vertA.edgeCount < vertB.edgeCount ? vertA.diskLink : vertB.diskLink

		for (const link of diskLink) //
			if (link.edge.hasVertex(vertA) && link.edge.hasVertex(vertB)) return link.edge

		return null
	}

	// bmesh_loop_validate
	/**
	 * Returns an error if the loop is invalid, or null if it is valid.
	 */
	static validateLoop(face: Face): Error | null {
		if (!face.loop) return new Error('face has no loop')

		try {
			const loops = [...face.loop]
			if (loops.length !== face.edgeCount)
				return new Error('face length does not match loop length: ' + loops.length + ' !== ' + face.edgeCount)

			let i = 0

			for (const loop of loops) {
				const nextLoop = loops[(i + 1) % face.edgeCount]!

				if (nextLoop.prev !== loop) return new Error('reverse loop does not match forward loop')
				if (loop.face !== face) return new Error('each loop must belong to the same face')
				if (loop.edge === nextLoop.edge) return new Error('each loop must have a different edge')
				if (loop.vertex === nextLoop.vertex) return new Error('each loop must have a different vertex')
				if (!(loop.edge.hasVertex(loop.vertex) && loop.edge.hasVertex(nextLoop.vertex)))
					return new Error('each loop edge should have the vertex of the loop and the next loop')

				i++
			}
		} catch (err) {
			return err instanceof Error ? err : new Error('unknown error: ' + String(err))
		}

		return null
	}

	// bmesh_radial_validate
	/**
	 * Returns an error if the radial loop is invalid, or null if it is valid.
	 */
	static validateRadial(loop: Loop): Error | null {
		if (!loop.radialLink) return new Error('loop has no radial link')

		try {
			const links = [...loop.radialLink]
			if (links.length !== loop.edge.faceCount)
				return new Error(
					'radial link length does not match face count: ' + links.length + ' !== ' + loop.edge.faceCount,
				)

			let i = 0

			for (const link of links) {
				const nextLink = links[(i + 1) % loop.edge.faceCount]!

				if (nextLink.prev !== link) return new Error('reverse link does not match forward link')
				// If length is 1, then the loop is also the next loop, skip comparing them.
				if (links.length !== 1 && link.loop === nextLink.loop)
					return new Error('each link must belong to a different loop')
				if (link.loop.edge !== nextLink.loop.edge) return new Error('each link loop must have the same edge')
				if (!loop.edge.hasVertex(link.loop.vertex))
					return new Error('each link loop edge should have the vertex of the link and the next link')

				i++
			}
		} catch (err) {
			return err instanceof Error ? err : new Error('unknown error: ' + String(err))
		}

		return null
	}

	// bmesh_disk_validate
	/**
	 * Returns an error if the disk link is invalid, or null if it is valid. If
	 * an edge is provided, it will check if the disk includes the edge.
	 */
	static validateDisk(vertex: Vertex, edge: Edge | null = null): Error | null {
		if (!vertex.diskLink) {
			if (vertex.edgeCount) throw new Error('vertex has no disk link but edge count is not 0')
			return null
		}

		let includesEdge = false

		try {
			const links = [...vertex.diskLink]
			if (links.length !== vertex.edgeCount)
				return new Error('disk link length does not match edge count: ' + links.length + ' !== ' + vertex.edgeCount)

			let i = 0

			for (const link of links) {
				const nextLink = links[(i + 1) % vertex.edgeCount]!

				if (nextLink.prev !== link) return new Error('reverse link does not match forward link')
				if (links.length !== 1 && link.edge === nextLink.edge) return new Error('each link must have a different edge')
				if (!link.edge.hasVertex(vertex))
					return new Error('each link edge should have the vertex of the link and the next link')

				if (edge && link.edge === edge) includesEdge = true

				i++
			}
		} catch (err) {
			return err instanceof Error ? err : new Error('unknown error: ' + String(err))
		}

		if (edge && !includesEdge) return new Error('disk link does not include edge')

		return null
	}
}
