/*
https://github.com/blender/blender/blob/48e60dcbffd86f3778ce75ab67f95461ffbe319c/source/blender/bmesh/bmesh_class.h#L90
typedef struct BMVert {
    BMHeader head;
    float co[3]; // vertex coordinates
    float no[3]; // vertex normal

    * Pointer to (any) edge using this vertex (for disk cycles).
    *
    * \note Some higher level functions set this to different edges that use this vertex,
    * which is a bit of an abuse of internal #BMesh data but also works OK for now
    * (use with care!).
    struct BMEdge *e;
} BMVert;
*/
export class Vertex {
    // #region MAIN
    id = window.crypto.randomUUID();
    pos = [0, 0, 0];
    edge = null; // Reference to first edge using this vert as an origin.
    constructor(v) {
        if (v)
            this.setPos(v);
    }
    // #endregion
    // #region SETTERS
    setPos(v) {
        this.pos[0] = v[0];
        this.pos[1] = v[1];
        this.pos[2] = v[2];
        return this;
    }
}
export default Vertex;
