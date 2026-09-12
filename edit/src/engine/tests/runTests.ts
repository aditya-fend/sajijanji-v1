import { TransformEngineTest } from "./TransformEngineTest";

function run() {
  console.log("===============================================================================");
  console.log("             CANONICAL 2D TRANSFORM ENGINE AUTOMATED AUDIT SUITE              ");
  console.log("===============================================================================\n");

  const { passed, failed, metrics } = TransformEngineTest.runAllAuditTests();

  metrics.forEach((m) => {
    const status = m.passed ? "✅ PASS" : "❌ FAIL";
    console.log(`[TEST ${m.testId.toString().padStart(2, "0")}] ${status} : ${m.testName}`);
    console.log(`   ├─ Initial State  : x=${m.initialState.x}, y=${m.initialState.y}, w=${m.initialState.width}, h=${m.initialState.height}, rot=${m.initialState.rotation}°`);
    console.log(`   ├─ Current Pointer: (${m.pointer.x.toFixed(2)}, ${m.pointer.y.toFixed(2)})`);
    console.log(`   ├─ Handle Test    : Expected=${m.expectedHandle} | Actual=${m.actualHandle}`);
    console.log(`   ├─ Anchor Error   : ${m.anchorError.toFixed(6)}e+0 (Tolerance: < 1e-5)`);
    console.log(`   ├─ Aspect Error   : ${m.aspectError.toFixed(6)}e+0 (Tolerance: < 1e-6)`);
    console.log(`   ├─ Visual Geometry: Width=${m.visualSize.width.toFixed(2)}px | Height=${m.visualSize.height.toFixed(2)}px`);
    console.log(`   └─ Scale Ratio    : scaleX=${m.scale.scaleX.toFixed(4)} | scaleY=${m.scale.scaleY.toFixed(4)}\n`);
  });

  console.log("===============================================================================");
  console.log(`AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${metrics.length} AUDIT TESTS)`);
  console.log("===============================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

run();
