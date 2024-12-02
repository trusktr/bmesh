import * as THREE from 'three';
export declare class ShapePointsMesh extends THREE.Points {
    _defaultShape: number;
    _defaultSize: number;
    _defaultColor: number;
    _defaultPerspective: boolean;
    _cnt: number;
    _verts: never[];
    _color: never[];
    _config: never[];
    _perspective: never[];
    _dirty: boolean;
    constructor(
    /** Do not add more points than maxSize (resize not implemented yet). */
    initSize?: number);
    reset(): this;
    addPoint(pos: any, color?: number, size?: number, shape?: number, perspective?: boolean): this;
    setColorAt(idx: any, color: any): this;
    setPosAt(idx: any, pos: any): this;
    getPosAt(idx: any): undefined[];
    setPerspectiveAt(/**@type {number}*/ idx: any, /**@type {boolean}*/ val: any): void;
    _updateGeometry(): void;
}
export default ShapePointsMesh;
