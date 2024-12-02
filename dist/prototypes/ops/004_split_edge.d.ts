import { type PerspectiveCamera, Vector3 } from 'three';
/**
 * Move a point in world space parallel to the display screen (perpendicular
 * to the camera's direction). Basic version, not accounting for scene
 * resolution.
 */
export declare function movePointParallelScreen(camera: PerspectiveCamera, position: Vector3, moveX: number, moveY: number): void;
