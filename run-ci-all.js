import { execSync, spawn } from "child_process";

async function runCIPipeline() {
  console.log("🌞 Running CI Pipeline...");

  let serverProcess;
  try {
    console.log("🏗️ Building the project...");
    execSync("NODE_OPTIONS='--max-old-space-size=1024' npm run build", { stdio: "inherit" });

    console.log("🔄 Starting the server...");
    serverProcess = spawn("npm", ["run", "dev"], {
      detached: true,
      stdio: "inherit",
    });
    serverProcess.unref();
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log("🧪 Running all Jest tests...");
    execSync("NODE_OPTIONS='--max-old-space-size=1024' npm run test:jest", { stdio: "inherit" });

    console.log("🧪 Running all Cypress tests...");
    execSync("NODE_OPTIONS='--max-old-space-size=1024' npm run test:cypress", { stdio: "inherit" });

    console.log("✅✅✅ CI Pipeline successful.");
  } catch (error) {
    console.error("❌❌❌ CI Pipeline failed:", error.message);
    process.exit(1);
  } finally {
    if (serverProcess) {
      console.log("🛑 Stopping the server and its process group...");
      try {
        process.kill(-serverProcess.pid, "SIGTERM");
      } catch (e) {
        console.log("Server process already terminated.");
      }
      console.log("Server and associated processes have been stopped.");
    }
  }
}

runCIPipeline();
