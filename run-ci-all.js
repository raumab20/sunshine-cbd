import { execSync, spawn } from "child_process";
import http from "http";

async function waitForServer(url, timeout = 60000) {
  console.log(`⌛ Warten auf Server unter ${url} (max. ${timeout / 1000} Sekunden)...`);
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, res => {
          if (res.statusCode === 200) resolve();
          else reject();
        });

        req.on("error", reject);
        req.end();
      });

      console.log("✅ Server ist bereit!");
      return true;
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 Sekunde warten und erneut prüfen
    }
  }

  console.error("❌ Serverstart hat zu lange gedauert!");
  return false;
}

async function runCIPipeline() {
  console.log("🌞 Running CI Pipeline...");

  let serverProcess;
  let attempts = 0;

  try {
    // Step 0: Install dependencies
    execSync("npm i", { stdio: "inherit" });

    // Step 1: Build process (retry up to 5 times)
    console.log("🏗️ Building the project...");
    while (attempts < 5) {
      try {
        execSync("NODE_OPTIONS='--max-old-space-size=1536' TURBO_FORCE=1 NEXT_DISABLE_CACHE=1 NEXT_STATIC_EXPORT=1 npm run build --no-lint --no-check", { stdio: "inherit" });
        console.log("✅ Build successful!");
        break;
      } catch (error) {
        attempts++;
        console.error(`❌ Build failed (attempt ${attempts}/5), retrying in 5 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    if (attempts >= 5) {
      console.error("❌ Build failed after 5 attempts. Exiting...");
      process.exit(1);
    }

    // Step 2: Start development server
    console.log("🔄 Starting the server...");
    serverProcess = spawn("npm", ["run", "dev"], {
      detached: false,  // Keine eigene Prozessgruppe, damit wir sicher killen können
      stdio: "ignore",
    });

    serverProcess.unref(); // Prozess im Hintergrund laufen lassen

    // Beende den Serverprozess sicher, wenn das Skript beendet wird
    process.on("exit", () => stopServer(serverProcess));
    process.on("SIGINT", () => stopServer(serverProcess));
    process.on("SIGTERM", () => stopServer(serverProcess));

    // Warte auf Server-Start
    const serverReady = await waitForServer("http://localhost:45620");

    if (!serverReady) {
      throw new Error("Server ist nicht rechtzeitig gestartet!");
    }

    // Step 3: Run Jest tests
    console.log("🧪 Running all Jest tests...");
    execSync("npm run test:jest", { stdio: "inherit" });

    // Step 4: Run Cypress tests
    console.log("🧪 Running all Cypress tests...");
    execSync("npm run test:cypress", { stdio: "inherit" });

    console.log("✅✅✅ CI Pipeline successful.");
  } catch (error) {
    console.error("❌❌❌ CI Pipeline failed:", error.message);
    process.exit(1);
  } finally {
    // Stop the server sicher
    stopServer(serverProcess);
  }
}

function stopServer(serverProcess) {
  if (serverProcess) {
    console.log("🛑 Stopping the server...");

    serverProcess.kill("SIGTERM"); // Versuche SIGTERM

    setTimeout(() => {
      if (!serverProcess.killed) {
        console.log("⚠️ SIGTERM nicht erfolgreich, erzwinge SIGKILL...");
        serverProcess.kill("SIGKILL"); // Falls nötig, mit SIGKILL beenden
      }
    }, 5000);
  }
}

runCIPipeline();
