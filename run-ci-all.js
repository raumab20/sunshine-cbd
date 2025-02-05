// ci-pipeline.js
import { execSync, spawn } from "child_process";

async function runCIPipeline() {
  console.log("🌞 Running CI Pipeline...");

  let serverProcess;
  try {
    // 1) Dev-Server starten
    console.log("🔄 Starting dev server...");
    serverProcess = spawn("npm", ["run", "dev"], {
      detached: true,
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_OPTIONS: "--max-old-space-size=512",
      },
    });
    serverProcess.unref();

    // Kurze Wartezeit, damit der Server wirklich gestartet ist
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // 2) Jest Tests
    console.log("🧪 Running Jest tests...");
    execSync("npm run test:jest", { stdio: "inherit" });

    // 3) Cypress Tests
    console.log("🧪 Running Cypress tests (headless)...");
    execSync("npm run test:cypress", { stdio: "inherit" });

    console.log("✅✅✅ Tests SUCCESS");
    process.exit(0); // Exit-Code = 0 (Erfolg)
  } catch (error) {
    console.error("❌❌❌ Tests FAILED:", error.message);
    process.exit(1); // Exit-Code != 0
  } finally {
    // Server stoppen
    if (serverProcess) {
      console.log("🛑 Stopping dev server...");
      try {
        process.kill(-serverProcess.pid, "SIGTERM");
      } catch (e) {
        console.log("Server-Prozess evtl. schon beendet.");
      }
    }
  }
}

runCIPipeline();
