import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
export { THREE };
/** @typedef {ReturnType<typeof useThreeWebGL2>} App */
export declare function useDarkScene(/** @type {App} */ tjs: any, props?: {}): any;
export declare function useVisualDebug(/** @type {App} */ tjs: any, customLineMaterial?: null): Promise<{
    ln: import("./meshes/DynLineMesh.js").DynLineMesh;
    pnt: import("./meshes/ShapePointsMesh.js").ShapePointsMesh;
    reset(): void;
}>;
export default function useThreeWebGL2(props?: {}): {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    camCtrl: OrbitControls;
    render: (onPreRender?: null, onPostRender?: null) => any;
    renderLoop: () => any;
    createRenderLoop: (fnPreRender?: null, fnPostRender?: null) => {
        stop: () => void;
        start: () => void;
    };
    sphericalLook: (lon: any, lat: any, radius: any, target?: null) => any;
    resize: (w?: number, h?: number) => any;
    version: () => string;
};
