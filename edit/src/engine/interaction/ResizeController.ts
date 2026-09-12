import { Vector2 } from "../geometry/Vector2";
import { Matrix2D } from "../geometry/Matrix2D";
import { ObjectTransformState, HandleType, HitTest } from "./HitTest";

export interface ResizeSession {
  initialState: ObjectTransformState;
  initialWorldPointer: Vector2;
  initialHandleWorld: Vector2;
  pointerOffsetWorld: Vector2;
  activeHandle: HandleType;
  initialMatrix: Matrix2D;
  initialCenterWorld: Vector2;
  oppositeAnchorLocal: Vector2;
  oppositeAnchorWorld: Vector2;
  aspectRatio: number;
}

export interface ResizeOptions {
  lockAspectRatio?: boolean;
  minWidth?: number;
  minHeight?: number;
  isTextObject?: boolean;
  textMode?: "box" | "scale";
}

export class ResizeController {
  private static readonly DEFAULT_MIN_WIDTH = 10;
  private static readonly DEFAULT_MIN_HEIGHT = 10;

  /**
   * Begins a stateless resize interaction session
   * Stores initial snapshots and pointer offset to guarantee zero initial jump.
   */
  public static startSession(
    initialState: ObjectTransformState,
    initialWorldPointer: Vector2,
    activeHandle: HandleType,
  ): ResizeSession {
    const handles = HitTest.getHandles(initialState.width, initialState.height);
    const handleDesc = handles.find((h) => h.type === activeHandle);

    const activeHandleLocal = handleDesc ? handleDesc.localPos : new Vector2(0, 0);
    const oppositeAnchorLocal = handleDesc ? handleDesc.oppositeAnchorLocal : new Vector2(0, 0);

    const initialMatrix = HitTest.getObjectMatrix(initialState);

    const initialHandleWorld = initialMatrix.transformPoint(activeHandleLocal);
    const oppositeAnchorWorld = initialMatrix.transformPoint(oppositeAnchorLocal);

    const centerLocal = new Vector2(initialState.width / 2, initialState.height / 2);
    const initialCenterWorld = initialMatrix.transformPoint(centerLocal);

    // Pointer offset = initialPointer - initialHandleWorld
    const pointerOffsetWorld = initialWorldPointer.subtract(initialHandleWorld);

    const aspectRatio = initialState.width / (initialState.height || 1);

    return {
      initialState: { ...initialState },
      initialWorldPointer: initialWorldPointer.clone(),
      initialHandleWorld,
      pointerOffsetWorld,
      activeHandle,
      initialMatrix,
      initialCenterWorld,
      oppositeAnchorLocal,
      oppositeAnchorWorld,
      aspectRatio,
    };
  }

  /**
   * Pure Vector Projection & Center-Based Resizing Pipeline
   * 
   * Pipeline:
   * WORLD POINTER -> EFFECTIVE POINTER (POINTER OFFSET CORRECTION) -> 
   * LOCAL AXIS BASIS (ux, uy) -> VECTOR PROJECTION (dP · ux, dP · uy) ->
   * ANCHOR-PRESERVING RESIZE -> UNIFORM/FREE SCALING -> STATELESS FLIPPING -> 
   * NEW WIDTH/HEIGHT -> NEW CENTER -> AFFINE TRANSFORM -> RENDER
   * 
   * Returns Canonical State: (x, y, width, height, rotation, flipX, flipY)
   * scaleX and scaleY are optional derived metrics.
   */
  public static updateResize(
    session: ResizeSession,
    currentWorldPointer: Vector2,
    options: ResizeOptions = {},
  ): ObjectTransformState {
    const {
      initialState,
      initialHandleWorld,
      pointerOffsetWorld,
      activeHandle,
      oppositeAnchorWorld,
      aspectRatio,
    } = session;

    const minW = options.minWidth ?? this.DEFAULT_MIN_WIDTH;
    const minH = options.minHeight ?? this.DEFAULT_MIN_HEIGHT;

    // 1. POINTER OFFSET CORRECTION: Zero Initial Jump Guarantee
    // effectivePointer = currentPointer - pointerOffset
    const effectivePointerWorld = currentWorldPointer.subtract(pointerOffsetWorld);

    // 2. LOCAL AXIS BASIS in World Space for Object Rotation θ
    const rad = (initialState.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const localXAxis = new Vector2(cos, sin);   // Unit basis vector along local X
    const localYAxis = new Vector2(-sin, cos);  // Unit basis vector along local Y

    // 3. VECTOR DISPLACEMENT & PROJECTION onto Local Axes
    // dP = effectivePointer - initialHandleWorld
    const dP = effectivePointerWorld.subtract(initialHandleWorld);

    // dx = dot(dP, localXAxis), dy = dot(dP, localYAxis)
    const dx = dP.dot(localXAxis);
    const dy = dP.dot(localYAxis);

    const W0 = initialState.width;
    const H0 = initialState.height;

    let signedWidth = W0;
    let signedHeight = H0;

    // 4. Handle-Specific Signed Dimension Calculation via Local Projections
    const isCorner = ["NW", "NE", "SW", "SE"].includes(activeHandle);
    const lockAspect = options.lockAspectRatio || (isCorner && options.isTextObject && options.textMode !== "box");

    if (lockAspect && aspectRatio > 0 && isCorner) {
      // Uniform Diagonal Scaling Projection Math
      let sigmaX = 1;
      let sigmaY = 1;

      switch (activeHandle) {
        case "SE": sigmaX = 1;  sigmaY = 1;  break;
        case "NW": sigmaX = -1; sigmaY = -1; break;
        case "NE": sigmaX = 1;  sigmaY = -1; break;
        case "SW": sigmaX = -1; sigmaY = 1;  break;
      }

      const deltaXHandle = sigmaX * dx;
      const deltaYHandle = sigmaY * dy;

      // Project handle displacement along local diagonal vector (W0, H0)
      const projDiag = (deltaXHandle * W0 + deltaYHandle * H0) / (W0 * W0 + H0 * H0);
      const uniformScale = 1 + projDiag;

      signedWidth = W0 * uniformScale;
      signedHeight = H0 * uniformScale;
    } else {
      // Free Unconstrained Scaling per Axis
      switch (activeHandle) {
        case "SE":
          signedWidth = W0 + dx;
          signedHeight = H0 + dy;
          break;
        case "NW":
          signedWidth = W0 - dx;
          signedHeight = H0 - dy;
          break;
        case "NE":
          signedWidth = W0 + dx;
          signedHeight = H0 - dy;
          break;
        case "SW":
          signedWidth = W0 - dx;
          signedHeight = H0 + dy;
          break;
        case "E":
          signedWidth = W0 + dx;
          signedHeight = H0;
          break;
        case "W":
          signedWidth = W0 - dx;
          signedHeight = H0;
          break;
        case "S":
          signedWidth = W0;
          signedHeight = H0 + dy;
          break;
        case "N":
          signedWidth = W0;
          signedHeight = H0 - dy;
          break;
      }
    }

    // 5. STATELESS FLIPPING & MINIMUM SIZE BOUNDS
    let flipX = initialState.flipX ?? false;
    let flipY = initialState.flipY ?? false;

    if (signedWidth < 0) {
      flipX = !(initialState.flipX ?? false);
    } else {
      flipX = initialState.flipX ?? false;
    }

    if (signedHeight < 0) {
      flipY = !(initialState.flipY ?? false);
    } else {
      flipY = initialState.flipY ?? false;
    }

    const newWidth = Math.max(Math.abs(signedWidth), minW);
    const newHeight = Math.max(Math.abs(signedHeight), minH);

    // 6. OPPOSITE ANCHOR INVARIANCE & NEW WORLD CENTER RECALCULATION
    const centerLocalNew = new Vector2(newWidth / 2, newHeight / 2);
    let anchorLocalNew = new Vector2(0, 0);

    switch (activeHandle) {
      case "SE": anchorLocalNew = new Vector2(0, 0); break;
      case "NW": anchorLocalNew = new Vector2(newWidth, newHeight); break;
      case "NE": anchorLocalNew = new Vector2(0, newHeight); break;
      case "SW": anchorLocalNew = new Vector2(newWidth, 0); break;
      case "E":  anchorLocalNew = new Vector2(0, newHeight / 2); break;
      case "W":  anchorLocalNew = new Vector2(newWidth, newHeight / 2); break;
      case "S":  anchorLocalNew = new Vector2(newWidth / 2, 0); break;
      case "N":  anchorLocalNew = new Vector2(newWidth / 2, newHeight); break;
    }

    // Vector from new center to new local opposite anchor
    const vecCenterToAnchorLocal = anchorLocalNew.subtract(centerLocalNew);

    // Rotate local vector to World space
    const vecCenterToAnchorWorld = new Vector2(
      cos * vecCenterToAnchorLocal.x - sin * vecCenterToAnchorLocal.y,
      sin * vecCenterToAnchorLocal.x + cos * vecCenterToAnchorLocal.y,
    );

    // New World Center so opposite anchor is invariant in World space
    // centerNew = anchorWorld - rotated(anchorLocalNew - centerLocalNew)
    const centerNewWorld = oppositeAnchorWorld.subtract(vecCenterToAnchorWorld);

    // Vector from top-left (0,0) to center in rotated World space
    const vecTopLeftToCenterWorld = new Vector2(
      cos * centerLocalNew.x - sin * centerLocalNew.y,
      sin * centerLocalNew.x + cos * centerLocalNew.y,
    );

    // New Top-Left Position in World space
    const newPosWorld = centerNewWorld.subtract(vecTopLeftToCenterWorld);

    // 7. DERIVED SCALE VALUES (For HUD/Text Scaling only, NOT for Matrix double-scaling)
    const derivedScaleX = newWidth / W0;
    const derivedScaleY = newHeight / H0;

    return {
      ...initialState,
      x: newPosWorld.x,
      y: newPosWorld.y,
      width: newWidth,
      height: newHeight,
      scaleX: derivedScaleX,
      scaleY: derivedScaleY,
      flipX,
      flipY,
    };
  }
}
