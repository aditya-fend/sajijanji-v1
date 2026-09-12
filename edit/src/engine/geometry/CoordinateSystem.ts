import { Vector2 } from "./Vector2";
import { Matrix2D } from "./Matrix2D";

export interface CameraState {
  x: number; // Viewport pan offset X in CSS pixels
  y: number; // Viewport pan offset Y in CSS pixels
  zoom: number; // Viewport zoom factor (1.0 = 100%)
}

/**
 * Coordinate System Converter
 * Handles conversions between Screen (DOM/Pointer), World (Canvas), and Local (Object) Coordinate Systems.
 */
export class CoordinateSystem {
  /**
   * Converts Screen (Pointer DOM) coordinates to World (Canvas) coordinates
   * Formula: P_world = (P_screen - Camera_Pan) / Zoom
   */
  public static screenToWorld(
    screenPoint: Vector2,
    camera: CameraState,
  ): Vector2 {
    return new Vector2(
      (screenPoint.x - camera.x) / camera.zoom,
      (screenPoint.y - camera.y) / camera.zoom,
    );
  }

  /**
   * Converts World (Canvas) coordinates to Screen (Pointer DOM) coordinates
   * Formula: P_screen = P_world * Zoom + Camera_Pan
   */
  public static worldToScreen(
    worldPoint: Vector2,
    camera: CameraState,
  ): Vector2 {
    return new Vector2(
      worldPoint.x * camera.zoom + camera.x,
      worldPoint.y * camera.zoom + camera.y,
    );
  }

  /**
   * Converts World (Canvas) coordinates to Object Local coordinates using Inverse Transform Matrix M^-1
   * Formula: P_local = M^-1 * P_world
   */
  public static worldToLocal(
    worldPoint: Vector2,
    objectMatrix: Matrix2D,
  ): Vector2 {
    const inv = objectMatrix.invert();
    if (!inv) return new Vector2(0, 0);
    return inv.transformPoint(worldPoint);
  }

  /**
   * Converts Object Local coordinates to World (Canvas) coordinates using Transform Matrix M
   * Formula: P_world = M * P_local
   */
  public static localToWorld(
    localPoint: Vector2,
    objectMatrix: Matrix2D,
  ): Vector2 {
    return objectMatrix.transformPoint(localPoint);
  }

  /**
   * Converts Screen pointer delta to World delta independent of zoom level
   */
  public static screenDeltaToWorld(
    screenDelta: Vector2,
    camera: CameraState,
  ): Vector2 {
    return new Vector2(screenDelta.x / camera.zoom, screenDelta.y / camera.zoom);
  }
}
