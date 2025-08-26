import requests
import json
import re

def parse_agent_file(content):
    lines = content.split('\n')
    
    # Find the frontmatter boundaries
    frontmatter_start = -1
    frontmatter_end = -1
    
    for i, line in enumerate(lines):
        if line.strip() == '---':
            if frontmatter_start == -1:
                frontmatter_start = i
            else:
                frontmatter_end = i
                break
    
    if frontmatter_start == -1 or frontmatter_end == -1:
        return None
    
    # Parse frontmatter
    frontmatter = {}
    for line in lines[frontmatter_start+1:frontmatter_end]:
        if ':' in line:
            key, value = line.split(':', 1)
            frontmatter[key.strip()] = value.strip()
    
    # Get the prompt content after frontmatter
    prompt_lines = lines[frontmatter_end+1:]
    prompt = '\n'.join(prompt_lines).strip()
    
    agent = {
        "name": frontmatter.get('name', ''),
        "description": frontmatter.get('description', ''),
        "prompt": prompt
    }
    
    # Add optional fields if they exist
    if 'model' in frontmatter:
        agent['model'] = frontmatter['model']
    if 'tools' in frontmatter:
        agent['tools'] = frontmatter['tools']
    
    return agent

# List of agent files
agent_files = [
    "ai-engineer.md", "api-documenter.md", "architect-review.md", "backend-architect.md",
    "business-analyst.md", "c-pro.md", "cloud-architect.md", "code-reviewer.md",
    "content-marketer.md", "context-manager.md", "cpp-pro.md", "csharp-pro.md",
    "customer-support.md", "data-engineer.md", "data-scientist.md", "database-admin.md",
    "database-optimizer.md", "debugger.md", "deployment-engineer.md", "devops-troubleshooter.md",
    "docs-architect.md", "dx-optimizer.md", "elixir-pro.md", "error-detective.md",
    "flutter-expert.md", "frontend-developer.md", "golang-pro.md", "graphql-architect.md",
    "hr-pro.md", "hybrid-cloud-architect.md", "incident-responder.md", "ios-developer.md",
    "java-pro.md", "javascript-pro.md", "kubernetes-architect.md", "legacy-modernizer.md",
    "legal-advisor.md", "mermaid-expert.md", "minecraft-bukkit-pro.md", "ml-engineer.md",
    "mlops-engineer.md", "mobile-developer.md", "network-engineer.md", "payment-integration.md",
    "performance-engineer.md", "php-pro.md", "prompt-engineer.md", "python-pro.md",
    "quant-analyst.md", "reference-builder.md", "risk-manager.md", "ruby-pro.md",
    "rust-pro.md", "sales-automator.md", "scala-pro.md", "search-specialist.md",
    "security-auditor.md", "seo-authority-builder.md", "seo-cannibalization-detector.md",
    "seo-content-auditor.md", "seo-content-planner.md", "seo-content-refresher.md",
    "seo-content-writer.md", "seo-keyword-strategist.md", "seo-meta-optimizer.md",
    "seo-snippet-hunter.md", "seo-structure-architect.md", "sql-pro.md",
    "terraform-specialist.md", "test-automator.md", "tutorial-engineer.md",
    "typescript-pro.md", "ui-ux-designer.md", "unity-developer.md"
]

agents = []
base_url = "https://raw.githubusercontent.com/wshobson/agents/main/"

for filename in agent_files:
    print(f"Fetching {filename}...")
    try:
        response = requests.get(base_url + filename)
        if response.status_code == 200:
            agent = parse_agent_file(response.text)
            if agent:
                agents.append(agent)
                print(f"  ✓ Parsed {agent['name']}")
            else:
                print(f"  ✗ Failed to parse {filename}")
        else:
            print(f"  ✗ HTTP {response.status_code} for {filename}")
    except Exception as e:
        print(f"  ✗ Error fetching {filename}: {e}")

# Create the final JSON structure
opencode_config = {"agents": agents}

# Write to file
with open('opencode.json', 'w') as f:
    json.dump(opencode_config, f, indent=2)

print(f"\n✓ Successfully created opencode.json with {len(agents)} agents")
