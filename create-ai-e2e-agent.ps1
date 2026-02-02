$ErrorActionPreference = "Stop"

$root = "ai-e2e-agent"

$directories = @(
    "$root",
    "$root/agent",
    "$root/agent/prompts",
    "$root/discovery",
    "$root/execution",
    "$root/auth",
    "$root/analysis",
    "$root/report",
    "$root/report/templates",
    "$root/config",
    "$root/screenshots",
    "$root/logs"
)

$files = @(
    "$root/agent/orchestrator.js",
    "$root/agent/memory.js",
    "$root/agent/prompts/discovery.prompt",
    "$root/agent/prompts/test-design.prompt",
    "$root/agent/prompts/analysis.prompt",

    "$root/discovery/uiScanner.js",
    "$root/discovery/apiScanner.js",
    "$root/discovery/appMap.js",

    "$root/execution/puppeteerManager.js",
    "$root/execution/uiTests.js",
    "$root/execution/apiTests.js",
    "$root/execution/screenshot.js",

    "$root/auth/tokenManager.js",
    "$root/auth/headers.js",

    "$root/analysis/bugDetector.js",
    "$root/analysis/severity.js",
    "$root/analysis/heuristics.js",

    "$root/report/htmlReport.js",
    "$root/report/jsonReport.js",

    "$root/config/agent.config.js",
    "$root/config/test.env.js",
    "$root/config/selectors.json",

    "$root/index.js",
    "$root/package.json"
)

Write-Host "Creating directories..."
foreach ($dir in $directories) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

Write-Host "Creating files..."
foreach ($file in $files) {
    New-Item -ItemType File -Path $file -Force | Out-Null
}

Write-Host ""
Write-Host "ai-e2e-agent project structure created successfully." -ForegroundColor Green
