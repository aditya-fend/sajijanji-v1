import { Vector2 } from "../geometry/Vector2";
import { Matrix2D } from "../geometry/Matrix2D";
import { CoordinateSystem, CameraState } from "../geometry/CoordinateSystem";
import { ObjectTransformState, HitTest } from "../interaction/HitTest";
import { HandleRenderer } from "./HandleRenderer";

export class SelectionRenderer {
  /**
   * Renders the interactive selection outline and 8 handles over selected object
   */
  public static renderSelection(
    ctx: CanvasRenderingContext2D,
    state: ObjectTransformState,
    camera: CameraState,
    strokeColor: string = "#2563eb",
  ): void {
    const matrix = HitTest.getObjectMatrix(state);

    const cornersLocal = [
      new Vector2(0, 0),
      new Vector2(state.width, 0),
      new Vector2(state.width, state.height),
      new Vector2(0, state.height),
    ];

    const cornersScreen = cornersLocal.map((local) => {
      const world = matrix.transformPoint(local);
      return CoordinateSystem.worldToScreen(world, camera);
    });

    ctx.save();

    // Draw transformed bounding box box line
    ctx.beginPath();
    ctx.moveTo(cornersScreen[0].x, cornersScreen[0].y);
    ctx.lineTo(cornersScreen[1].x, cornersScreen[1].y);
    ctx.lineTo(cornersScreen[2].x, cornersScreen[2].y);
    ctx.lineTo(cornersScreen[3].x, cornersScreen[3].y);
    ctx.closePath();

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Render handles on top
    HandleRenderer.renderHandles(ctx, state, camera, { handleStroke: strokeColor });

    ctx.restore();
  }
}
