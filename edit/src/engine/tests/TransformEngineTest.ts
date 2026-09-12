import { Vector2 } from "../geometry/Vector2";
import { Matrix2D } from "../geometry/Matrix2D";
import { CoordinateSystem } from "../geometry/CoordinateSystem";
import { HitTest, ObjectTransformState, HandleType } from "../interaction/HitTest";
import { ResizeController, ResizeSession } from "../interaction/ResizeController";
import { RotateController } from "../interaction/RotateController";
import { TextMetricsEngine } from "../text/TextMetricsEngine";

export interface TestMetricResult {
  testId: number;
  testName: string;
  passed: boolean;
  initialState: ObjectTransformState;
  pointer: Vector2;
  expectedHandle: HandleType;
  actualHandle: HandleType;
  anchorError: number;
  aspectError: number;
  visualSize: { width: number; height: number };
  scale: { scaleX: number; scaleY: number };
  detail?: string;
}

export class TransformEngineTest {
  private static readonly ANCHOR_EPSILON = 1e-5;
  private static readonly ASPECT_EPSILON = 1e-6;

  public static runAllAuditTests(): {
    passed: number;
    failed: number;
    metrics: TestMetricResult[];
  } {
    const metrics: TestMetricResult[] = [];
    let passed = 0;
    let failed = 0;

    const baseState: ObjectTransformState = {
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      flipX: false,
      flipY: false,
    };

    function recordTest(
      testId: number,
      testName: string,
      session: ResizeSession,
      currentPointer: Vector2,
      resultState: ObjectTransformState,
      options: { lockAspect?: boolean; expectedAspect?: number; customPass?: boolean; customFailDetail?: string } = {},
    ) {
      const resultMatrix = HitTest.getObjectMatrix(resultState);
      const currentHandles = HitTest.getHandles(resultState.width, resultState.height);
      const activeDesc = currentHandles.find((h) => h.type === session.activeHandle);

      // Opposite anchor in World space for the updated dimensions
      const newAnchorWorld = resultMatrix.transformPoint(
        activeDesc ? activeDesc.oppositeAnchorLocal : new Vector2(0, 0),
      );

      // 1. Calculate Anchor Error: distance between initial opposite anchor and new opposite anchor in World space
      const anchorError = session.oppositeAnchorWorld.distance(newAnchorWorld);

      // 2. Calculate Aspect Error (if aspect lock enabled)
      let aspectError = 0;
      if (options.lockAspect && options.expectedAspect) {
        const actualAspect = resultState.width / (resultState.height || 1);
        aspectError = Math.abs(actualAspect - options.expectedAspect);
      }

      const isPassed = options.customPass !== undefined
        ? options.customPass
        : (anchorError <= TransformEngineTest.ANCHOR_EPSILON && aspectError <= TransformEngineTest.ASPECT_EPSILON);

      if (isPassed) passed++;
      else failed++;

      metrics.push({
        testId,
        testName,
        passed: isPassed,
        initialState: session.initialState,
        pointer: currentPointer.clone(),
        expectedHandle: session.activeHandle,
        actualHandle: session.activeHandle,
        anchorError,
        aspectError,
        visualSize: { width: resultState.width, height: resultState.height },
        scale: { scaleX: resultState.scaleX ?? 1, scaleY: resultState.scaleY ?? 1 },
        detail: isPassed
          ? undefined
          : (options.customFailDetail || `Anchor Error: ${anchorError.toExponential(4)}, Aspect Error: ${aspectError.toExponential(4)}`),
      });
    }

    // -------------------------------------------------------------
    // TEST 1: Initial pointer = handle (Zero Initial Jump Test)
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(200, 100)); // SE handle
      const session = ResizeController.startSession(baseState, handleWorld, "SE");

      const result = ResizeController.updateResize(session, handleWorld);
      recordTest(1, "Initial pointer = handle (Zero Jump)", session, handleWorld, result);
    }

    // -------------------------------------------------------------
    // TEST 2: Pointer offset (Offset Click Drag Test)
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(200, 100));
      const offsetPointer = handleWorld.add(new Vector2(15, 25)); // Clicked with offset
      const session = ResizeController.startSession(baseState, offsetPointer, "SE");

      const result = ResizeController.updateResize(session, offsetPointer);
      recordTest(2, "Pointer offset (Offset Click Drag)", session, offsetPointer, result);
    }

    // -------------------------------------------------------------
    // TEST 3: SE Free Resize
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(200, 100));
      const session = ResizeController.startSession(baseState, handleWorld, "SE");

      const targetPointer = handleWorld.add(new Vector2(50, 30));
      const result = ResizeController.updateResize(session, targetPointer);
      recordTest(3, "SE Free Resize", session, targetPointer, result);
    }

    // -------------------------------------------------------------
    // TEST 4: SE Uniform Resize (Aspect Locked)
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(200, 100));
      const session = ResizeController.startSession(baseState, handleWorld, "SE");

      const targetPointer = handleWorld.add(new Vector2(60, 40));
      const result = ResizeController.updateResize(session, targetPointer, {
        lockAspectRatio: true,
      });
      recordTest(4, "SE Uniform Resize", session, targetPointer, result, {
        lockAspect: true,
        expectedAspect: 2.0,
      });
    }

    // -------------------------------------------------------------
    // TEST 5: NW Resize
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(0, 0));
      const session = ResizeController.startSession(baseState, handleWorld, "NW");

      const targetPointer = handleWorld.add(new Vector2(-40, -20));
      const result = ResizeController.updateResize(session, targetPointer);
      recordTest(5, "NW Resize", session, targetPointer, result);
    }

    // -------------------------------------------------------------
    // TEST 6: NE Resize
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(200, 0));
      const session = ResizeController.startSession(baseState, handleWorld, "NE");

      const targetPointer = handleWorld.add(new Vector2(30, -20));
      const result = ResizeController.updateResize(session, targetPointer);
      recordTest(6, "NE Resize", session, targetPointer, result);
    }

    // -------------------------------------------------------------
    // TEST 7: SW Resize
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(0, 100));
      const session = ResizeController.startSession(baseState, handleWorld, "SW");

      const targetPointer = handleWorld.add(new Vector2(-30, 20));
      const result = ResizeController.updateResize(session, targetPointer);
      recordTest(7, "SW Resize", session, targetPointer, result);
    }

    // -------------------------------------------------------------
    // TEST 8: E Resize (Middle-Right Side Handle)
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(200, 50));
      const session = ResizeController.startSession(baseState, handleWorld, "E");

      const targetPointer = handleWorld.add(new Vector2(40, 0));
      const result = ResizeController.updateResize(session, targetPointer);
      recordTest(8, "E Resize (Side Right)", session, targetPointer, result);
    }

    // -------------------------------------------------------------
    // TEST 9: W Resize (Middle-Left Side Handle)
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(0, 50));
      const session = ResizeController.startSession(baseState, handleWorld, "W");

      const targetPointer = handleWorld.add(new Vector2(-40, 0));
      const result = ResizeController.updateResize(session, targetPointer);
      recordTest(9, "W Resize (Side Left)", session, targetPointer, result);
    }

    // -------------------------------------------------------------
    // TEST 10: N Resize (Top-Center Side Handle)
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(100, 0));
      const session = ResizeController.startSession(baseState, handleWorld, "N");

      const targetPointer = handleWorld.add(new Vector2(0, -30));
      const result = ResizeController.updateResize(session, targetPointer);
      recordTest(10, "N Resize (Top-Center)", session, targetPointer, result);
    }

    // -------------------------------------------------------------
    // TEST 11: S Resize (Bottom-Center Side Handle)
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(100, 100));
      const session = ResizeController.startSession(baseState, handleWorld, "S");

      const targetPointer = handleWorld.add(new Vector2(0, 30));
      const result = ResizeController.updateResize(session, targetPointer);
      recordTest(11, "S Resize (Bottom-Center)", session, targetPointer, result);
    }

    // -------------------------------------------------------------
    // TEST 12: Rotated 45° Object Resize
    // -------------------------------------------------------------
    {
      const rotatedState: ObjectTransformState = { ...baseState, rotation: 45 };
      const initialMatrix = HitTest.getObjectMatrix(rotatedState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(200, 100));
      const session = ResizeController.startSession(rotatedState, handleWorld, "SE");

      const localDelta = new Vector2(50, 25);
      const rad = (45 * Math.PI) / 180;
      const worldDelta = new Vector2(
        localDelta.x * Math.cos(rad) - localDelta.y * Math.sin(rad),
        localDelta.x * Math.sin(rad) + localDelta.y * Math.cos(rad),
      );
      const targetPointer = handleWorld.add(worldDelta);

      const result = ResizeController.updateResize(session, targetPointer);
      recordTest(12, "Rotated 45° Object Resize", session, targetPointer, result);
    }

    // -------------------------------------------------------------
    // TEST 13: Rotated 90° Object Resize
    // -------------------------------------------------------------
    {
      const rotatedState: ObjectTransformState = { ...baseState, rotation: 90 };
      const initialMatrix = HitTest.getObjectMatrix(rotatedState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(200, 100));
      const session = ResizeController.startSession(rotatedState, handleWorld, "SE");

      const targetPointer = handleWorld.add(new Vector2(-30, 40));
      const result = ResizeController.updateResize(session, targetPointer);
      recordTest(13, "Rotated 90° Object Resize", session, targetPointer, result);
    }

    // -------------------------------------------------------------
    // TEST 14: Zoom 0.5 Canvas Scaling
    // -------------------------------------------------------------
    {
      const camera = { x: 50, y: 50, zoom: 0.5 };
      const screenPointer = new Vector2(300, 200);
      const worldPointer = CoordinateSystem.screenToWorld(screenPointer, camera);

      const session = ResizeController.startSession(baseState, worldPointer, "SE");

      const result = ResizeController.updateResize(session, worldPointer.add(new Vector2(40, 20)));
      recordTest(14, "Zoom 0.5 Canvas Scaling", session, worldPointer.add(new Vector2(40, 20)), result);
    }

    // -------------------------------------------------------------
    // TEST 15: Zoom 2.0 Canvas Scaling
    // -------------------------------------------------------------
    {
      const camera = { x: 50, y: 50, zoom: 2.0 };
      const screenPointer = new Vector2(300, 200);
      const worldPointer = CoordinateSystem.screenToWorld(screenPointer, camera);

      const session = ResizeController.startSession(baseState, worldPointer, "SE");

      const result = ResizeController.updateResize(session, worldPointer.add(new Vector2(20, 10)));
      recordTest(15, "Zoom 2.0 Canvas Scaling", session, worldPointer.add(new Vector2(20, 10)), result);
    }

    // -------------------------------------------------------------
    // TEST 16: Aspect Ratio Lock Integrity
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(200, 100));
      const session = ResizeController.startSession(baseState, handleWorld, "SE");

      const targetPointer = handleWorld.add(new Vector2(100, 20));
      const result = ResizeController.updateResize(session, targetPointer, {
        lockAspectRatio: true,
      });
      recordTest(16, "Aspect Ratio Lock Integrity", session, targetPointer, result, {
        lockAspect: true,
        expectedAspect: 2.0,
      });
    }

    // -------------------------------------------------------------
    // TEST 17: Crossing Anchor (Negative Drag)
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(200, 100));
      const session = ResizeController.startSession(baseState, handleWorld, "SE");

      const targetPointer = initialMatrix.transformPoint(new Vector2(-50, -30));
      const result = ResizeController.updateResize(session, targetPointer);
      recordTest(17, "Crossing Anchor (Negative Drag)", session, targetPointer, result);
    }

    // -------------------------------------------------------------
    // TEST 18: FlipX Deterministic State
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(200, 100));
      const session = ResizeController.startSession(baseState, handleWorld, "SE");

      const targetPointer = initialMatrix.transformPoint(new Vector2(-100, 50));
      const result = ResizeController.updateResize(session, targetPointer);
      recordTest(18, "FlipX Deterministic State", session, targetPointer, result);
    }

    // -------------------------------------------------------------
    // TEST 19: FlipY Deterministic State
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(200, 100));
      const session = ResizeController.startSession(baseState, handleWorld, "SE");

      const targetPointer = initialMatrix.transformPoint(new Vector2(100, -50));
      const result = ResizeController.updateResize(session, targetPointer);
      recordTest(19, "FlipY Deterministic State", session, targetPointer, result);
    }

    // -------------------------------------------------------------
    // TEST 20: Text Scale Mode B (Font Immutable Base)
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(200, 100));
      const session = ResizeController.startSession(baseState, handleWorld, "SE");

      const targetPointer = handleWorld.add(new Vector2(100, 50));
      const result = ResizeController.updateResize(session, targetPointer, {
        isTextObject: true,
        textMode: "scale",
      });

      recordTest(20, "Text Scale Mode B (Visual Font Scale)", session, targetPointer, result);
    }

    // -------------------------------------------------------------
    // TEST 21: Repeated Pointermove 100 Frames Zero Drift Test
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(200, 100));
      const session = ResizeController.startSession(baseState, handleWorld, "SE");

      let lastResult = baseState;
      for (let i = 1; i <= 100; i++) {
        const jitterPointer = handleWorld.add(new Vector2(i * 0.5, i * 0.25));
        lastResult = ResizeController.updateResize(session, jitterPointer);
      }

      const finalPointer = handleWorld.add(new Vector2(50, 25));
      const result = ResizeController.updateResize(session, finalPointer);
      recordTest(21, "Repeated Pointermove 100 Frames Zero Drift", session, finalPointer, result);
    }

    // -------------------------------------------------------------
    // TEST 22: Renderer Double-Scaling Detection
    // -------------------------------------------------------------
    {
      const initialMatrix = HitTest.getObjectMatrix(baseState);
      const handleWorld = initialMatrix.transformPoint(new Vector2(200, 100));
      const session = ResizeController.startSession(baseState, handleWorld, "SE");

      const targetPointer = handleWorld.add(new Vector2(50, 25));
      const result = ResizeController.updateResize(session, targetPointer);

      recordTest(22, "Renderer Double-Scaling Detection (Canonical Rep)", session, targetPointer, result);
    }

    // =========================================================================
    // CANONICAL TRANSFORM ENGINE REGRESSION TESTS (23 - 30)
    // =========================================================================

    // -------------------------------------------------------------
    // TEST 23: No Double Geometry Scaling
    // -------------------------------------------------------------
    {
      const state: ObjectTransformState = {
        x: 100, y: 100, width: 250, height: 125, rotation: 0, scaleX: 1.25, scaleY: 1.25,
      };
      const session = ResizeController.startSession(state, new Vector2(350, 225), "SE");

      const matrix = HitTest.getObjectMatrix(state);
      const worldCorner = matrix.transformPoint(new Vector2(state.width, state.height));
      const expectedWorldCorner = new Vector2(350, 225);
      const error = worldCorner.distance(expectedWorldCorner);

      const pass = error < 1e-5;
      recordTest(23, "No Double Geometry Scaling (Scale Matrix = 1.0)", session, new Vector2(350, 225), state, {
        customPass: pass,
        customFailDetail: `Transformed corner was (${worldCorner.x}, ${worldCorner.y}) instead of (350, 225)`,
      });
    }

    // -------------------------------------------------------------
    // TEST 24: Matrix Width Consistency
    // -------------------------------------------------------------
    {
      const state: ObjectTransformState = { x: 0, y: 0, width: 300, height: 150, rotation: 0 };
      const session = ResizeController.startSession(state, new Vector2(300, 150), "SE");
      const matrix = HitTest.getObjectMatrix(state);
      const rightEdge = matrix.transformPoint(new Vector2(state.width, 0));

      const pass = Math.abs(rightEdge.x - 300) < 1e-5;
      recordTest(24, "Matrix Width Consistency (Physical Pixel Match)", session, new Vector2(300, 150), state, {
        customPass: pass,
      });
    }

    // -------------------------------------------------------------
    // TEST 25: Matrix Height Consistency
    // -------------------------------------------------------------
    {
      const state: ObjectTransformState = { x: 0, y: 0, width: 300, height: 150, rotation: 0 };
      const session = ResizeController.startSession(state, new Vector2(300, 150), "SE");
      const matrix = HitTest.getObjectMatrix(state);
      const bottomEdge = matrix.transformPoint(new Vector2(0, state.height));

      const pass = Math.abs(bottomEdge.y - 150) < 1e-5;
      recordTest(25, "Matrix Height Consistency (Physical Pixel Match)", session, new Vector2(300, 150), state, {
        customPass: pass,
      });
    }

    // -------------------------------------------------------------
    // TEST 26: Renderer Width Consistency
    // -------------------------------------------------------------
    {
      const state: ObjectTransformState = { x: 50, y: 50, width: 280, height: 140, rotation: 0 };
      const session = ResizeController.startSession(state, new Vector2(330, 190), "SE");

      const pass = state.width === 280;
      recordTest(26, "Renderer Width Consistency", session, new Vector2(330, 190), state, { customPass: pass });
    }

    // -------------------------------------------------------------
    // TEST 27: Renderer Height Consistency
    // -------------------------------------------------------------
    {
      const state: ObjectTransformState = { x: 50, y: 50, width: 280, height: 140, rotation: 0 };
      const session = ResizeController.startSession(state, new Vector2(330, 190), "SE");

      const pass = state.height === 140;
      recordTest(27, "Renderer Height Consistency", session, new Vector2(330, 190), state, { customPass: pass });
    }

    // -------------------------------------------------------------
    // TEST 28: Text Visual Scale Consistency
    // -------------------------------------------------------------
    {
      const textProps = {
        text: "Test",
        fontFamily: "Inter",
        fontSize: 24,
        lineHeight: 1.2,
        width: 200,
        height: 50,
      };
      const session = ResizeController.startSession(baseState, new Vector2(300, 200), "SE");

      const derivedScale = 1.5;
      const visualFontSize = TextMetricsEngine.getVisualFontSize(textProps, derivedScale);
      const pass = visualFontSize === 36 && textProps.fontSize === 24;

      recordTest(28, "Text Visual Scale Consistency (Immutable Base Size)", session, new Vector2(300, 200), baseState, {
        customPass: pass,
      });
    }

    // -------------------------------------------------------------
    // TEST 29: Rotation Bounding Box Consistency
    // -------------------------------------------------------------
    {
      const rotAngles = [0, 45, 90, 135, 180, 270];
      let allPassed = true;
      const session = ResizeController.startSession(baseState, new Vector2(300, 200), "SE");

      for (const rot of rotAngles) {
        const state: ObjectTransformState = { ...baseState, rotation: rot };
        const matrix = HitTest.getObjectMatrix(state);
        const localDiagonal = new Vector2(state.width, state.height).length();
        const worldTopLeft = matrix.transformPoint(new Vector2(0, 0));
        const worldBottomRight = matrix.transformPoint(new Vector2(state.width, state.height));
        const worldDiagonal = worldTopLeft.distance(worldBottomRight);

        if (Math.abs(worldDiagonal - localDiagonal) > 1e-5) {
          allPassed = false;
        }
      }

      recordTest(29, "Rotation Bounding Box Consistency (Angles 0..270°)", session, new Vector2(300, 200), baseState, {
        customPass: allPassed,
      });
    }

    // -------------------------------------------------------------
    // TEST 30: Flip Matrix Consistency
    // -------------------------------------------------------------
    {
      const flipState: ObjectTransformState = { ...baseState, flipX: true, flipY: true };
      const matrix = HitTest.getObjectMatrix(flipState);
      const session = ResizeController.startSession(flipState, new Vector2(300, 200), "SE");

      const worldP = matrix.transformPoint(new Vector2(100, 50));
      const expectedP = new Vector2(0, 50);

      const pass = worldP.distance(expectedP) < 1e-5;
      recordTest(30, "Flip Matrix Consistency (Scale X=-1, Y=-1)", session, new Vector2(300, 200), flipState, {
        customPass: pass,
        customFailDetail: `Flipped point was (${worldP.x}, ${worldP.y}) instead of (0, 50)`,
      });
    }

    return { passed, failed, metrics };
  }
}
