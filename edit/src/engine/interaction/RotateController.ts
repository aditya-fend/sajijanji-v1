import { Vector2 } from "../geometry/Vector2";
import { ObjectTransformState, HitTest } from "./HitTest";

export interface RotateSession {
  initialState: ObjectTransformState;
  initialWorldPointer: Vector2;
  centerWorld: Vector2;
  initialAngleDeg: number;
}

export interface RotateOptions {
  snapEnable?: boolean;
  snapThresholdDeg?: number; // threshold in degrees, e.g. 5
}

export class RotateController {
  /**
   * Starts a rotation interaction session
   */
  public static startSession(
    initialState: ObjectTransformState,
    initialWorldPointer: Vector2,
  ): RotateSession {
    const matrix = HitTest.getObjectMatrix(initialState);
    const centerLocal = new Vector2(initialState.width / 2, initialState.height / 2);
    const centerWorld = matrix.transformPoint(centerLocal);

    const vec = initialWorldPointer.subtract(centerWorld);
    // Standard Math.atan2 returns angle in radians, 0 is right (+X), PI/2 is down (+Y)
    // Offset by +90deg because rotation handle is top (-Y), so top is 0 relative angle
    const initialAngleRad = Math.atan2(vec.y, vec.x);
    const initialAngleDeg = (initialAngleRad * 180) / Math.PI;

    return {
      initialState: { ...initialState },
      initialWorldPointer: initialWorldPointer.clone(),
      centerWorld,
      initialAngleDeg,
    };
  }

  /**
   * Updates rotation given current world pointer.
   * Calculates new rotation angle with optional snapping.
   */
  public static updateRotation(
    session: RotateSession,
    currentWorldPointer: Vector2,
    options: RotateOptions = {},
  ): ObjectTransformState {
    const vec = currentWorldPointer.subtract(session.centerWorld);
    const currentAngleRad = Math.atan2(vec.y, vec.x);
    let currentAngleDeg = (currentAngleRad * 180) / Math.PI;

    const angleDelta = currentAngleDeg - session.initialAngleDeg;
    let newRotation = session.initialState.rotation + angleDelta;

    // Normalize angle to [0, 360)
    newRotation = (newRotation % 360 + 360) % 360;

    // Apply snapping if enabled
    const snapThreshold = options.snapThresholdDeg ?? 5;
    if (options.snapEnable !== false) {
      const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
      for (const snap of snapAngles) {
        if (Math.abs(newRotation - snap) <= snapThreshold) {
          newRotation = snap % 360;
          break;
        }
      }
    }

    return {
      ...session.initialState,
      rotation: Math.round(newRotation * 100) / 100, // round to 2 decimals for numerical stability
    };
  }
}
