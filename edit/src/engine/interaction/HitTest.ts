import { Vector2 } from "../geometry/Vector2";
import { Matrix2D } from "../geometry/Matrix2D";
import { CoordinateSystem, CameraState } from "../geometry/CoordinateSystem";

export type HandleType =
  | "NW"
  | "N"
  | "NE"
  | "W"
  | "E"
  | "SW"
  | "S"
  | "SE"
  | "ROT";

export interface HandleDescriptor {
  type: HandleType;
  localPos: Vector2;
  oppositeAnchorLocal: Vector2;
  cursorAngleDeg: number;
}

/**
 * CANONICAL TRANSFORM STATE CONTRACT
 * 
 * Sole source of geometric truth:
 * - width & height (in physical canvas pixels)
 * - x & y (top-left world position)
 * - rotation (in degrees)
 * - flipX & flipY (boolean axis reflection)
 * 
 * scaleX and scaleY are DERIVED VALUES ONLY for UI/HUD displays or text scaling.
 * Matrix construction MUST NOT double-scale by multiplying width * scaleX.
 */
export interface ObjectTransformState {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // in degrees
  scaleX?: number; // Optional derived value (e.g. currentWidth / initialWidth)
  scaleY?: number; // Optional derived value (e.g. currentHeight / initialHeight)
  flipX?: boolean;
  flipY?: boolean;
  originX?: number;
  originY?: number;
}

export class HitTest {
  /**
   * Returns local handle positions & opposite anchors for an object box of size (width, height)
   */
  public static getHandles(width: number, height: number): HandleDescriptor[] {
    const w = width;
    const h = height;

    return [
      {
        type: "NW",
        localPos: new Vector2(0, 0),
        oppositeAnchorLocal: new Vector2(w, h),
        cursorAngleDeg: 135,
      },
      {
        type: "N",
        localPos: new Vector2(w / 2, 0),
        oppositeAnchorLocal: new Vector2(w / 2, h),
        cursorAngleDeg: 90,
      },
      {
        type: "NE",
        localPos: new Vector2(w, 0),
        oppositeAnchorLocal: new Vector2(0, h),
        cursorAngleDeg: 45,
      },
      {
        type: "W",
        localPos: new Vector2(0, h / 2),
        oppositeAnchorLocal: new Vector2(w, h / 2),
        cursorAngleDeg: 0,
      },
      {
        type: "E",
        localPos: new Vector2(w, h / 2),
        oppositeAnchorLocal: new Vector2(0, h / 2),
        cursorAngleDeg: 0,
      },
      {
        type: "SW",
        localPos: new Vector2(0, h),
        oppositeAnchorLocal: new Vector2(w, 0),
        cursorAngleDeg: 45,
      },
      {
        type: "S",
        localPos: new Vector2(w / 2, h),
        oppositeAnchorLocal: new Vector2(w / 2, 0),
        cursorAngleDeg: 90,
      },
      {
        type: "SE",
        localPos: new Vector2(w, h),
        oppositeAnchorLocal: new Vector2(0, 0),
        cursorAngleDeg: 135,
      },
      {
        type: "ROT",
        localPos: new Vector2(w / 2, -30),
        oppositeAnchorLocal: new Vector2(w / 2, h / 2),
        cursorAngleDeg: 0,
      },
    ];
  }

  /**
   * Builds CANONICAL object TRS transform matrix.
   * 
   * Matrix M = T(x, y) * R(rotation) * S(flipX ? -1 : 1, flipY ? -1 : 1)
   * 
   * Note: Scale factor is 1.0 (or -1.0 for axis flipping).
   * Geometric size is ALREADY encoded in physical pixels (0..width, 0..height).
   * This guarantees ZERO double representation / double scaling.
   */
  public static getObjectMatrix(state: ObjectTransformState): Matrix2D {
    const sx = state.flipX ? -1 : 1;
    const sy = state.flipY ? -1 : 1;

    return Matrix2D.createTRS(
      state.x,
      state.y,
      state.rotation,
      sx,
      sy,
      state.originX || 0,
      state.originY || 0,
    );
  }

  /**
   * Evaluates hit testing on handles in Screen Space.
   * Returns the HandleType if pointer is within hitRadiusPx, otherwise null.
   * 
   * hitRadiusPx is physically invariant in screen space (e.g. 12px radius = 24px hitbox).
   */
  public static hitTestHandles(
    screenPointer: Vector2,
    state: ObjectTransformState,
    camera: CameraState,
    hitRadiusPx: number = 12,
  ): HandleType | null {
    const handles = this.getHandles(state.width, state.height);
    const matrix = this.getObjectMatrix(state);

    for (const h of handles) {
      const worldPos = matrix.transformPoint(h.localPos);
      const screenPos = CoordinateSystem.worldToScreen(worldPos, camera);

      if (screenPointer.distance(screenPos) <= hitRadiusPx) {
        return h.type;
      }
    }

    return null;
  }

  /**
   * Evaluates hit testing on handles directly in World Space when camera is at 1.0 zoom
   */
  public static hitTestHandlesWorld(
    worldPointer: Vector2,
    state: ObjectTransformState,
    hitRadiusWorldPx: number = 12,
  ): HandleType | null {
    const handles = this.getHandles(state.width, state.height);
    const matrix = this.getObjectMatrix(state);

    for (const h of handles) {
      const worldPos = matrix.transformPoint(h.localPos);

      if (worldPointer.distance(worldPos) <= hitRadiusWorldPx) {
        return h.type;
      }
    }

    return null;
  }

  /**
   * Tests if pointer is inside object bounding box in local coordinates
   */
  public static hitTestObject(
    worldPointer: Vector2,
    state: ObjectTransformState,
  ): boolean {
    const matrix = this.getObjectMatrix(state);
    const local = CoordinateSystem.worldToLocal(worldPointer, matrix);

    return (
      local.x >= 0 &&
      local.x <= state.width &&
      local.y >= 0 &&
      local.y <= state.height
    );
  }

  /**
   * Calculates proper CSS cursor string based on handle type and object rotation angle
   */
  public static getCursorForHandle(
    handle: HandleType,
    rotationDeg: number,
  ): string {
    if (handle === "ROT") return "grab";

    const handles = this.getHandles(100, 100);
    const hDesc = handles.find((h) => h.type === handle);
    if (!hDesc) return "default";

    // Effective angle relative to screen axes
    let angle = (hDesc.cursorAngleDeg + rotationDeg) % 180;
    if (angle < 0) angle += 180;

    // Classify into 4 primary resize axes: 0 deg (E/W), 45 deg (NE/SW), 90 deg (N/S), 135 deg (NW/SE)
    if (angle >= 22.5 && angle < 67.5) {
      return "nesw-resize";
    } else if (angle >= 67.5 && angle < 112.5) {
      return "ns-resize";
    } else if (angle >= 112.5 && angle < 157.5) {
      return "nwse-resize";
    } else {
      return "ew-resize";
    }
  }
}
