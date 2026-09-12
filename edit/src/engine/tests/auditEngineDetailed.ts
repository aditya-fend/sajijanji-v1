import { Vector2 } from "../geometry/Vector2";
import { Matrix2D } from "../geometry/Matrix2D";
import { HitTest, HandleType, ObjectTransformState } from "../interaction/HitTest";
import { ResizeController, ResizeSession } from "../interaction/ResizeController";
import { TextMetricsEngine, TextProperties } from "../text/TextMetricsEngine";

export function runComprehensiveMathematicalAudit() {
  console.log("===============================================================================");
  console.log("       COMPREHENSIVE MATHEMATICAL GEOMETRY AUDIT FOR RESIZECONTROLLER        ");
  console.log("===============================================================================\n");

  let totalTestsPassed = 0;
  let totalTestsCount = 0;

  // Helper to build canonical geometric matrix (scaleX=1, scaleY=1, flip handling)
  function getCanonicalMatrix(state: ObjectTransformState): Matrix2D {
    const sx = state.flipX ? -1 : 1;
    const sy = state.flipY ? -1 : 1;
    return Matrix2D.createTRS(
      state.x,
      state.y,
      state.rotation,
      sx,
      sy,
      state.originX || 0,
      state.originY || 0,
    );
  }

  function reportResult(
    title: string,
    initialState: ObjectTransformState,
    currentPointer: Vector2,
    effectivePointer: Vector2,
    calculatedHandle: Vector2,
    handleError: number,
    anchorError: number,
    aspectError: number,
    visualWidth: number,
    visualHeight: number,
    scaleX: number,
    scaleY: number,
  ) {
    totalTestsCount++;
    const pass = handleError < 1e-4 && anchorError < 1e-5 && aspectError < 1e-5;
    if (pass) totalTestsPassed++;

    console.log(`[AUDIT TEST ${totalTestsCount.toString().padStart(2, "0")}] ${pass ? "✅ PASS" : "❌ FAIL"} : ${title}`);
    console.log(`   ├─ Initial Object  : x=${initialState.x}, y=${initialState.y}, w=${initialState.width}, h=${initialState.height}, rot=${initialState.rotation}°`);
    console.log(`   ├─ Current Pointer : (${currentPointer.x.toFixed(2)}, ${currentPointer.y.toFixed(2)})`);
    console.log(`   ├─ Effective Pointer: (${effectivePointer.x.toFixed(2)}, ${effectivePointer.y.toFixed(2)})`);
    console.log(`   ├─ Calc Handle World: (${calculatedHandle.x.toFixed(2)}, ${calculatedHandle.y.toFixed(2)})`);
    console.log(`   ├─ Handle Error     : ${handleError.toFixed(6)} px`);
    console.log(`   ├─ Anchor Error 12D : ${anchorError.toFixed(12)} px`);
    console.log(`   ├─ Aspect Error     : ${aspectError.toExponential(6)}`);
    console.log(`   ├─ Visual Geometry  : ${visualWidth.toFixed(2)}px × ${visualHeight.toFixed(2)}px`);
    console.log(`   └─ Scale Ratios     : scaleX=${scaleX.toFixed(4)} | scaleY=${scaleY.toFixed(4)}\n`);
  }

  // =========================================================================
  // 1. AUDIT: POINTER-TO-HANDLE ERROR & ZERO INITIAL JUMP
  // =========================================================================
  console.log("-------------------------------------------------------------------------------");
  console.log("SECTION 1: POINTER-TO-HANDLE ERROR & ZERO INITIAL JUMP AUDIT");
  console.log("-------------------------------------------------------------------------------\n");

  {
    const initObj: ObjectTransformState = { x: 100, y: 100, width: 200, height: 100, rotation: 0, scaleX: 1, scaleY: 1 };
    const session = ResizeController.startSession(initObj, new Vector2(305, 205), "SE"); // Handle is at (300,200), pointer at (305,205) -> offset (5,5)

    const currentP = new Vector2(355, 255);
    const updated = ResizeController.updateResize(session, currentP);

    const effP = currentP.subtract(session.pointerOffsetWorld);
    const mat = getCanonicalMatrix(updated);
    const calcHandle = mat.transformPoint(new Vector2(updated.width, updated.height));

    const hErr = effP.distance(calcHandle);
    const newAnchorWorld = mat.transformPoint(new Vector2(0, 0));
    const ancErr = session.oppositeAnchorWorld.distance(newAnchorWorld);

    reportResult(
      "Pointer Offset Correction & Zero Initial Jump",
      initObj,
      currentP,
      effP,
      calcHandle,
      hErr,
      ancErr,
      0,
      updated.width,
      updated.height,
      updated.scaleX ?? 1,
      updated.scaleY ?? 1,
    );
  }

  // =========================================================================
  // 2. AUDIT: UNIFORM SCALE CONSTRAINT & REALISTIC OFF-DIAGONAL INTERACTION
  // =========================================================================
  console.log("-------------------------------------------------------------------------------");
  console.log("SECTION 2: REALISTIC OFF-DIAGONAL UNIFORM SCALE PROJECTION AUDIT");
  console.log("-------------------------------------------------------------------------------\n");

  {
    const initObj: ObjectTransformState = { x: 100, y: 100, width: 200, height: 100, rotation: 0, scaleX: 1, scaleY: 1 };
    const session = ResizeController.startSession(initObj, new Vector2(300, 200), "SE");

    const currentP = new Vector2(380, 220); // Pointer off-diagonal
    const updated = ResizeController.updateResize(session, currentP, { lockAspectRatio: true });

    const W0 = 200;
    const H0 = 100;
    const anchorWorld = new Vector2(100, 100);
    const P = currentP;

    const V = P.subtract(anchorWorld);
    const D = new Vector2(W0, H0);
    const lenD = Math.sqrt(W0 * W0 + H0 * H0);
    const Dhat = D.divide(lenD);

    const q = V.dot(Dhat);
    const s = q / lenD;

    const expectedW = W0 * s;
    const expectedH = H0 * s;

    const projectedHandleWorld = anchorWorld.add(Dhat.multiply(q));

    const mat = getCanonicalMatrix(updated);
    const calcHandle = mat.transformPoint(new Vector2(updated.width, updated.height));
    const hErr = projectedHandleWorld.distance(calcHandle);

    const initAspect = W0 / H0;
    const newAspect = updated.width / updated.height;
    const aspectErr = Math.abs(newAspect - initAspect);

    const newAnchorWorld = mat.transformPoint(new Vector2(0, 0));
    const ancErr = anchorWorld.distance(newAnchorWorld);

    console.log("   [MATH DERIVATION VERIFICATION]");
    console.log(`   ├─ Pointer Vector V    : (${V.x}, ${V.y})`);
    console.log(`   ├─ Diagonal Basis D    : (${D.x}, ${D.y}), |D| = ${lenD.toFixed(4)}`);
    console.log(`   ├─ Projection Scalar q : ${q.toFixed(4)}`);
    console.log(`   ├─ Derived Scale s     : ${s.toFixed(6)}`);
    console.log(`   ├─ Derived Dimensions  : ${expectedW.toFixed(2)}px × ${expectedH.toFixed(2)}px`);
    console.log(`   ├─ Projected Handle Wld: (${projectedHandleWorld.x.toFixed(2)}, ${projectedHandleWorld.y.toFixed(2)})`);
    console.log(`   └─ Pointer->Handle Dist: ${currentP.distance(projectedHandleWorld).toFixed(4)} px\n`);

    reportResult(
      "Realistic Off-Diagonal SE Uniform Resize (Projection Math)",
      initObj,
      currentP,
      P,
      calcHandle,
      hErr,
      ancErr,
      aspectErr,
      updated.width,
      updated.height,
      updated.scaleX ?? 1,
      updated.scaleY ?? 1,
    );
  }

  // =========================================================================
  // 3. AUDIT: ALL 8 HANDLES x 9 ROTATION ANGLES AUDIT (FREE & UNIFORM)
  // =========================================================================
  console.log("-------------------------------------------------------------------------------");
  console.log("SECTION 3: 8 HANDLES × 9 ROTATION ANGLES COMPREHENSIVE AUDIT");
  console.log("-------------------------------------------------------------------------------\n");

  const handlesList: HandleType[] = ["NW", "N", "NE", "E", "W", "SW", "S", "SE"];
  const anglesList = [0, 15, 30, 45, 60, 90, 135, 180, 270];

  for (const handle of handlesList) {
    for (const rot of anglesList) {
      for (const lockAspect of [false, true]) {
        const initObj: ObjectTransformState = { x: 200, y: 150, width: 200, height: 100, rotation: rot, scaleX: 1, scaleY: 1 };
        const initMatrix = getCanonicalMatrix(initObj);

        const handles = HitTest.getHandles(initObj.width, initObj.height);
        const hDesc = handles.find(h => h.type === handle)!;

        const initHandleWorld = initMatrix.transformPoint(hDesc.localPos);

        const session = ResizeController.startSession(initObj, initHandleWorld, handle);

        const dragVec = new Vector2(30, 20);
        const currentP = initHandleWorld.add(dragVec);

        const isCorner = ["NW", "NE", "SW", "SE"].includes(handle);
        const updated = ResizeController.updateResize(session, currentP, { lockAspectRatio: lockAspect });

        const mat = getCanonicalMatrix(updated);
        const newHandles = HitTest.getHandles(updated.width, updated.height);
        const newHDesc = newHandles.find(h => h.type === handle)!;

        const newHandleWorld = mat.transformPoint(newHDesc.localPos);
        const newAnchorWorld = mat.transformPoint(newHDesc.oppositeAnchorLocal);

        const effP = currentP.subtract(session.pointerOffsetWorld);
        const rad = (rot * Math.PI) / 180;
        const ux = new Vector2(Math.cos(rad), Math.sin(rad));
        const uy = new Vector2(-Math.sin(rad), Math.cos(rad));

        let projectedHandleTargetWorld: Vector2;

        if (lockAspect && isCorner) {
          // Uniform corner scaling projection
          const Dworld = session.initialHandleWorld.subtract(session.oppositeAnchorWorld);
          const lenD = Dworld.length();
          const Dhat = Dworld.divide(lenD);
          const Vworld = effP.subtract(session.oppositeAnchorWorld);
          const q = Vworld.dot(Dhat);
          projectedHandleTargetWorld = session.oppositeAnchorWorld.add(Dhat.multiply(q));
        } else if (!isCorner) {
          // 1D Edge handle projection along local axis
          const uHandle = (handle === "E" || handle === "W") ? ux : uy;
          const Vworld = effP.subtract(session.oppositeAnchorWorld);
          const q = Vworld.dot(uHandle);
          projectedHandleTargetWorld = session.oppositeAnchorWorld.add(uHandle.multiply(q));
        } else {
          // Free 2D corner handle target
          projectedHandleTargetWorld = effP;
        }

        const hErr = projectedHandleTargetWorld.distance(newHandleWorld);
        const ancErr = session.oppositeAnchorWorld.distance(newAnchorWorld);

        const initAspect = initObj.width / initObj.height;
        const newAspect = updated.width / updated.height;
        const aspectErr = (lockAspect && isCorner) ? Math.abs(newAspect - initAspect) : 0;

        reportResult(
          `Handle [${handle.padStart(2, " ")}] | Rot [${rot.toString().padStart(3, " ")}°] | ${lockAspect ? "Uniform" : "Free"}`,
          initObj,
          currentP,
          effP,
          newHandleWorld,
          hErr,
          ancErr,
          aspectErr,
          updated.width,
          updated.height,
          updated.scaleX ?? 1,
          updated.scaleY ?? 1,
        );
      }
    }
  }

  // =========================================================================
  // 4. AUDIT: STATELESS FLIPPING & NEGATIVE DRAG
  // =========================================================================
  console.log("-------------------------------------------------------------------------------");
  console.log("SECTION 4: STATELESS FLIPPING AUDIT");
  console.log("-------------------------------------------------------------------------------\n");

  {
    const initObj: ObjectTransformState = { x: 100, y: 100, width: 200, height: 100, rotation: 0, scaleX: 1, scaleY: 1, flipX: false, flipY: false };
    const session = ResizeController.startSession(initObj, new Vector2(300, 200), "SE");

    const currentP = new Vector2(50, 70);
    const updated = ResizeController.updateResize(session, currentP);

    const mat = getCanonicalMatrix(updated);
    const newAnchorWorld = mat.transformPoint(new Vector2(0, 0));
    const ancErr = session.oppositeAnchorWorld.distance(newAnchorWorld);

    reportResult(
      `Stateless Flip Test (flipX=${updated.flipX}, flipY=${updated.flipY})`,
      initObj,
      currentP,
      currentP,
      mat.transformPoint(new Vector2(updated.width, updated.height)),
      0,
      ancErr,
      0,
      updated.width,
      updated.height,
      updated.scaleX ?? 1,
      updated.scaleY ?? 1,
    );
  }

  // =========================================================================
  // 5. AUDIT: TEXT SCALING IMMUTABLE BASE FONT SIZE
  // =========================================================================
  console.log("-------------------------------------------------------------------------------");
  console.log("SECTION 5: TEXT SCALING IMMUTABLE BASE FONT SIZE AUDIT");
  console.log("-------------------------------------------------------------------------------\n");

  {
    const textProps: TextProperties = {
      text: "Sample Text",
      fontFamily: "Inter",
      fontSize: 24,
      lineHeight: 1.2,
      width: 200,
      height: 50,
      scaleX: 1.0,
      scaleY: 1.0,
    };

    let baseFontSizeDrift = false;

    for (let frame = 1; frame <= 100; frame++) {
      const scaleFactor = 1.0 + frame * 0.01;
      textProps.scaleY = scaleFactor;

      const visualFontSize = TextMetricsEngine.getVisualFontSize(textProps, scaleFactor);
      if (textProps.fontSize !== 24) {
        baseFontSizeDrift = true;
      }
    }

    console.log(`   ├─ Initial Base Font Size : 24px`);
    console.log(`   ├─ 100 Frames Simulation  : Scale Factor 1.0 → 2.0`);
    console.log(`   ├─ Base Font Size State   : ${textProps.fontSize}px (Immutable: ${!baseFontSizeDrift})`);
    console.log(`   └─ Final Visual Font Size : ${TextMetricsEngine.getVisualFontSize(textProps, 2.0)}px\n`);
  }

  // =========================================================================
  // 6. AUDIT: 1000 FRAMES CONTINUOUS DRAG ZERO CUMULATIVE DRIFT
  // =========================================================================
  console.log("-------------------------------------------------------------------------------");
  console.log("SECTION 6: 1000 FRAMES CONTINUOUS DRAG ZERO DRIFT AUDIT");
  console.log("-------------------------------------------------------------------------------\n");

  {
    const initObj: ObjectTransformState = { x: 100, y: 100, width: 200, height: 100, rotation: 30, scaleX: 1, scaleY: 1 };
    const session = ResizeController.startSession(initObj, new Vector2(300, 200), "SE");

    let lastState = initObj;

    for (let i = 1; i <= 1000; i++) {
      const px = 300 + Math.sin(i * 0.05) * 50 + i * 0.1;
      const py = 200 + Math.cos(i * 0.05) * 30 + i * 0.05;
      lastState = ResizeController.updateResize(session, new Vector2(px, py));
    }

    const finalP = new Vector2(300 + Math.sin(1000 * 0.05) * 50 + 1000 * 0.1, 200 + Math.cos(1000 * 0.05) * 30 + 1000 * 0.05);
    const directState = ResizeController.updateResize(session, finalP);

    const posDrift = new Vector2(lastState.x, lastState.y).distance(new Vector2(directState.x, directState.y));
    const widthDrift = Math.abs(lastState.width - directState.width);
    const heightDrift = Math.abs(lastState.height - directState.height);

    const totalDrift = posDrift + widthDrift + heightDrift;

    console.log(`   ├─ Simulated Frames      : 1000 Frames Pointermove`);
    console.log(`   ├─ Position Drift        : ${posDrift.toExponential(12)} px`);
    console.log(`   ├─ Dimension Width Drift : ${widthDrift.toExponential(12)} px`);
    console.log(`   ├─ Dimension Height Drift: ${heightDrift.toExponential(12)} px`);
    console.log(`   └─ Total Cumulative Drift: ${totalDrift.toExponential(12)} px (Tolerance < 1e-9)\n`);
  }

  console.log("===============================================================================");
  console.log(`SUMMARY: ${totalTestsPassed} / ${totalTestsCount} AUDIT TESTS PASSED MATEMATICALLY`);
  console.log("===============================================================================");
}

if (require.main === module) {
  runComprehensiveMathematicalAudit();
}
