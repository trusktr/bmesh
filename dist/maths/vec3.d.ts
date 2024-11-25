type TVec3 = Array<number>;
export declare class vec3 {
    static len(a: TVec3): number;
    static dot(a: TVec3, b: TVec3): number;
    static add(a: TVec3, b: TVec3, out?: TVec3): TVec3;
    static sub(a: TVec3, b: TVec3, out?: TVec3): TVec3;
    static scale(a: TVec3, s: number, out?: TVec3): TVec3;
    static scaleThenAdd(v: TVec3, s: number, add: TVec3, out?: TVec3): TVec3;
    static norm(a: TVec3, out?: TVec3): TVec3;
    static cross(a: TVec3, b: TVec3, out?: TVec3): TVec3;
    static avg(...vecs: TVec3[]): TVec3;
}
export default vec3;
