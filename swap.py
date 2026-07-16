import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Define the boundaries
# Features starts at "    <!-- Features Section -->" and ends before "    <!-- Catalog Section -->"
# Catalog starts at "    <!-- Catalog Section -->" and ends before "    <!-- Banner Section -->"

features_match = re.search(r'(    <!-- Features Section -->\s*<section id="qualite".*?</section>\s*)    <!-- Catalog Section -->', html, flags=re.DOTALL)
catalog_match = re.search(r'(    <!-- Catalog Section -->\s*<section id="catalogue".*?</section>\s*)    <!-- Banner Section -->', html, flags=re.DOTALL)

if features_match and catalog_match:
    features_block = features_match.group(1)
    catalog_block = catalog_match.group(1)
    
    # We replace the combined block of (features + catalog) with (catalog + features)
    combined_old = features_block + catalog_block
    combined_new = catalog_block + features_block
    
    new_html = html.replace(combined_old, combined_new)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Swapped successfully")
else:
    print("Could not find sections")
