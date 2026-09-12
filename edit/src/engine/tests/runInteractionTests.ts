import { InteractionSuite } from "./interactionSuite";

function runInteractionSuite() {
  console.log("==================================================");
  console.log("CANONICAL 2D TRANSFORM ENGINE - UI INTERACTION SUITE");
  console.log("==================================================\n");

  const results = InteractionSuite.runAllTests();
  let passedCount = 0;
  let failedCount = 0;

  for (const r of results) {
    if (r.passed) {
      console.log(`[ PASS ] ${r.name}`);
      console.log(`         ${r.message}`);
      passedCount++;
    } else {
      console.log(`[ FAIL ] ${r.name}`);
      console.log(`         ERROR: ${r.message}`);
      failedCount++;
    }
  }

  console.log("\n--------------------------------------------------");
  console.log(`TOTAL INTERACTION TESTS: ${results.length}`);
  console.log(`PASSED: ${passedCount}`);
  console.log(`FAILED: ${failedCount}`);
  console.log("--------------------------------------------------\n");

  if (failedCount === 0) {
    console.log("FINAL VERDICT: PASS — PRODUCTION-READY UI INTERACTION ENGINE\n");
    process.exit(0);
  } else {
    console.log("FINAL VERDICT: FAIL — REQUIRES FIX\n");
    process.exit(1);
  }
}

runInteractionSuite();
