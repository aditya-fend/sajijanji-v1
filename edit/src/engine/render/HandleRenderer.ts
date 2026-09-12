import { Vector2 } from "../geometry/Vector2";
import { Matrix2D } from "../geometry/Matrix2D";
import { CoordinateSystem, CameraState } from "../geometry/CoordinateSystem";
import { ObjectTransformState, HitTest, HandleType } from "../interaction/HitTest";

export interface HandleStyleOptions {
  handleRadiusPx?: number;
  handleFill?: string;
  handleStroke?: string;
  handleStrokeWidth?: number;
  rotationHandleOffsetPx?: number;
}

export class HandleRenderer {
  /**
   * Renders the 8 resize handles and 1 rotation handle onto a 2D Canvas context
   */
  public static renderHandles(
    ctx: CanvasRenderingContext2D,
    state: ObjectTransformState,
    camera: CameraState,
    options: HandleStyleOptions = {},
  ): void {
    const radius = options.handleRadiusPx ?? 6;
    const strokeWidth = options.handleStrokeWidth ?? 2;
    const fill = options.handleFill ?? "#ffffff";
    const stroke = options.handleStroke ?? "#2563eb"; // Figma/Canva blue

    const handles = HitTest.getHandles(state.width, state.height);
    const matrix = HitTest.getObjectMatrix(state);

    ctx.save();

    for (const h of handles) {
      const worldPos = matrix.transformPoint(h.localPos);
      const screenPos = CoordinateSystem.worldToScreen(worldPos, camera);

      if (h.type === "ROT") {
        // Draw connecting line from top-center handle to rotation handle
        const topCenter = handles.find((handle) => handle.type === "N");
        if (topCenter) {
          const tcWorld = matrix.transformPoint(topCenter.localPos);
          const tcScreen = CoordinateSystem.worldToScreen(tcWorld, camera);

          ctx.beginPath();
          ctx.moveTo(tcScreen.x, tcScreen.y);
          ctx.lineTo(screenPos.x, screenPos.y);
          ctx.strokeStyle = stroke;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Draw Rotation Circle
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, radius + 1, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      } else {
        // Draw 8 Corner / Side Handles as crisp squares or circles
        ctx.beginPath();
        ctx.rect(
          screenPos.x - radius,
          screenPos.y - radius,
          radius * 2,
          radius * 2,
        );
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}
