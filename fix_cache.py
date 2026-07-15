import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add cache busters
html = html.replace('href="style.css"', 'href="style.css?v=3"')
html = html.replace('src="script.js"', 'src="script.js?v=3"')

# Remove fade-in-up from quote modal just in case
html = html.replace('class="custom-modal-content quote-modal-content fade-in-up"', 'class="custom-modal-content quote-modal-content"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
