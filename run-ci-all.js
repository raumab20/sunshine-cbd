import { execSync, spawn } from "child_process";

async function runCIPipeline() {
  console.log("🌞 Running CI Pipeline...");

  let serverProcess;

  try {
    // Step 1: Build process (without cache to reduce memory usage)
    console.log("🏗️ Building the project...");
    execSync("NODE_OPTIONS='--max-old-space-size=1024' TURBO_FORCE=1 NEXT_DISABLE_CACHE=1 npm run build --no-lint --no-check", {
      stdio: "inherit",
    });

    // Step 2: Start development server in a new process group
    console.log("🔄 Starting the server...");
    serverProcess = spawn("npm", ["run", "dev"], {
      detached: true,
      stdio: "inherit",
    });
    serverProcess.unref(); // Detach the server process from the main script

    // Wait to ensure the server starts completely
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Step 3: Run Jest tests
    console.log("🧪 Running all Jest tests...");
    execSync("npm run test:jest", { stdio: "inherit" });

    // Step 4: Run Cypress tests
    console.log("🧪 Running all Cypress tests...");
    execSync("npm run test:cypress", { stdio: "inherit" });

    console.log("✅✅✅ CI Pipeline successful.");
  } catch (error) {
    console.error("❌❌❌ CI Pipeline failed:", error.message);
    process.exit(1); // Ensure GitHub Actions fails if tests fail
  } finally {
    // Stop the server and its entire process group
    if (serverProcess && serverProcess.pid) {
      console.log("🛑 Stopping the server and its process group...");
      try {
        process.kill(-serverProcess.pid, "SIGTERM");
      } catch (err) {
        console.error("⚠️ Server process was already stopped.");
      }
    }
  }
}

runCIPipeline();
