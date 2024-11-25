export class vec3 {
    // #region GETTERS
    static len(a) { return Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2); }
    static dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
    // #endregion
    // #region OPS
    static add(a, b, out = [0, 0, 0]) {
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        out[2] = a[2] + b[2];
        return out;
    }
    static sub(a, b, out = [0, 0, 0]) {
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        out[2] = a[2] - b[2];
        return out;
    }
    static scale(a, s, out = [0, 0, 0]) {
        out[0] = a[0] * s;
        out[1] = a[1] * s;
        out[2] = a[2] * s;
        return out;
    }
    static scaleThenAdd(v, s, add, out = [0, 0, 0]) {
        out[0] = v[0] * s + add[0];
        out[1] = v[1] * s + add[1];
        out[2] = v[2] * s + add[2];
        return out;
    }
    static norm(a, out = [0, 0, 0]) {
        let mag = Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2);
        if (mag != 0) {
            mag = 1 / mag;
            out[0] = a[0] * mag;
            out[1] = a[1] * mag;
            out[2] = a[2] * mag;
        }
        return out;
    }
    static cross(a, b, out = [0, 0, 0]) {
        const ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2];
        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;
        return out;
    }
    static avg(...vecs) {
        let x = 0;
        let y = 0;
        let z = 0;
        let cnt = 0;
        // "loop D loop jigga whaaaaa"
        for (const v of vecs) {
            x += v[0];
            y += v[1];
            z += v[2];
            cnt++;
        }
        x /= cnt;
        y /= cnt;
        z /= cnt;
        return [x, y, z];
    }
}
export default vec3;
