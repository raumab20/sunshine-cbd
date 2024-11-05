// run-ci-all.js
import { execSync, spawn } from "child_process";

async function runCIPipeline() {
  console.log("🌞 Running CI Pipeline...");

  try {
    // Schritt 1: Build-Prozess
    console.log("🏗️ Building the project...");
    execSync("npm run build", { stdio: "inherit" });

    // Schritt 2: Entwicklungsserver im Hintergrund starten
    console.log("🔄 Starting the server...");
    const serverProcess = spawn("npm", ["run", "dev"], {
      detached: true,
      stdio: "inherit",
    });
    serverProcess.unref(); // Löst den Serverprozess vom Hauptprozess, sodass er weiterläuft

    // Wartezeit, um sicherzustellen, dass der Server vollständig gestartet ist
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Schritt 3: Jest-Tests ausführen
    console.log("🧪 Running all Jest tests...");
    execSync("npm run test:jest", { stdio: "inherit" });

    // Schritt 4: Cypress-Tests ausführen
    console.log("🧪 Running all Cypress tests...");
    execSync("npm run test:cypress", { stdio: "inherit" });

    console.log("✅✅✅ CI Pipeline successful.");
  } catch (error) {
    console.error("❌❌❌ CI Pipeline failed:", error.message);
  } finally {
    // Server nach Abschluss der Tests stoppen
    console.log("🛑 Stopping the server...");
    execSync("pkill -f 'npm run dev'"); // Stoppt alle Prozesse, die 'npm run dev' enthalten
  }
}

runCIPipeline();
