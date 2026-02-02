#!/usr/bin/env bash

set -e

PROJECT_NAME="ai-e2e-agent"

echo "📁 Creating project: $PROJECT_NAME"
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Root-level files
touch index.js
touch package.json
touch .env
touch .gitignore

# Core directories
mkdir -p agent/prompts
mkdir -p auth
mkdir -p discovery
mkdir -p execution
mkdir -p analysis
mkdir -p report/templates
mkdir -p screenshots
mkdir -p logs
mkdir -p config

# Agent files
touch agent/adkClient.js
touch agent/memory.js
touch agent/testPlanner.js
touch agent/prompts/test-design.prompt.js

# Auth
touch auth/tokenManager.js
touch auth/headers.js

# Discovery
touch discovery/uiScanner.js
touch discovery/apiScanner.js
touch discovery/appMap.js

# Execution
touch execution/puppeteerManager.js
touch execution/uiTests.js
touch execution/apiTests.js
touch execution/testRunner.js
touch execution/testResult.js

# Analysis
touch analysis/bugDetector.js
touch analysis/severity.js
touch analysis/heuristics.js

# Report
touch report/jsonReport.js
touch report/htmlReport.js
touch report/summary.js

# Config
touch config/agent.config.js
touch config/test.env.js

# Git ignore defaults
cat <<EOF > .gitignore
node_modules/
.env
screenshots/
logs/
report/
EOF

echo "✅ File structure created successfully!"
echo "➡️ Next steps:"
echo "   1. npm init -y"
echo "   2. npm install"
echo "   3. Paste code into generated files"
