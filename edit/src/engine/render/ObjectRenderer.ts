import { Vector2 } from "../geometry/Vector2";
import { Matrix2D } from "../geometry/Matrix2D";
import { CoordinateSystem, CameraState } from "../geometry/CoordinateSystem";
import { ObjectTransformState, HitTest } from "../interaction/HitTest";
import { TextProperties, TextMetricsEngine } from "../text/TextMetricsEngine";

export interface CanvasObject extends ObjectTransformState {
  id: string;
  type: "text" | "rect" | "circle" | "image";
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  // Text specific
  textProps?: TextProperties;
  // Image specific
  imageElement?: HTMLImageElement;
}

export class ObjectRenderer {
  /**
   * Renders a transformed object onto Canvas 2D context using CANONICAL matrix transforms
   */
  public static renderObject(
    ctx: CanvasRenderingContext2D,
    obj: CanvasObject,
    camera: CameraState,
  ): void {
    ctx.save();

    // 1. Apply Viewport Camera Transformation (Pan & Zoom)
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    // 2. Apply Canonical Object Local Transformation Matrix
    // Matrix M = T(x, y) * R(rotation) * S(flipX ? -1 : 1, flipY ? -1 : 1)
    // Note: Matrix uses scale = 1.0 (flip handling only). Physical dimensions are obj.width and obj.height.
    const matrix = HitTest.getObjectMatrix(obj);
    ctx.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);

    // 3. Render Object Content based on Type (using physical pixel dimensions obj.width and obj.height)
    switch (obj.type) {
      case "text":
        if (obj.textProps) {
          // Derived uniform scale factor for visual typography
          const derivedScale = obj.textProps.width > 0 ? obj.width / obj.textProps.width : 1.0;
          const visualFontSize = obj.textProps.fontSize * (obj.scaleY || derivedScale || 1.0);
          const lineHeightPx = visualFontSize * (obj.textProps.lineHeight || 1.2);
          const measured = TextMetricsEngine.measureTextBox(obj.textProps, obj.width, obj.scaleY || derivedScale);

          ctx.font = `${obj.textProps.fontStyle || "normal"} ${obj.textProps.fontWeight || "normal"} ${visualFontSize}px ${obj.textProps.fontFamily}`;
          ctx.fillStyle = obj.fill || "#000000";
          ctx.textBaseline = "top";

          measured.lines.forEach((line, index) => {
            ctx.fillText(line, 0, index * lineHeightPx);
          });
        }
        break;

      case "rect":
        ctx.fillStyle = obj.fill || "#cccccc";
        ctx.fillRect(0, 0, obj.width, obj.height);
        if (obj.stroke && obj.strokeWidth) {
          ctx.strokeStyle = obj.stroke;
          ctx.lineWidth = obj.strokeWidth;
          ctx.strokeRect(0, 0, obj.width, obj.height);
        }
        break;

      case "circle":
        ctx.fillStyle = obj.fill || "#cccccc";
        ctx.beginPath();
        ctx.ellipse(
          obj.width / 2,
          obj.height / 2,
          obj.width / 2,
          obj.height / 2,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        if (obj.stroke && obj.strokeWidth) {
          ctx.strokeStyle = obj.stroke;
          ctx.lineWidth = obj.strokeWidth;
          ctx.stroke();
        }
        break;

      case "image":
        if (obj.imageElement && obj.imageElement.complete) {
          ctx.drawImage(obj.imageElement, 0, 0, obj.width, obj.height);
        } else {
          // Placeholder pattern
          ctx.fillStyle = "#e2e8f0";
          ctx.fillRect(0, 0, obj.width, obj.height);
        }
        break;
    }

    ctx.restore();
  }
}
