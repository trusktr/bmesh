import type Vertex from './Vertex.js';
import type Edge from './Edge.js';
import type Face from './Face.js';
export declare class Loop {
    vert: Vertex;
    edge: Edge;
    face: Face;
    radial_prev: Loop;
    radial_next: Loop;
    next: Loop;
    prev: Loop;
    iterNext(): {
        [Symbol.iterator](): {
            next: () => {
                value?: Loop;
                done: boolean;
            };
        };
    };
    loop(): Generator<Loop, void, unknown>;
}
export default Loop;
