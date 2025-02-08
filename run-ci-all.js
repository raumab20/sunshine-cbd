import { execSync, spawn } from "child_process";

async function runCIPipeline() {
  console.log("🌞 Running CI Pipeline...");

  let serverProcess;
  let attempts = 0;

  try {
    // Step 1: Build process (retry up to 5 times)
    console.log("🏗️ Building the project...");
    while (attempts < 20) {
      try {
        execSync("NODE_OPTIONS='--max-old-space-size=1536' TURBO_FORCE=1 NEXT_DISABLE_CACHE=1 NEXT_STATIC_EXPORT=1 npm run build --no-lint --no-check", { stdio: "inherit" });
        console.log("✅ Build successful!");
        break;
      } catch (error) {
        attempts++;
        console.error(`❌ Build failed (attempt ${attempts}/20), retrying in 5 seconds...`);
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

    // Wait to ensure the server starts completely
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Step 3: Run Jest tests
    console.log("🧪 Running all Jest tests...");
    execSync("npm run test:jest", { stdio: "inherit" });

    // Step 4: Run Cypress tests
    console.log("🧪 Waiting for server to be ready...");
    setTimeout(() => {
      console.log("🧪 Running all Cypress tests...");
      execSync("npm run test:cypress", { stdio: "inherit" });
    }, 10000); // 10 Sekunden warten, damit der Server stabil läuft


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
