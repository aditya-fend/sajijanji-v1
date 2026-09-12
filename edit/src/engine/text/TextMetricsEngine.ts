import { Vector2 } from "../geometry/Vector2";

export interface TextProperties {
  text: string;
  fontFamily: string;
  fontSize: number; // Base immutable logical font size in px
  fontWeight?: string | number;
  fontStyle?: string;
  lineHeight: number; // multiplier e.g. 1.2 or pixel value
  letterSpacing?: number;
  width: number;
  height: number;
  scaleX?: number; // Derived visual scale factor
  scaleY?: number; // Derived visual scale factor
}

export interface TextMetricsResult {
  width: number;
  height: number;
  lines: string[];
  lineHeightPx: number;
  actualBoundingBoxAscent?: number;
  actualBoundingBoxDescent?: number;
}

export class TextMetricsEngine {
  private static canvasContext: CanvasRenderingContext2D | null = null;

  private static getContext(): CanvasRenderingContext2D | null {
    if (typeof window === "undefined") return null;
    if (!TextMetricsEngine.canvasContext) {
      const canvas = document.createElement("canvas");
      TextMetricsEngine.canvasContext = canvas.getContext("2d");
    }
    return TextMetricsEngine.canvasContext;
  }

  /**
   * Calculates visual font size given immutable base fontSize and derived scale factor
   */
  public static getVisualFontSize(props: TextProperties, derivedScale: number = 1.0): number {
    const scale = derivedScale || Math.abs(props.scaleY || 1.0);
    return props.fontSize * scale;
  }

  /**
   * Mode A: Reflow text within a bounding box width.
   * Calculates line breaks and required height given a fixed width.
   */
  public static measureTextBox(
    props: TextProperties,
    targetWidth: number,
    derivedScale: number = 1.0,
  ): TextMetricsResult {
    const ctx = this.getContext();
    const visualFontSize = this.getVisualFontSize(props, derivedScale);
    const fontStyle = props.fontStyle || "normal";
    const fontWeight = props.fontWeight || "normal";
    const fontFamily = props.fontFamily || "sans-serif";
    const fontString = `${fontStyle} ${fontWeight} ${visualFontSize}px ${fontFamily}`;

    const lineHeightPx = visualFontSize * (props.lineHeight || 1.2);

    if (!ctx) {
      // Server-side / fallback calculation
      const lines = props.text.split("\n");
      return {
        width: targetWidth,
        height: lines.length * lineHeightPx,
        lines,
        lineHeightPx,
      };
    }

    ctx.font = fontString;

    const rawLines = props.text.split("\n");
    const wrappedLines: string[] = [];

    for (const rawLine of rawLines) {
      if (targetWidth <= 0) {
        wrappedLines.push(rawLine);
        continue;
      }

      const words = rawLine.split(" ");
      let currentLine = "";

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > targetWidth && currentLine !== "") {
          wrappedLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        wrappedLines.push(currentLine);
      }
    }

    const totalHeight = Math.max(wrappedLines.length * lineHeightPx, lineHeightPx);

    return {
      width: targetWidth,
      height: totalHeight,
      lines: wrappedLines,
      lineHeightPx,
    };
  }

  /**
   * Mode B: Scales entire text object uniformly.
   * Width & Height scale directly via derived scale factors without breaking lines differently.
   */
  public static scaleTextUniformly(
    props: TextProperties,
    derivedScale: number,
  ): TextProperties {
    return {
      ...props,
      scaleX: derivedScale,
      scaleY: derivedScale,
    };
  }
}
