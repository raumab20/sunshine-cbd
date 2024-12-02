import { execSync, spawn } from "child_process";
import readline from "readline";
import fs from "fs";
import path from "path";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Paths to Jest and Cypress test directories
const jestTestDir = "./__tests__";
const cypressTestDir = "./cypress/e2e";

// Function to list all tests in a directory
function listTests(dir) {
  try {
    return fs.readdirSync(dir).filter(file => file.endsWith(".tsx") || file.endsWith(".ts"));
  } catch {
    return [];
  }
}

const jestTests = listTests(jestTestDir);
const cypressTests = listTests(cypressTestDir);

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function runCIPipeline() {
  console.log("🌞 Running CI Pipeline...");

  let serverProcess;

  try {
    // Build process
    console.log("🏗️ Building the project...");
    execSync("npm run build", { stdio: "inherit" });

    // Start server in development mode in a new process group
    console.log("🔄 Starting the server...");
    serverProcess = spawn("npm", ["run", "dev"], {
      detached: true,
      stdio: "inherit",
    });
    serverProcess.unref();

    // Wait for server to start fully
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Test menu
    let running = true;
    while (running) {
      console.log("\n📜 Available Test Options:");
      console.log("1. Run Jest Tests");
      console.log("2. Run Cypress Tests");
      console.log("3. Run All Tests (Jest & Cypress)");
      console.log("4. Exit");

      const choice = await askQuestion("Select an option (1-4): ");

      if (choice === "1") {
        console.log("\n📜 Jest Tests:");
        jestTests.forEach((test, index) => console.log(`   ${index + 1}. ${test}`));
        const jestChoice = await askQuestion("Enter Jest test name or leave empty for all: ");
        if (jestChoice) {
          const testName = jestTests.find(test => test.includes(jestChoice));
          if (testName) {
            console.log(`🧪 Running Jest test: ${testName}`);
            execSync(`npm run test:jest -- ${path.join(jestTestDir, testName)}`, { stdio: "inherit" });
          } else {
            console.log("❌ Test not found.");
          }
        } else {
          console.log("🧪 Running all Jest tests...");
          execSync("npm run test:jest", { stdio: "inherit" });
        }

      } else if (choice === "2") {
        console.log("\n📜 Cypress Tests:");
        cypressTests.forEach((test, index) => console.log(`   ${index + 1}. ${test}`));
        const cypressChoice = await askQuestion("Enter Cypress spec file or leave empty for all: ");
        if (cypressChoice) {
          const specFile = cypressTests.find(test => test.includes(cypressChoice));
          if (specFile) {
            console.log(`🧪 Running Cypress test: ${specFile}`);
            execSync(`npm run test:cypress -- --spec ${path.join(cypressTestDir, specFile)}`, { stdio: "inherit" });
          } else {
            console.log("❌ Test not found.");
          }
        } else {
          console.log("🧪 Running all Cypress tests...");
          execSync("npm run test:cypress", { stdio: "inherit" });
        }

      } else if (choice === "3") {
        console.log("🧪 Running all Jest and Cypress tests...");
        execSync("npm run test:jest", { stdio: "inherit" });
        execSync("npm run test:cypress", { stdio: "inherit" });

      } else if (choice === "4") {
        console.log("Exiting...");
        running = false;

      } else {
        console.log("❌ Invalid option. Please select a number between 1 and 4.");
      }
    }

    console.log("✅✅✅ CI Pipeline successful.");

  } catch (error) {
    console.error("❌❌❌ CI Pipeline failed:", error.message);
  } finally {
    // Stop the server and its process group
    if (serverProcess) {
      console.log("🛑 Stopping the server and its process group...");
      process.kill(-serverProcess.pid, "SIGTERM"); // Stops the entire process group
      console.log("Server and associated processes have been stopped.");
    }
    rl.close();
  }
}

runCIPipeline();
