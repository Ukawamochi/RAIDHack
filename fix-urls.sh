#!/bin/bash

# すべてのTSXファイルでハードコーディングされたAPIのURLを修正するスクリプト

FILES=(
  "web/src/pages/TopPage.tsx"
  "web/src/pages/IdeaDetailPage.tsx"
  "web/src/pages/ApplicationsPage.tsx"
  "web/src/pages/WorksPage.tsx"
  "web/src/pages/WorkSubmitPage.tsx"
  "web/src/pages/CreateIdeaPage.tsx"
)

for file in "${FILES[@]}"; do
  echo "Fixing $file..."
  
  # Add API_BASE constant if not exists
  if ! grep -q "const API_BASE" "$file"; then
    sed -i "4a\\const API_BASE = import.meta.env.API_BASE || 'http://localhost:8787';" "$file"
  fi
  
  # Replace hardcoded URLs
  sed -i "s|'http://localhost:8787/|\`\${API_BASE}/|g" "$file"
  sed -i "s|\"http://localhost:8787/|\`\${API_BASE}/|g" "$file"
done

echo "URL fixing completed!"
