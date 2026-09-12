import { Vector2 } from "./Vector2";

/**
 * 3x3 Affine Transformation Matrix Module
 * 
 * Matrix Layout:
 * | a  c  e |
 * | b  d  f |
 * | 0  0  1 |
 * 
 * Where:
 * - a, d: scaling and rotation
 * - b, c: shearing and rotation
 * - e, f: translation (tx, ty)
 */
export class Matrix2D {
  public a: number;
  public b: number;
  public c: number;
  public d: number;
  public e: number;
  public f: number;

  constructor(
    a: number = 1,
    b: number = 0,
    c: number = 0,
    d: number = 1,
    e: number = 0,
    f: number = 0,
  ) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
  }

  public static identity(): Matrix2D {
    return new Matrix2D(1, 0, 0, 1, 0, 0);
  }

  public static translation(tx: number, ty: number): Matrix2D {
    return new Matrix2D(1, 0, 0, 1, tx, ty);
  }

  public static rotation(angleRad: number): Matrix2D {
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return new Matrix2D(cos, sin, -sin, cos, 0, 0);
  }

  public static scaling(sx: number, sy: number): Matrix2D {
    return new Matrix2D(sx, 0, 0, sy, 0, 0);
  }

  /**
   * Creates a TRS (Translation-Rotation-Scale) Matrix around a origin/pivot
   */
  public static createTRS(
    x: number,
    y: number,
    rotationDeg: number = 0,
    scaleX: number = 1,
    scaleY: number = 1,
    originX: number = 0,
    originY: number = 0,
  ): Matrix2D {
    const rad = (rotationDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Matrix M = T(x, y) * R(rot) * S(scaleX, scaleY) * T(-originX, -originY)
    const a = cos * scaleX;
    const b = sin * scaleX;
    const c = -sin * scaleY;
    const d = cos * scaleY;

    const e = x - (a * originX + c * originY);
    const f = y - (b * originX + d * originY);

    return new Matrix2D(a, b, c, d, e, f);
  }

  /**
   * Multiplies matrix A by matrix B (Result = A * B)
   */
  public multiply(m: Matrix2D): Matrix2D {
    return new Matrix2D(
      this.a * m.a + this.c * m.b,
      this.b * m.a + this.d * m.b,
      this.a * m.c + this.c * m.d,
      this.b * m.c + this.d * m.d,
      this.a * m.e + this.c * m.f + this.e,
      this.b * m.e + this.d * m.f + this.f,
    );
  }

  /**
   * Computes Inverse Transformation Matrix M^-1
   */
  public invert(): Matrix2D | null {
    const det = this.a * this.d - this.b * this.c;
    if (Math.abs(det) < 1e-10) {
      return null; // Matrix non-invertible
    }

    const invDet = 1.0 / det;

    return new Matrix2D(
      this.d * invDet,
      -this.b * invDet,
      -this.c * invDet,
      this.a * invDet,
      (this.c * this.f - this.d * this.e) * invDet,
      (this.b * this.e - this.a * this.f) * invDet,
    );
  }

  /**
   * Transforms a 2D Vector Point using this Affine Matrix: P_out = M * P_in
   */
  public transformPoint(p: Vector2): Vector2 {
    return new Vector2(
      this.a * p.x + this.c * p.y + this.e,
      this.b * p.x + this.d * p.y + this.f,
    );
  }

  /**
   * Inverse transforms a 2D Vector Point: P_out = M^-1 * P_in
   */
  public inverseTransformPoint(p: Vector2): Vector2 | null {
    const inv = this.invert();
    if (!inv) return null;
    return inv.transformPoint(p);
  }

  /**
   * Converts matrix to CSS transform matrix string: matrix(a, b, c, d, e, f)
   */
  public toCSSMatrix(): string {
    return `matrix(${this.a.toFixed(6)}, ${this.b.toFixed(6)}, ${this.c.toFixed(6)}, ${this.d.toFixed(6)}, ${this.e.toFixed(2)}, ${this.f.toFixed(2)})`;
  }
}
