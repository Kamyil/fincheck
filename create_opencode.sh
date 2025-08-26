#!/bin/bash

echo '{"agents":[' > opencode.json

first=true
for file in ai-engineer api-documenter architect-review backend-architect business-analyst c-pro cloud-architect code-reviewer content-marketer context-manager cpp-pro csharp-pro customer-support data-engineer data-scientist database-admin database-optimizer debugger deployment-engineer devops-troubleshooter docs-architect dx-optimizer elixir-pro error-detective flutter-expert frontend-developer golang-pro graphql-architect hr-pro hybrid-cloud-architect incident-responder ios-developer java-pro javascript-pro kubernetes-architect legacy-modernizer legal-advisor mermaid-expert minecraft-bukkit-pro ml-engineer mlops-engineer mobile-developer network-engineer payment-integration performance-engineer php-pro prompt-engineer python-pro quant-analyst reference-builder risk-manager ruby-pro rust-pro sales-automator scala-pro search-specialist security-auditor seo-authority-builder seo-cannibalization-detector seo-content-auditor seo-content-planner seo-content-refresher seo-content-writer seo-keyword-strategist seo-meta-optimizer seo-snippet-hunter seo-structure-architect sql-pro terraform-specialist test-automator tutorial-engineer typescript-pro ui-ux-designer unity-developer; do
    echo "Processing $file..."
    
    # Fetch the file
    content=$(curl -s "https://raw.githubusercontent.com/wshobson/agents/main/${file}.md")
    
    # Extract frontmatter and content
    name=$(echo "$content" | awk '/^name:/ {gsub(/name: */, ""); print; exit}')
    description=$(echo "$content" | awk '/^description:/ {gsub(/description: */, ""); print; exit}')
    model=$(echo "$content" | awk '/^model:/ {gsub(/model: */, ""); print; exit}')
    
    # Extract prompt (everything after second ---)
    prompt=$(echo "$content" | awk '/^---$/ {count++; if(count==2) {print_rest=1; next}} print_rest {text = text $0 "\n"} END {gsub(/\n$/, "", text); print text}')
    
    # Add comma if not first
    if [ "$first" = false ]; then
        echo "," >> opencode.json
    fi
    first=false
    
    # Create JSON object
    echo -n '{"name":"'$name'","description":"'$(echo "$description" | sed 's/"/\\"/g')'","prompt":"'$(echo "$prompt" | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')'"' >> opencode.json
    
    if [ ! -z "$model" ]; then
        echo -n ',"model":"'$model'"' >> opencode.json
    fi
    
    echo -n '}' >> opencode.json
done

echo ']}' >> opencode.json
echo "✓ Created opencode.json"
