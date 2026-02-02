/**
 * Test Planner
 * - Uses Google ADK (Vertex AI)
 * - Generates test intentions
 * - Normalizes & validates output
 * - Attaches real routes for execution
 */

const { reason } = require('./adkClient');
const memory = require('./memory');
const testDesignPrompt = require('./prompts/test-design.prompt');
const { extractJSON } = require('./utils/jsonExtractor');
const { v4: uuidv4 } = require('uuid');

async function generateTestPlan() {
  if (!memory.appMap) {
    throw new Error('AppMap missing. Discovery phase must run first.');
  }

  console.log('🧠 Generating test plan using Google ADK...');

  const basePrompt = testDesignPrompt(memory.appMap);

  let responseText;
  let plan;

  /* =========================
     FIRST ATTEMPT
  ========================= */
  responseText = await reason(basePrompt);
  plan = extractJSON(responseText);

  /* =========================
     RETRY WITH STRICT PROMPT
  ========================= */
  if (!plan) {
    console.warn('⚠️ JSON parse failed. Retrying with strict instructions...');

    const strictPrompt = `
You MUST return ONLY valid JSON.
No markdown.
No explanation.
No comments.
No trailing commas.

${basePrompt}
`;

    responseText = await reason(strictPrompt);
    plan = extractJSON(responseText);
  }

  /* =========================
     FINAL VALIDATION
  ========================= */
  if (!plan || !Array.isArray(plan.tests)) {
    console.error('❌ Raw AI response:\n', responseText);
    throw new Error('Failed to parse AI test plan JSON');
  }

  /* =========================
     NORMALIZE TESTS
  ========================= */
  const routes = memory.appMap.routes || [];
  let routeIndex = 0;

  plan.tests = plan.tests.map((test, index) => {
    const normalized = {
      id: test.id || `TC-${uuidv4()}`,
      type: test.type || 'functional',
      target: test.target || 'route',
      description: test.description || 'No description provided',
      priority: test.priority || 'medium',
      expectedRisk: test.expectedRisk || 'Unknown',
    };

    // Attach actual routes so UI tests navigate
    if (normalized.target === 'route' && routes.length > 0) {
      normalized.route = routes[routeIndex % routes.length];
      routeIndex++;
    }

    // API placeholders (future expansion)
    if (normalized.target === 'api') {
      normalized.url = test.url || null;
      normalized.method = test.method || 'GET';
    }

    return normalized;
  });

  /* =========================
     STORE IN MEMORY
  ========================= */
  memory.storeTestPlan(plan);

  console.log(`📋 Test plan ready. Total tests: ${plan.tests.length}`);

  return plan;
}

module.exports = { generateTestPlan };
