import * as THREE from 'three';
export declare class DynLineMesh extends THREE.LineSegments {
    _defaultColor: number;
    _cnt: number;
    _verts: never[];
    _color: never[];
    _config: never[];
    _dirty: boolean;
    constructor(initSize?: number, customLineMaterial?: null);
    reset(): this;
    addPoint(p0: any, p1: any, color0?: number, color1?: number | null, isDash?: boolean): this;
    box(v0: any, v1: any, col?: number, is_dash?: boolean): this;
    _updateGeometry(): void;
}
export default DynLineMesh;
