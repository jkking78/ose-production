import re
import urllib.parse

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# The original NFD string in the HTML
old_int = "assets/Toges%20international%20pour%20Universite%CC%81s%20Prive%CC%81es"
# The string if it wasn't NFD URL encoded
old_int2 = urllib.parse.quote("assets/Toges international pour Universités Privées")

content = content.replace(old_int, "assets/toges-international")
content = content.replace(old_int2, "assets/toges-international")
# Just in case it's verbatim with spaces
content = content.replace("assets/Toges international pour Universitées Privées", "assets/toges-international")
content = content.replace("assets/Toges international pour Universités Privées", "assets/toges-international")

# Also for Toges Doctorants
content = content.replace("assets/Toges%20Doctorants", "assets/toges-doctorants")
content = content.replace("assets/Toges Doctorants", "assets/toges-doctorants")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
