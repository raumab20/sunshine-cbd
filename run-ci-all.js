import { execSync, spawn } from "child_process";
import fs from "fs";

async function runCIPipeline() {
  console.log("🌞 Running CI Pipeline...");

  let serverProcess;
  try {
    // Step 1: Prüfen, ob .env.local existiert
    if (!fs.existsSync(".env.local")) {
      console.warn("⚠️ .env.local not found! Using default values...");
    }

    // Step 2: Build-Prozess mit Wiederholungen
    console.log("🏗️ Building the project (retry until success)...");
    while (true) {
      try {
        execSync("NODE_OPTIONS='--max-old-space-size=512' npm run build", { stdio: "inherit" });
        console.log("✅ Build successful!");
        break;
      } catch (error) {
        console.error("❌ Build failed. Retrying in 5 seconds...");
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    // Step 3: Starten des Dev-Servers nur für Cypress-Tests
    console.log("🔄 Starting the development server (only if needed)...");
    serverProcess = spawn("npm", ["run", "dev"], {
      detached: true,
      stdio: "inherit",
    });
    serverProcess.unref(); 

    // Wartezeit, damit der Server vollständig startet
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Step 4: Jest Tests mit RAM-Optimierung
    console.log("🧪 Running Jest tests...");
    execSync("NODE_OPTIONS='--max-old-space-size=512' npm run test:jest", { stdio: "inherit" });

    // Step 5: Cypress Tests im **Headless-Modus** mit minimalem RAM-Verbrauch
    console.log("🧪 Running Cypress tests in headless mode...");
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