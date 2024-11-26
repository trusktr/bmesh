import type Edge from './Edge.js';
export declare class Vertex {
    id: string;
    pos: Array<number>;
    edge: Edge | null;
    constructor(v?: Array<number>);
    setPos(v: Array<number>): this;
}
export default Vertex;
