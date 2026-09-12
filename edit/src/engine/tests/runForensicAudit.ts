import { ForensicAuditSuite } from "./forensicAuditSuite";

function runForensicAudit() {
  console.log("===============================================================================");
  console.log("          FINAL FORENSIC AUDIT — CANONICAL 2D TRANSFORM ENGINE                ");
  console.log("===============================================================================\n");

  // 1. RUN SE OFF-DIAGONAL MATHEMATICAL PROOF (SECTION 2 & 13)
  console.log("-------------------------------------------------------------------------------");
  console.log("SECTION A: NUMERICAL PROOF — SE UNIFORM CORNER OFF-DIAGONAL SCALING");
  console.log("-------------------------------------------------------------------------------\n");

  const proof = ForensicAuditSuite.runOffDiagonalSEProof();
  console.log(`   ├─ Raw Mouse Pointer P        : (${proof.pointerWorld.x.toFixed(2)}, ${proof.pointerWorld.y.toFixed(2)})`);
  console.log(`   ├─ Projected Handle P_proj    : (${proof.projectedHandleWorld.x.toFixed(2)}, ${proof.projectedHandleWorld.y.toFixed(2)})`);
  console.log(`   ├─ Pointer-to-Handle Dist     : ${proof.pointerToHandleDistance.toFixed(8)} px (Expected ~ 17.88854382 px)`);
  console.log(`   ├─ Orthogonal Projection Err  : ${proof.orthogonalProjectionError.toFixed(8)} px (Assertion: |(P-P_proj) · D| == 0)`);
  console.log(`   ├─ Aspect Ratio Error         : ${proof.aspectError.toExponential(6)} (Assertion: 272/136 == 200/100)`);
  console.log(`   ├─ Anchor Error (12 Decimals) : ${proof.anchorError12Dec.toFixed(12)} px (Assertion: NW Anchor (100,100) Invariant)`);
  console.log(`   └─ Proof Status               : ${proof.passed ? "✅ MATHEMATICALLY VERIFIED" : "❌ FAILED"}\n`);

  // 2. RUN 640 MATRIX SCENARIOS (SECTION 4, 6, 7, 12)
  console.log("-------------------------------------------------------------------------------");
  console.log("SECTION B: 640 SCENARIOS COMPREHENSIVE MATRIX AUDIT (8 Handles × 10 Rotations × 4 Zooms × 2 Modes)");
  console.log("-------------------------------------------------------------------------------\n");

  const matrixAudit = ForensicAuditSuite.runFullMatrixAudit();
  console.log(`   ├─ Total Test Scenarios       : ${matrixAudit.totalScenarios}`);
  console.log(`   ├─ Scenarios Passed           : ${matrixAudit.passedScenarios}`);
  console.log(`   ├─ Scenarios Failed           : ${matrixAudit.failedScenarios}`);

  if (matrixAudit.failedScenarios > 0) {
    console.log("\n   [FAILING SCENARIO SAMPLES]");
    const failedList = matrixAudit.results.filter((r) => !r.passed);
    failedList.slice(0, 10).forEach((f, idx) => {
      console.log(`   [${idx + 1}] Handle: ${f.handle.padStart(2, " ")} | Rot: ${f.rotationDeg.toString().padStart(3, " ")}° | Zoom: ${f.zoom}x | Mode: ${f.mode}`);
      console.log(`       ├─ Rendered Handle Error : ${f.renderedHandleError.toFixed(6)} px`);
      console.log(`       ├─ Anchor Error (12Dec)  : ${f.anchorError12Dec.toFixed(12)} px`);
      console.log(`       ├─ Orthogonal Proj Err   : ${f.orthogonalProjectionError.toFixed(6)} px`);
      console.log(`       └─ Aspect Error          : ${f.aspectError.toExponential(6)}`);
    });
  }

  console.log(`   └─ Matrix Status              : ${matrixAudit.failedScenarios === 0 ? "✅ 100% MATRIX CONSISTENT" : "❌ FAIL"}\n`);

  // 3. RUN 1000 FRAMES CONTINUOUS TRAJECTORY DRIFT AUDIT (SECTION 9, 14, 15)
  console.log("-------------------------------------------------------------------------------");
  console.log("SECTION C: 1000-FRAME CONTINUOUS TRAJECTORY DRIFT & TYPOGRAPHY AUDIT");
  console.log("-------------------------------------------------------------------------------\n");

  const driftAudit = ForensicAuditSuite.runLongTrajectoryDriftAudit();
  console.log(`   ├─ Simulated Pointer Frames   : ${driftAudit.totalFrames}`);
  console.log(`   ├─ Max Position Drift         : ${driftAudit.maxPosDrift.toExponential(12)} px`);
  console.log(`   ├─ Max Width Drift            : ${driftAudit.maxWidthDrift.toExponential(12)} px`);
  console.log(`   ├─ Max Height Drift           : ${driftAudit.maxHeightDrift.toExponential(12)} px`);
  console.log(`   ├─ baseFontSize Immutable     : ${driftAudit.baseFontSizeImmutable ? "true (24px)" : "false"}`);
  console.log(`   ├─ Flip Deterministic         : ${driftAudit.flipDeterministic ? "true (Stateless)" : "false"}`);
  console.log(`   └─ Drift Audit Status         : ${driftAudit.passed ? "✅ ZERO DRIFT VERIFIED" : "❌ FAILED"}\n`);

  console.log("===============================================================================");
  if (proof.passed && matrixAudit.failedScenarios === 0 && driftAudit.passed) {
    console.log("VERDICT: PASS — MATHEMATICALLY VERIFIED");
  } else {
    console.log("VERDICT: FAIL — REQUIRES FIX");
  }
  console.log("===============================================================================");
}

runForensicAudit();
