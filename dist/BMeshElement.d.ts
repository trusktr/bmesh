import { BMesh } from './BMesh.js';
export declare abstract class BMeshElement {
    readonly mesh: BMesh;
    constructor(mesh: BMesh);
    /** All mesh elements have a remove method with varying implementation. */
    abstract remove(): void;
}
