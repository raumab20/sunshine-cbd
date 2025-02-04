import { execSync, spawn } from "child_process";

async function runCIPipeline() {
  console.log("🌞 Running CI Pipeline...");

  let serverProcess;
  try {
    // Step 1: Build process
    console.log("🏗️ Building the project...");
    execSync("npm run build", { stdio: "inherit" });

    // Step 2: Start development server in a new process group
    console.log("🔄 Starting the server...");
    serverProcess = spawn("npm", ["run", "dev"], {
      detached: true,
      stdio: "inherit",
    });
    serverProcess.unref();

    // Wait a few seconds to ensure the server is up
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
    process.exit(1);
  } finally {
    // Stop the server and its entire process group
    if (serverProcess) {
      console.log("🛑 Stopping the server and its process group...");
      try {
        process.kill(-serverProcess.pid, "SIGTERM");
      } catch (err) {
        console.error("⚠️ Server process was already stopped.");
      }
      console.log("Server and associated processes have been stopped.");
    }
  }
}

runCIPipeline();