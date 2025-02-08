import { execSync, spawn } from "child_process";
import waitOn from "wait-on"; // Stelle sicher, dass "wait-on" installiert ist

async function waitForServer() {
  console.log("⏳ Waiting for server to be ready...");
  try {
    await waitOn({
      resources: ["http://localhost:45620"],
      delay: 5000, // Wartezeit bevor geprüft wird
      timeout: 60000, // Maximal 60 Sekunden warten
      interval: 3000, // Alle 3 Sekunden prüfen
      verbose: true,
    });
    console.log("✅ Server is ready! Running Cypress tests...");
  } catch (err) {
    console.error("❌ Server did not start in time.");
    process.exit(1);
  }
}

async function runCIPipeline() {
  console.log("🌞 Running CI Pipeline...");

  let serverProcess;
  let attempts = 0;

  try {
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

    // Step 2: Start development server in a new process group
    console.log("🔄 Starting the server...");
    serverProcess = spawn("npm", ["run", "dev"], {
      detached: true,
      stdio: "inherit",
    });
    serverProcess.unref(); // Detach the server process from the main script

    // Warte, bis der Server erreichbar ist
    await waitForServer();

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
    // Stop the server and its entire process group
    if (serverProcess) {
      console.log("🛑 Stopping the server and its process group...");
      process.kill(-serverProcess.pid, "SIGTERM"); // Kills the entire process group
      console.log("Server and associated processes have been stopped.");
    }
  }
}

runCIPipeline();
