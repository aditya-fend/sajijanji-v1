import { Vector2 } from "../geometry/Vector2";
import { HitTest, ObjectTransformState, HandleType } from "../interaction/HitTest";
import { ResizeController } from "../interaction/ResizeController";
import { InteractionStateMachine, InteractionState } from "../interaction/InteractionStateMachine";

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: Record<string, any>;
}

export class InteractionSuite {
  public static runAllTests(): TestResult[] {
    const results: TestResult[] = [];

    results.push(this.testStateMachineTransitions());
    results.push(this.testTextEditStateIsolation());
    results.push(this.testZoomInvariantHitTesting());
    results.push(this.testRotatedCursorAngles());
    results.push(this.testZeroInitialJumpPointerOffset());
    results.push(this.testAnchorVisualPrecision());
    results.push(this.testRenderedHandleScreenAccuracy());

    return results;
  }

  /**
   * 1. Test Interaction State Machine Transitions
   */
  private static testStateMachineTransitions(): TestResult {
    const machine = new InteractionStateMachine();

    if (machine.getState() !== InteractionState.IDLE) {
      return { name: "State Machine Initial State", passed: false, message: `Expected IDLE, got ${machine.getState()}` };
    }

    machine.transitionTo(InteractionState.HOVER_OBJECT, "obj-1");
    if (machine.getState() !== InteractionState.HOVER_OBJECT) {
      return { name: "State Machine Hover Object", passed: false, message: "Failed to transition to HOVER_OBJECT" };
    }

    machine.transitionTo(InteractionState.SELECTED, "obj-1");
    if (machine.getState() !== InteractionState.SELECTED) {
      return { name: "State Machine Select Object", passed: false, message: "Failed to transition to SELECTED" };
    }

    machine.transitionTo(InteractionState.RESIZING, "obj-1", "SE");
    if (machine.getState() !== InteractionState.RESIZING) {
      return { name: "State Machine Start Resizing", passed: false, message: "Failed to transition to RESIZING" };
    }

    machine.transitionTo(InteractionState.SELECTED, "obj-1");
    if (machine.getState() !== InteractionState.SELECTED) {
      return { name: "State Machine End Resizing", passed: false, message: "Failed to transition back to SELECTED" };
    }

    return { name: "State Machine Transitions", passed: true, message: "All state machine transitions executed deterministically." };
  }

  /**
   * 2. Test Text Editing Isolation (Guards against resize stealing events during text edit)
   */
  private static testTextEditStateIsolation(): TestResult {
    const machine = new InteractionStateMachine();

    machine.transitionTo(InteractionState.SELECTED, "text-1");
    machine.transitionTo(InteractionState.TEXT_EDITING, "text-1");

    if (machine.canStartDrag()) {
      return { name: "Text Edit Isolation", passed: false, message: "canStartDrag() should return false during TEXT_EDITING" };
    }

    const startResizeAttempt = machine.transitionTo(InteractionState.RESIZING, "text-1", "SE");
    if (startResizeAttempt || machine.getState() === InteractionState.RESIZING) {
      return { name: "Text Edit Isolation", passed: false, message: "TEXT_EDITING state allowed transition to RESIZING!" };
    }

    return { name: "Text Edit Isolation", passed: true, message: "TEXT_EDITING state successfully isolates handles and prevents drag stealing." };
  }

  /**
   * 3. Test Zoom-Invariant Screen Hit Area Testing (0.5x, 1x, 2x, 4x)
   */
  private static testZoomInvariantHitTesting(): TestResult {
    const state: ObjectTransformState = {
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      rotation: 0,
    };

    const matrix = HitTest.getObjectMatrix(state);
    const seHandles = HitTest.getHandles(state.width, state.height);
    const seDesc = seHandles.find((h) => h.type === "SE")!;
    const seWorld = matrix.transformPoint(seDesc.localPos); // (300, 200)

    const zooms = [0.5, 1.0, 2.0, 4.0];
    const hitRadiusPx = 12; // 24px screen hit target diameter

    for (const zoom of zooms) {
      const camera = { x: 0, y: 0, zoom };
      const seScreen = new Vector2(seWorld.x * zoom, seWorld.y * zoom);

      // Point exactly on handle
      const hitCenter = HitTest.hitTestHandles(seScreen, state, camera, hitRadiusPx);
      if (hitCenter !== "SE") {
        return { name: "Zoom Invariant Hit Testing", passed: false, message: `Failed to hit SE handle at center for zoom ${zoom}` };
      }

      // Point offset by 10px screen distance (inside 12px screen radius)
      const seScreenOffset = new Vector2(seScreen.x + 7, seScreen.y + 7); // distance = ~9.89px
      const hitOffset = HitTest.hitTestHandles(seScreenOffset, state, camera, hitRadiusPx);
      if (hitOffset !== "SE") {
        return { name: "Zoom Invariant Hit Testing", passed: false, message: `Failed to hit SE handle at 10px screen offset for zoom ${zoom}` };
      }

      // Point offset by 20px screen distance (outside 12px screen radius)
      const seScreenFar = new Vector2(seScreen.x + 15, seScreen.y + 15); // distance = ~21.2px
      const hitFar = HitTest.hitTestHandles(seScreenFar, state, camera, hitRadiusPx);
      if (hitFar === "SE") {
        return { name: "Zoom Invariant Hit Testing", passed: false, message: `Incorrectly hit SE handle outside hit radius for zoom ${zoom}` };
      }
    }

    return { name: "Zoom Invariant Hit Testing", passed: true, message: "Screen-space handle hit box remains physically constant (24px) across zoom 0.5x to 4x." };
  }

  /**
   * 4. Test Rotated Object Handle Cursor Angles
   */
  private static testRotatedCursorAngles(): TestResult {
    // Unrotated (0 deg): E handle should be ew-resize, N handle should be ns-resize
    const cursorE0 = HitTest.getCursorForHandle("E", 0);
    const cursorN0 = HitTest.getCursorForHandle("N", 0);

    if (cursorE0 !== "ew-resize" || cursorN0 !== "ns-resize") {
      return { name: "Rotated Cursor Angles", passed: false, message: `Expected ew-resize and ns-resize at 0°, got ${cursorE0} & ${cursorN0}` };
    }

    // Rotated 45 deg: E handle (originally 0 deg) rotates to 45 deg -> nesw-resize
    const cursorE45 = HitTest.getCursorForHandle("E", 45);
    if (cursorE45 !== "nesw-resize") {
      return { name: "Rotated Cursor Angles", passed: false, message: `Expected nesw-resize for E handle at 45°, got ${cursorE45}` };
    }

    // Rotated 90 deg: E handle (originally 0 deg) rotates to 90 deg -> ns-resize
    const cursorE90 = HitTest.getCursorForHandle("E", 90);
    if (cursorE90 !== "ns-resize") {
      return { name: "Rotated Cursor Angles", passed: false, message: `Expected ns-resize for E handle at 90°, got ${cursorE90}` };
    }

    return { name: "Rotated Cursor Angles", passed: true, message: "Rotated handle cursors dynamically align with screen orientation across angles." };
  }

  /**
   * 5. Test Zero Initial Jump with Pointer Offset Correction
   */
  private static testZeroInitialJumpPointerOffset(): TestResult {
    const initialState: ObjectTransformState = {
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      rotation: 25,
    };

    const matrix = HitTest.getObjectMatrix(initialState);
    const handles = HitTest.getHandles(initialState.width, initialState.height);
    const seDesc = handles.find((h) => h.type === "SE")!;
    const initialHandleWorld = matrix.transformPoint(seDesc.localPos);

    // Simulate user clicking +8px X and -5px Y away from exact handle center
    const clickedPointerWorld = new Vector2(initialHandleWorld.x + 8, initialHandleWorld.y - 5);

    const session = ResizeController.startSession(initialState, clickedPointerWorld, "SE");

    // Frame 1: Pointer moves 0px (same location as pointerdown)
    const updatedStateFrame1 = ResizeController.updateResize(session, clickedPointerWorld, { lockAspectRatio: false });

    const widthDelta = Math.abs(updatedStateFrame1.width - initialState.width);
    const heightDelta = Math.abs(updatedStateFrame1.height - initialState.height);
    const posXDelta = Math.abs(updatedStateFrame1.x - initialState.x);
    const posYDelta = Math.abs(updatedStateFrame1.y - initialState.y);

    if (widthDelta > 1e-6 || heightDelta > 1e-6 || posXDelta > 1e-6 || posYDelta > 1e-6) {
      return {
        name: "Zero Initial Jump Pointer Offset",
        passed: false,
        message: `Initial jump detected on frame 1! dW=${widthDelta}, dH=${heightDelta}, dX=${posXDelta}, dY=${posYDelta}`,
      };
    }

    return { name: "Zero Initial Jump Pointer Offset", passed: true, message: "Zero initial jump guaranteed on pointerdown regardless of click position inside hit box." };
  }

  /**
   * 6. Test Opposite Anchor Invariance Visual & Mathematical Error (< 0.5px)
   */
  private static testAnchorVisualPrecision(): TestResult {
    const initialState: ObjectTransformState = {
      x: 150,
      y: 200,
      width: 300,
      height: 150,
      rotation: 45,
    };

    const session = ResizeController.startSession(initialState, new Vector2(400, 300), "SE");

    // Simulate 100 random pointer drags
    let maxAnchorError = 0;
    for (let i = 0; i < 100; i++) {
      const draggedPointer = new Vector2(400 + i * 2.5, 300 + i * 1.8);
      const updatedState = ResizeController.updateResize(session, draggedPointer);

      const newMatrix = HitTest.getObjectMatrix(updatedState);
      const newHandles = HitTest.getHandles(updatedState.width, updatedState.height);
      const activeDesc = newHandles.find((h) => h.type === "SE")!;
      const actualAnchorWorld = newMatrix.transformPoint(activeDesc.oppositeAnchorLocal);

      const anchorDist = session.oppositeAnchorWorld.distance(actualAnchorWorld);
      if (anchorDist > maxAnchorError) {
        maxAnchorError = anchorDist;
      }
    }

    if (maxAnchorError > 1e-4) {
      return {
        name: "Anchor Visual Precision",
        passed: false,
        message: `Anchor drift detected! Max error: ${maxAnchorError} px`,
      };
    }

    return {
      name: "Anchor Visual Precision",
      passed: true,
      message: `Opposite anchor remains rock-solid invariant during drag (Max error: ${maxAnchorError.toFixed(12)} px < 0.5px threshold).`,
    };
  }

  /**
   * 7. Test Rendered Handle Screen Accuracy (< 0.5px)
   */
  private static testRenderedHandleScreenAccuracy(): TestResult {
    const initialState: ObjectTransformState = {
      x: 50,
      y: 80,
      width: 250,
      height: 120,
      rotation: 15,
    };

    const session = ResizeController.startSession(initialState, new Vector2(300, 200), "SE");

    const draggedPointer = new Vector2(350, 240);
    const updatedState = ResizeController.updateResize(session, draggedPointer);

    const effPointer = draggedPointer.subtract(session.pointerOffsetWorld);
    const newMatrix = HitTest.getObjectMatrix(updatedState);
    const newHandles = HitTest.getHandles(updatedState.width, updatedState.height);
    const activeDesc = newHandles.find((h) => h.type === "SE")!;
    const actualRenderedHandleWorld = newMatrix.transformPoint(activeDesc.localPos);

    const handleError = effPointer.distance(actualRenderedHandleWorld);

    if (handleError > 1e-4) {
      return {
        name: "Rendered Handle Screen Accuracy",
        passed: false,
        message: `Rendered handle position error: ${handleError} px`,
      };
    }

    return {
      name: "Rendered Handle Screen Accuracy",
      passed: true,
      message: `Actual rendered handle position matches expected position with error = ${handleError.toFixed(6)} px (< 0.5px threshold).`,
    };
  }
}
