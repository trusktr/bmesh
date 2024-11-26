import { BMesh2 } from './BMesh2.js'

export abstract class BMeshElement {
	readonly mesh: BMesh2

	constructor(mesh: BMesh2) {
		this.mesh = mesh
	}

	/** All mesh elements have a remove method with varying implementation. */
	abstract remove(): void
}
