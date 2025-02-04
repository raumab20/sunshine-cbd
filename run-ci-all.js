import { execSync, spawn } from "child_process";

// Kleine Delay-Funktion, um asynchron zu warten
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runCIPipeline() {
  console.log("🌞 Running CI Pipeline...");

  let serverProcess;
  try {
    // Schritt 1: Projekt bauen (für die Testphase) mit Memory-Limit
    console.log("🏗️ Building the project (for tests)...");
    execSync("NODE_OPTIONS='--max-old-space-size=512' npm run build --no-lint --no-check", { stdio: "inherit" });

    // Schritt 2: Dev-Server starten (in eigener Prozessgruppe)
    console.log("🔄 Starting the server...");
    serverProcess = spawn("npm", ["run", "dev"], {
      detached: true,
      stdio: "inherit",
    });
    serverProcess.unref(); // Prozess von der Hauptgruppe trennen

    // Warten, bis der Server gestartet ist
    console.log("⏳ Waiting for the server to start...");
    await delay(5000);

    // Schritt 3: Jest-Tests ausführen
    console.log("🧪 Running Jest tests...");
    execSync("npm run test:jest", { stdio: "inherit" });

    // Schritt 4: Cypress-Tests ausführen (mit Memory-Limit)
    console.log("🧪 Running Cypress tests...");
    execSync("NODE_OPTIONS='--max-old-space-size=512' npm run test:cypress", { stdio: "inherit" });

    console.log("✅✅✅ CI Pipeline successful.");
  } catch (error) {
    console.error("❌❌❌ CI Pipeline failed:", error.message);
    process.exit(1); // Beende das Skript mit Fehlercode
  } finally {
    // Dev-Server und alle zugehörigen Prozesse beenden
    if (serverProcess) {
      console.log("🛑 Stopping the server and its process group...");
      try {
        process.kill(-serverProcess.pid, "SIGTERM"); // Ganze Prozessgruppe beenden
      } catch (err) {
        console.error("⚠️ Server process was already stopped.");
      }
      console.log("Server and associated processes have been stopped.");
    }
  }
}

runCIPipeline();
