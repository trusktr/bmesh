import { BMesh } from './BMesh.js'

export abstract class BMeshElement {
	readonly mesh: BMesh

	constructor(mesh: BMesh) {
		this.mesh = mesh
	}

	/** All mesh elements have a remove method with varying implementation. */
	abstract remove(): void
}
