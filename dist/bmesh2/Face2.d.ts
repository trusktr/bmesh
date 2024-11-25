import { BMesh2 } from './BMesh2.js';
import { Loop2 } from './Loop2.js';
import { Edge2 } from './Edge2.js';
import { Link } from './Link.js';
import { Vertex2 } from './Vertex2.js';
export declare class RadialLink extends Link {
    next: RadialLink | null;
    prev: RadialLink | null;
    readonly loop: Loop2;
    constructor(loop: Loop2);
}
export declare class Face2 {
    #private;
    loop: Loop2;
    length: number;
    constructor(mesh: BMesh2, vertices: Vertex2[], edges: Edge2[]);
}
