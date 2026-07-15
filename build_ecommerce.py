import re

# --- 1. UPDATE HTML ---
with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

new_modals = """
    <!-- Category Gallery Modal -->
    <div id="category-gallery-modal" class="custom-modal">
        <div class="custom-modal-overlay"></div>
        <div class="custom-modal-content gallery-content fade-in-up">
            <span class="close-modal">&times;</span>
            <h2 id="gallery-title">Toutes nos toges</h2>
            <div class="gallery-grid" id="gallery-grid">
                <!-- Thumbnails will be injected here by JS -->
            </div>
        </div>
    </div>

    <!-- Product Detail Modal -->
    <div id="product-detail-modal" class="custom-modal">
        <div class="custom-modal-overlay"></div>
        <div class="custom-modal-content product-content fade-in-up">
            <span class="close-modal">&times;</span>
            <div class="product-layout">
                <div class="product-gallery">
                    <img id="detail-img" src="" alt="Toge">
                </div>
                <div class="product-info-panel">
                    <h2 id="detail-title">Titre du produit</h2>
                    <p class="detail-price" id="detail-price">Prix</p>
                    <div class="detail-description">
                        <p>Cette toge de qualité supérieure est confectionnée avec soin pour garantir élégance et confort lors de votre cérémonie.</p>
                        <ul style="margin-top: 15px; padding-left: 20px; color: var(--text-light);">
                            <li>Tissu infroissable de haute qualité</li>
                            <li>Coupe académique traditionnelle</li>
                            <li>Finitions soignées</li>
                        </ul>
                    </div>
                    <div class="detail-options">
                        <label for="size-select">Sélectionnez votre taille :</label>
                        <select id="size-select">
                            <option>S (Moins de 1m60)</option>
                            <option>M (1m60 - 1m75)</option>
                            <option>L (1m75 - 1m85)</option>
                            <option>XL (Plus de 1m85)</option>
                        </select>
                    </div>
                    <button class="btn-primary" style="width:100%; margin-top:20px;"><i class="ph ph-shopping-cart"></i> Ajouter au panier</button>
                    <button class="btn-secondary" style="width:100%; margin-top:10px;"><i class="ph ph-whatsapp-logo"></i> Commander sur WhatsApp</button>
                </div>
            </div>
        </div>
    </div>
"""

# Insert before </body> if not already there
if 'id="category-gallery-modal"' not in html_content:
    html_content = html_content.replace('</body>', new_modals + '\n</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)


# --- 2. UPDATE CSS ---
css_styles = """
/* --- Ecommerce Modals --- */
.custom-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    display: none;
    align-items: center;
    justify-content: center;
}

.custom-modal.active {
    display: flex;
}

.custom-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
}

.custom-modal-content {
    position: relative;
    background: white;
    border-radius: 20px;
    z-index: 10001;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}

.close-modal {
    position: absolute;
    top: 20px;
    right: 25px;
    font-size: 30px;
    cursor: pointer;
    color: var(--text);
    z-index: 10;
    transition: color 0.3s;
}

.close-modal:hover {
    color: var(--primary);
}

/* Gallery Modal */
.gallery-content {
    width: 90%;
    max-width: 1200px;
    max-height: 90vh;
    padding: 40px;
    overflow-y: auto;
}

.gallery-content h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 2rem;
    color: var(--text);
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.gallery-item {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    background: #f5f5f5;
    aspect-ratio: 3/4;
}

.gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
}

.gallery-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.gallery-item:hover img {
    transform: scale(1.05);
}

.gallery-item-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 15px;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    color: white;
    text-align: center;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.3s;
}

.gallery-item:hover .gallery-item-overlay {
    opacity: 1;
}

/* Product Detail Modal */
.product-content {
    width: 90%;
    max-width: 1000px;
    max-height: 90vh;
    overflow-y: auto;
}

.product-layout {
    display: flex;
    flex-direction: column;
}

@media (min-width: 768px) {
    .product-layout {
        flex-direction: row;
    }
}

.product-gallery {
    flex: 1;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
}

.product-gallery img {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.product-info-panel {
    flex: 1;
    padding: 50px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

#detail-title {
    font-size: 2.2rem;
    margin-bottom: 10px;
    color: var(--text);
}

.detail-price {
    font-size: 1.5rem;
    color: var(--primary);
    font-weight: 700;
    margin-bottom: 25px;
}

.detail-options {
    margin-top: 25px;
}

.detail-options label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--text);
}

.detail-options select {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s;
}

.detail-options select:focus {
    border-color: var(--primary);
}
"""

with open('style.css', 'a', encoding='utf-8') as f:
    f.write('\n' + css_styles)


# --- 3. UPDATE JS ---
# I will append new logic to handle the new modals. I need to override the old Lightbox logic attached to `.btn-icon`.

js_logic = """
    // --- Ecommerce Modals Logic ---
    const galleryModal = document.getElementById('category-gallery-modal');
    const productModal = document.getElementById('product-detail-modal');
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryTitle = document.getElementById('gallery-title');
    
    // Close functionality
    document.querySelectorAll('.close-modal, .custom-modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
            const modal = e.target.closest('.custom-modal');
            if(modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Override the old lightbox click
    document.querySelectorAll('.btn-icon').forEach(btn => {
        // Remove old listener by cloning
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = newBtn.closest('.product-card');
            const categoryName = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.product-price').textContent;
            const imagesAttr = newBtn.getAttribute('data-images');
            
            if (imagesAttr) {
                openGalleryModal(categoryName, priceText, imagesAttr.split(','));
            }
        });
    });

    function openGalleryModal(title, basePrice, images) {
        galleryTitle.textContent = title;
        galleryGrid.innerHTML = '';
        
        images.forEach((src, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item fade-in-up';
            item.style.animationDelay = `${index * 0.05}s`;
            
            item.innerHTML = `
                <img src="${src}" alt="Modèle ${index + 1}" loading="lazy">
                <div class="gallery-item-overlay">Voir détails</div>
            `;
            
            item.addEventListener('click', () => {
                openProductModal(`Modèle ${index + 1}`, basePrice, src);
            });
            
            galleryGrid.appendChild(item);
        });
        
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function openProductModal(modelName, price, imgSrc) {
        // Optional: close gallery modal or keep it behind
        // galleryModal.classList.remove('active');
        
        document.getElementById('detail-title').textContent = modelName;
        document.getElementById('detail-price').textContent = price;
        document.getElementById('detail-img').src = imgSrc;
        
        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
"""

with open('script.js', 'r', encoding='utf-8') as f:
    script_content = f.read()

# Insert before last });
last_bracket = script_content.rfind('});')
if last_bracket != -1:
    new_script = script_content[:last_bracket] + js_logic + '\n});\n'
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(new_script)

print("Ecommerce Modals Integrated.")
