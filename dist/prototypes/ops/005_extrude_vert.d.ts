import { type Edge, type Loop, type Vertex } from 'bmesh';
/**
 * Validates the current selection. Assume that the current `vert`, `edge`, and
 * `loop` are in sync (edge has vert, loop has edge, etc).
 */
export declare function validate(vert?: Vertex, loop?: Loop, edge?: Edge): void;
