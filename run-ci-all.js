import { execSync, spawn } from "child_process";

async function runCIPipeline() {
  console.log("🌞 Running CI Pipeline...");

  let serverProcess;
  try {
    // Step 1: Building the project (nur wenn nicht bereits gebaut)
    console.log("🏗️ Building the project with limited RAM...");
    execSync("NODE_OPTIONS='--max-old-space-size=512' npm run build", { stdio: "inherit" });

    // Step 2: Starten des Dev-Servers nur für Cypress-Tests
    console.log("🔄 Starting the development server (only if needed)...");
    serverProcess = spawn("npm", ["run", "dev"], {
      detached: true,
      stdio: "inherit",
    });
    serverProcess.unref(); // Entkoppelt den Server-Prozess vom Hauptprozess

    // Wartezeit, damit der Server vollständig startet
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Step 3: Jest Tests mit RAM-Optimierung
    console.log("🧪 Running Jest tests...");
    execSync("NODE_OPTIONS='--max-old-space-size=512' npm run test:jest", { stdio: "inherit" });

    // Step 4: Cypress Tests mit RAM-Optimierung
    console.log("🧪 Running Cypress tests with minimal memory usage...");
    execSync("NODE_OPTIONS='--max-old-space-size=512' npm run test:cypress -- --headless --config numTestsKeptInMemory=0", { stdio: "inherit" });

    console.log("✅✅✅ CI Pipeline successful.");
  } catch (error) {
    console.error("❌❌❌ CI Pipeline failed:", error.message);
  } finally {
    // Beenden des Servers und aller zugehörigen Prozesse
    if (serverProcess) {
      console.log("🛑 Stopping the development server...");
      process.kill(-serverProcess.pid, "SIGTERM");
      console.log("Server stopped.");
    }
  }
}

runCIPipeline();