/**
 * AI E2E Agent - Main Entry Point
 * Flow:
 * INIT → DISCOVERY → TEST PLANNING → EXECUTION → ANALYSIS → REPORT
 */

require('dotenv').config();

const config = require('./config/agent.config');
const memory = require('./agent/memory');

// Puppeteer
const {
  initBrowser,
  navigate,
  screenshot,
  closeBrowser
} = require('./execution/puppeteerManager');

// Discovery
const { discoverUIRoutes } = require('./discovery/uiScanner');
const { attachApiScanner } = require('./discovery/apiScanner');
const AppMap = require('./discovery/appMap');

// Planning (Google ADK)
const { generateTestPlan } = require('./agent/testPlanner');

// Execution
const { runTests } = require('./execution/testRunner');

// Analysis & Report
const { analyzeResults } = require('./analysis/bugDetector');
const { buildSummary } = require('./report/summary');
const { generateJSONReport } = require('./report/jsonReport');
const { generateHTMLReport } = require('./report/htmlReport');

(async () => {
  console.log('🚀 AI E2E Agent starting...');
  console.log('🔐 Using GCP ADC (application-default credentials)');
  console.log(`📍 Project: ${config.gcp.projectId}, Location: ${config.gcp.location}`);

  let browser, page;

  try {
    /* =========================
       INIT + AUTH
    ========================= */
    ({ browser, page } = await initBrowser());

    /* =========================
       DISCOVERY PHASE
    ========================= */
    console.log('🧭 Discovery phase started');

    const appMap = new AppMap();
    const apiMap = [];

    attachApiScanner(page, apiMap);

    await navigate(config.app.baseUrl);
    await screenshot('01-app-loaded.png');

    const routes = await discoverUIRoutes(page);
    appMap.addRoutes(routes);
    appMap.addApis(apiMap);

    memory.storeAppMap(appMap);

    console.log('📊 Discovery summary:', appMap.summary());

    /* =========================
       TEST PLANNING (AI)
    ========================= */
    console.log('🧠 Generating test plan using Google ADK...');
    const testPlan = await generateTestPlan();

    console.log(`📋 Test cases generated: ${testPlan.tests.length}`);

    /* =========================
       EXECUTION PHASE
    ========================= */
    console.log('🧪 Executing tests...');
    const results = await runTests(testPlan, page);
    memory.testResults = results;

    console.log(
      `✅ Execution completed | Passed: ${
        results.filter(r => r.status === 'PASS').length
      }, Failed: ${
        results.filter(r => r.status === 'FAIL').length
      }`
    );

    /* =========================
       ANALYSIS + REPORT
    ========================= */
    console.log('📊 Analyzing results...');
    const bugs = analyzeResults(results);
    const summary = buildSummary(results, config.app.name);

    await generateJSONReport(summary, bugs, results);
    await generateHTMLReport(summary, bugs);

    console.log('📄 Reports generated successfully');
    console.log(`🚨 Bugs detected: ${bugs.length}`);

  } catch (err) {
    console.error('❌ Agent execution failed:', err.message);
    console.error(err);
  } finally {
    if (browser) {
      await closeBrowser();
    }
    console.log('🏁 AI E2E Agent finished');
  }
})();
