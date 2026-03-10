Write-Host "Starting Claude MCP + Skill Setup..."

$project = Get-Location

Write-Host "Project path:"
Write-Host $project

#######################################
# Install filesystem MCP server
#######################################

Write-Host "Installing MCP filesystem server..."

npm install -g @modelcontextprotocol/server-filesystem

#######################################
# Create MCP config
#######################################

$mcpPath = Join-Path $project ".mcp.json"

$mcpConfig = @"
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem"],
      "env": {
        "ALLOWED_PATHS": "$project"
      }
    }
  }
}
"@

Set-Content -Path $mcpPath -Value $mcpConfig

Write-Host ".mcp.json created"

#######################################
# Create skills folder
#######################################

$skillsPath = Join-Path $project "skills"

if (!(Test-Path $skillsPath)) {
    New-Item -ItemType Directory -Path $skillsPath
}

#######################################
# Create Stitch skill folder
#######################################

$stitch = Join-Path $skillsPath "stitch"

if (!(Test-Path $stitch)) {
    New-Item -ItemType Directory -Path $stitch
}

#######################################
# Create NOIRE skill folder
#######################################

$noire = Join-Path $skillsPath "noire"

if (!(Test-Path $noire)) {
    New-Item -ItemType Directory -Path $noire
}

#######################################
# Create CLAUDE.md if missing
#######################################

$claudePath = Join-Path $project "CLAUDE.md"

if (!(Test-Path $claudePath)) {

$claudeContent = @"
# OUROZ Claude Instructions

Before coding read:

design_standards.md
AGENTS.md
PROJECT_RULES.md
DONE_DEFINITION.md
QA_RELEASE_CHECKLIST.md
CURRENT_PRIORITY.md

Rules:

1 Do not leave mock data in production paths
2 Do not break auth payments routing or DB integrity
3 Preserve premium UI and luxury layout
4 Prefer small validated edits over large rewrites
5 Report changed files clearly
"@

Set-Content -Path $claudePath -Value $claudeContent

}

#######################################
# Create design standards if missing
#######################################

$designPath = Join-Path $project "design_standards.md"

if (!(Test-Path $designPath)) {

$designContent = @"
# Stitch Design System

UI rules:

glassmorphism surfaces
grain texture backgrounds
halo lighting effects
luxury dark theme
premium spacing

Never flatten the UI.
"@

Set-Content -Path $designPath -Value $designContent

}

#######################################
# Done
#######################################

Write-Host ""
Write-Host "Claude environment ready."
Write-Host ""
Write-Host "Now run:"
Write-Host "claude"
Write-Host ""
Write-Host "Claude will detect .mcp.json automatically."