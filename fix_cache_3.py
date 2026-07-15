import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add cache busters
html = html.replace('src="script.js?v=3"', 'src="script.js?v=4"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
