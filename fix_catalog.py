import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# I already built the new_grid string in update_catalog.py. I'll just import it or reconstruct it.
import update_catalog
new_grid = update_catalog.new_grid.replace('class="catalog-grid" id="catalog-grid"', 'class="products-grid"')

# Replace the products-grid block
new_content = re.sub(r'<div class="products-grid">.*?</section>', new_grid + '\n    </section>', content, flags=re.DOTALL)

if new_content == content:
    print("NO CHANGE MADE. REGEX FAILED.")
else:
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS: HTML Updated correctly.")
