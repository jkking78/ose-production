import re
import urllib.parse

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the enfant blocks
enfant_start = content.find('<!-- Product: Enfant 1 -->')
licence_start = content.find('<!-- Product: Licence / Master 1 -->')

if enfant_start != -1 and licence_start != -1:
    new_enfant_blocks = """<!-- Product: Enfant 1 -->
            <div class="product-card fade-in-up" data-category="enfant" style="--delay: 0.1s">
                <div class="product-image">
                    <img src="assets/toge-enfant/model%201/PHOTO-2026-07-03-21-31-04.jpg" alt="Toge Enfant 1">
                    <div class="product-overlay">
                        <button class="btn-icon"><i class="ph ph-eye"></i> Aperçu</button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">Enfant</div>
                    <h3>Toge Enfant (Modèle 1)</h3>
                    <div class="product-price">À partir de 25 000 FCFA</div>
                </div>
            </div>

            <!-- Product: Enfant 2 -->
            <div class="product-card fade-in-up" data-category="enfant" style="--delay: 0.1s">
                <div class="product-image">
                    <img src="assets/toge-enfant/model%202/PHOTO-2026-07-03-21-31-06.jpg" alt="Toge Enfant 2">
                    <div class="product-overlay">
                        <button class="btn-icon"><i class="ph ph-eye"></i> Aperçu</button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">Enfant</div>
                    <h3>Toge Enfant (Modèle 2)</h3>
                    <div class="product-price">À partir de 25 000 FCFA</div>
                </div>
            </div>

            <!-- Product: Enfant 3 -->
            <div class="product-card fade-in-up" data-category="enfant" style="--delay: 0.1s">
                <div class="product-image">
                    <img src="assets/toge-enfant/PHOTO-2026-07-03-21-31-05%203.jpg" alt="Toge Enfant 3">
                    <div class="product-overlay">
                        <button class="btn-icon"><i class="ph ph-eye"></i> Aperçu</button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">Enfant</div>
                    <h3>Toge Enfant (Modèle 3)</h3>
                    <div class="product-price">À partir de 25 000 FCFA</div>
                </div>
            </div>

            <!-- Product: Enfant 4 -->
            <div class="product-card fade-in-up" data-category="enfant" style="--delay: 0.1s">
                <div class="product-image">
                    <img src="assets/toge-enfant/PHOTO-2026-07-03-21-31-06%204.jpg" alt="Toge Enfant 4">
                    <div class="product-overlay">
                        <button class="btn-icon"><i class="ph ph-eye"></i> Aperçu</button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">Enfant</div>
                    <h3>Toge Enfant (Modèle 4)</h3>
                    <div class="product-price">À partir de 25 000 FCFA</div>
                </div>
            </div>

            <!-- Product: Enfant 5 -->
            <div class="product-card fade-in-up" data-category="enfant" style="--delay: 0.1s">
                <div class="product-image">
                    <img src="assets/toge-enfant/PHOTO-2026-07-03-21-31-06%205.jpg" alt="Toge Enfant 5">
                    <div class="product-overlay">
                        <button class="btn-icon"><i class="ph ph-eye"></i> Aperçu</button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">Enfant</div>
                    <h3>Toge Enfant (Modèle 5)</h3>
                    <div class="product-price">À partir de 25 000 FCFA</div>
                </div>
            </div>\n            """
    content = content[:enfant_start] + new_enfant_blocks + content[licence_start:]

# Also URL encode all image spaces just in case
def encode_src_spaces(match):
    prefix = match.group(1)
    src = match.group(2)
    suffix = match.group(3)
    encoded_src = src.replace(' ', '%20')
    return f'{prefix}"{encoded_src}"{suffix}'

content = re.sub(r'(<img[^>]*src=)"([^"]+)"([^>]*>)', encode_src_spaces, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
