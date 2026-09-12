/**
 * Font Metrics & Text Bounding Box & Transform Matrix Algorithm
 * Canva-style precision text metrics calculation engine.
 */

export interface FontMetrics {
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  lineHeightRatio: number;
  ascent: number;
  descent: number;
  baseline: number;
  lineHeightPx: number;
  xHeight: number;
  capHeight: number;
}

export interface PaddingConfig {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface TransformMatrix2D {
  a: number; // Scale X
  b: number; // Skew Y
  c: number; // Skew X
  d: number; // Scale Y
  tx: number; // Translate X
  ty: number; // Translate Y
  rotationDeg: number;
  scaleX: number;
  scaleY: number;
}

export interface TextBoundingBoxResult {
  width: number;
  height: number;
  lines: string[];
  lineWidths: number[];
  lineHeightPx: number;
  baselineOffsets: number[];
  tightAscent: number;
  tightDescent: number;
  padding: PaddingConfig;
  transformedCorners?: { x: number; y: number }[];
  transformedBoundingRect?: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
  };
}

/**
 * Creates 2D transform matrix from rotation, scale, and translation
 */
export function createTransformMatrix(
  rotationDeg: number = 0,
  scaleX: number = 1,
  scaleY: number = 1,
  tx: number = 0,
  ty: number = 0,
): TransformMatrix2D {
  const rad = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const a = cos * scaleX;
  const b = sin * scaleX;
  const c = -sin * scaleY;
  const d = cos * scaleY;

  return {
    a,
    b,
    c,
    d,
    tx,
    ty,
    rotationDeg,
    scaleX,
    scaleY,
  };
}

/**
 * Transforms a 2D point (x, y) using transform matrix
 */
export function transformPoint(
  x: number,
  y: number,
  matrix: TransformMatrix2D,
): { x: number; y: number } {
  return {
    x: matrix.a * x + matrix.c * y + matrix.tx,
    y: matrix.b * x + matrix.d * y + matrix.ty,
  };
}

/**
 * Calculates exact Font Metrics using Canvas 2D MeasureText
 */
export function calculateFontMetrics(
  fontFamily: string = "sans-serif",
  fontSize: number = 16,
  fontWeight: string = "normal",
  lineHeightRatio: number = 1.3,
): FontMetrics {
  const lineHeightPx = Math.round(fontSize * lineHeightRatio);
  let ascent = Math.round(fontSize * 0.8);
  let descent = Math.round(fontSize * 0.2);
  let xHeight = Math.round(fontSize * 0.5);
  let capHeight = Math.round(fontSize * 0.7);

  if (typeof window !== "undefined") {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        const metrics = ctx.measureText("MgHjygqÅ");

        if (typeof metrics.actualBoundingBoxAscent === "number") {
          ascent = metrics.actualBoundingBoxAscent;
        } else if (typeof metrics.fontBoundingBoxAscent === "number") {
          ascent = metrics.fontBoundingBoxAscent;
        }

        if (typeof metrics.actualBoundingBoxDescent === "number") {
          descent = metrics.actualBoundingBoxDescent;
        } else if (typeof metrics.fontBoundingBoxDescent === "number") {
          descent = metrics.fontBoundingBoxDescent;
        }
      }
    } catch {
      // Fallback to proportional estimates
    }
  }

  const baseline = Math.round((lineHeightPx - (ascent + descent)) / 2 + ascent);

  return {
    fontSize,
    fontFamily,
    fontWeight,
    lineHeightRatio,
    ascent,
    descent,
    baseline,
    lineHeightPx,
    xHeight,
    capHeight,
  };
}

/**
 * Computes exact text bounding box, line wrapping, baseline metrics, and transform matrix coordinates
 */
export function calculateTextBoundingBox(
  text: string,
  options: {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    lineHeightRatio?: number;
    padding?: Partial<PaddingConfig>;
    containerWidth?: number;
    transformMatrix?: TransformMatrix2D;
  },
): TextBoundingBoxResult {
  const fontSize = options.fontSize || 16;
  const fontFamily = options.fontFamily || "sans-serif";
  const fontWeight = options.fontWeight || "normal";
  const lineHeightRatio = options.lineHeightRatio || 1.3;
  const padding: PaddingConfig = {
    top: options.padding?.top || 0,
    right: options.padding?.right || 0,
    bottom: options.padding?.bottom || 0,
    left: options.padding?.left || 0,
  };

  const metrics = calculateFontMetrics(
    fontFamily,
    fontSize,
    fontWeight,
    lineHeightRatio,
  );

  // Split text by lines
  const rawLines = text.split("\n");
  const lines: string[] = [];
  const lineWidths: number[] = [];

  let canvasCtx: CanvasRenderingContext2D | null = null;
  if (typeof window !== "undefined") {
    const canvas = document.createElement("canvas");
    canvasCtx = canvas.getContext("2d");
    if (canvasCtx) {
      canvasCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    }
  }

  const availableWidth = options.containerWidth
    ? Math.max(20, options.containerWidth - padding.left - padding.right)
    : 10000;

  for (const rawLine of rawLines) {
    if (!rawLine) {
      lines.push("");
      lineWidths.push(0);
      continue;
    }

    if (canvasCtx && options.containerWidth && availableWidth > 0) {
      // Word wrap algorithm
      const words = rawLine.split(" ");
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = canvasCtx.measureText(testLine).width;

        if (width > availableWidth && currentLine) {
          lines.push(currentLine);
          lineWidths.push(Math.round(canvasCtx.measureText(currentLine).width));
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
        lineWidths.push(Math.round(canvasCtx.measureText(currentLine).width));
      }
    } else {
      lines.push(rawLine);
      const approxWidth = canvasCtx
        ? Math.round(canvasCtx.measureText(rawLine).width)
        : rawLine.length * (fontSize * 0.6);
      lineWidths.push(approxWidth);
    }
  }

  const maxLineWidth = Math.max(0, ...lineWidths);
  const totalContentWidth = maxLineWidth + padding.left + padding.right;
  const finalWidth = options.containerWidth
    ? Math.max(options.containerWidth, totalContentWidth)
    : Math.max(40, totalContentWidth);

  const totalContentHeight =
    lines.length * metrics.lineHeightPx + padding.top + padding.bottom;
  const finalHeight = Math.max(metrics.lineHeightPx, totalContentHeight);

  // Calculate baseline offsets per line
  const baselineOffsets: number[] = lines.map(
    (_, index) =>
      padding.top + index * metrics.lineHeightPx + metrics.baseline,
  );

  const result: TextBoundingBoxResult = {
    width: Math.round(finalWidth),
    height: Math.round(finalHeight),
    lines,
    lineWidths,
    lineHeightPx: metrics.lineHeightPx,
    baselineOffsets,
    tightAscent: metrics.ascent,
    tightDescent: metrics.descent,
    padding,
  };

  // Compute transform matrix 4 corners if matrix provided
  if (options.transformMatrix) {
    const w = result.width;
    const h = result.height;
    const corners = [
      transformPoint(0, 0, options.transformMatrix),
      transformPoint(w, 0, options.transformMatrix),
      transformPoint(w, h, options.transformMatrix),
      transformPoint(0, h, options.transformMatrix),
    ];

    const xs = corners.map((c) => c.x);
    const ys = corners.map((c) => c.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    result.transformedCorners = corners;
    result.transformedBoundingRect = {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  return result;
}
