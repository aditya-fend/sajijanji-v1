/**
 * 2D Vector Mathematics Module
 * Handles vector operations for 2D Computer Graphics & Transform Engine.
 */

export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  public add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  public subtract(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  public multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  public divide(scalar: number): Vector2 {
    if (scalar === 0) return new Vector2(0, 0);
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  public dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  public cross(v: Vector2): number {
    return this.x * v.y - this.y * v.x;
  }

  public lengthSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  public length(): number {
    return Math.sqrt(this.lengthSq());
  }

  public normalize(): Vector2 {
    const len = this.length();
    if (len === 0) return new Vector2(0, 0);
    return this.divide(len);
  }

  public distanceSq(v: Vector2): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  public distance(v: Vector2): number {
    return Math.sqrt(this.distanceSq(v));
  }

  /**
   * Rotates vector by angle in radians around a pivot center
   */
  public rotate(angleRad: number, pivot: Vector2 = new Vector2(0, 0)): Vector2 {
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);

    const dx = this.x - pivot.x;
    const dy = this.y - pivot.y;

    const rx = dx * cos - dy * sin;
    const ry = dx * sin + dy * cos;

    return new Vector2(rx + pivot.x, ry + pivot.y);
  }

  /**
   * Angle between this vector and another vector in radians
   */
  public angleTo(v: Vector2): number {
    return Math.atan2(v.y - this.y, v.x - this.x);
  }
}
