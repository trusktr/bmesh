import { BMesh2 } from './BMesh2.js';
export declare abstract class BMeshElement {
    readonly mesh: BMesh2;
    constructor(mesh: BMesh2);
    /** All mesh elements have a remove method with varying implementation. */
    abstract remove(): void;
}
