import os
import re

# 1. Gather all images
data = {}
base_dir = "assets"
for root, dirs, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.jpg') or f.endswith('.png') or f.endswith('.jpeg'):
            path = os.path.join(root, f)
            rel_path = os.path.relpath(path, start=".")
            lower_path = rel_path.lower()
            if 'toge-enfant' in lower_path:
                cat = 'enfant'
            elif 'toge-licence-master' in lower_path:
                cat = 'licence-master'
            elif 'toges doctorants' in lower_path:
                cat = 'doctorat'
            elif 'international' in lower_path:
                cat = 'international'
            else:
                cat = 'other'
                
            if cat not in data:
                data[cat] = []
            data[cat].append(rel_path.replace(' ', '%20'))

enfant_imgs = data.get('enfant', [])
licence_master_imgs = data.get('licence-master', [])
doctorat_imgs = data.get('doctorat', [])
international_imgs = data.get('international', [])

enfant_data = ",".join(enfant_imgs)
lm_data = ",".join(licence_master_imgs)
doc_data = ",".join(doctorat_imgs)
intl_data = ",".join(international_imgs)

enfant_first = enfant_imgs[0] if enfant_imgs else "assets/toge1.jpg"
lm_first = licence_master_imgs[0] if licence_master_imgs else "assets/toge2.jpg"
doc_first = doctorat_imgs[0] if doctorat_imgs else "assets/toge2.jpg"
intl_first = international_imgs[0] if international_imgs else "assets/toge1.jpg"

# 2. Build the new grid HTML
new_grid = f"""        <div class="products-grid">
            
            <!-- Grande Catégorie: Enfant -->
            <div class="product-card fade-in-up" data-category="enfant" style="--delay: 0.1s">
                <div class="product-image">
                    <img src="{enfant_first}" alt="Toges Enfant">
                    <div class="product-overlay">
                        <button class="btn-icon" data-images="{enfant_data}"><i class="ph ph-eye"></i> Aperçu de tous les modèles</button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">ENFANT</div>
                    <h3 class="product-title">Collection Toges Enfant</h3>
                    <p class="product-price">À partir de 25 000 FCFA</p>
                </div>
            </div>

            <!-- Grande Catégorie: Licence & Master -->
            <div class="product-card fade-in-up" data-category="licence-master" style="--delay: 0.2s">
                <div class="product-image">
                    <img src="{lm_first}" alt="Toges Licence & Master">
                    <div class="product-overlay">
                        <button class="btn-icon" data-images="{lm_data}"><i class="ph ph-eye"></i> Aperçu de tous les modèles</button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">LICENCE & MASTER</div>
                    <h3 class="product-title">Collection Toges Licence & Master</h3>
                    <p class="product-price">À partir de 60 000 FCFA</p>
                </div>
            </div>

            <!-- Grande Catégorie: Doctorat -->
            <div class="product-card fade-in-up" data-category="doctorat" style="--delay: 0.3s">
                <div class="product-image">
                    <img src="{doc_first}" alt="Toges Doctorat">
                    <div class="product-overlay">
                        <button class="btn-icon" data-images="{doc_data}"><i class="ph ph-eye"></i> Aperçu de tous les modèles</button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">DOCTORAT</div>
                    <h3 class="product-title">Collection Toges Doctorat</h3>
                    <p class="product-price">À partir de 125 000 FCFA</p>
                </div>
            </div>
            
            <!-- Grande Catégorie: International -->
            <div class="product-card fade-in-up" data-category="international" style="--delay: 0.4s">
                <div class="product-image">
                    <img src="{intl_first}" alt="Toges International">
                    <div class="product-overlay">
                        <button class="btn-icon" data-images="{intl_data}"><i class="ph ph-eye"></i> Aperçu de tous les modèles</button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">INTERNATIONAL</div>
                    <h3 class="product-title">Universités Privées</h3>
                    <p class="product-price">À partir de 200 000 FCFA</p>
                </div>
            </div>
            
        </div>"""

new_filters = """        <!-- Filters -->
        <div class="filters fade-in-up">
            <button class="filter-btn active" data-filter="all">Tout</button>
            <button class="filter-btn" data-filter="enfant">Enfant</button>
            <button class="filter-btn" data-filter="licence-master">Licence & Master</button>
            <button class="filter-btn" data-filter="doctorat">Doctorat</button>
            <button class="filter-btn" data-filter="international">International</button>
        </div>"""

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace filters block
content = re.sub(r'<!-- Filters -->.*?</div>', new_filters, content, flags=re.DOTALL)

# Replace products grid block
new_content = re.sub(r'<div class="products-grid">.*?</section>', new_grid + '\n    </section>', content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("HTML Updated successfully with International.")
