import re

# 1. UPDATE HTML
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace product-gallery block to add arrows and cursor
old_gallery = """<div class="product-gallery">
                    <img id="detail-img" src="" alt="Toge">
                </div>"""

new_gallery = """<div class="product-gallery" style="position: relative;">
                    <button class="detail-prev" id="detail-prev"><i class="ph ph-caret-left"></i></button>
                    <img id="detail-img" src="" alt="Toge" style="cursor: zoom-in;" title="Cliquez pour agrandir">
                    <button class="detail-next" id="detail-next"><i class="ph ph-caret-right"></i></button>
                </div>"""

html = html.replace(old_gallery, new_gallery)

# Add an ID to the add to cart button
html = html.replace('<button class="btn-primary" style="width:100%; margin-top:20px;">', '<button id="btn-add-cart" class="btn-primary" style="width:100%; margin-top:20px;">')

# Add Toast Notification HTML if not present
toast_html = """
    <!-- Toast Notification -->
    <div id="toast" class="toast">Produit ajouté au panier !</div>
"""
if 'id="toast"' not in html:
    html = html.replace('</body>', toast_html + '\n</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

# 2. UPDATE CSS
css = """
/* Product Detail Arrows */
.detail-prev, .detail-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.3);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
    transition: background 0.3s;
    z-index: 10;
}
.detail-prev:hover, .detail-next:hover {
    background: var(--primary);
}
.detail-prev { left: 10px; }
.detail-next { right: 10px; }

/* Toast */
.toast {
    position: fixed;
    bottom: -100px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--primary);
    color: white;
    padding: 15px 30px;
    border-radius: 50px;
    font-weight: 500;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    z-index: 99999;
    transition: bottom 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.toast.show {
    bottom: 40px;
}
"""
with open('style.css', 'a', encoding='utf-8') as f:
    f.write('\n' + css)

# 3. UPDATE JS
with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

# I need to change openProductModal to accept (images, index, price)
# Find the definition of openGalleryModal and openProductModal
# We will use re.sub or just replace the block since we injected it recently.

# Let's replace the whole Ecommerce Modals Logic block
old_js_pattern = re.compile(r'// --- Ecommerce Modals Logic ---.*', re.DOTALL)

new_js = """// --- Ecommerce Modals Logic ---
    const galleryModal = document.getElementById('category-gallery-modal');
    const productModal = document.getElementById('product-detail-modal');
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryTitle = document.getElementById('gallery-title');
    const detailImg = document.getElementById('detail-img');
    const detailPrev = document.getElementById('detail-prev');
    const detailNext = document.getElementById('detail-next');
    const btnAddCart = document.getElementById('btn-add-cart');
    const toast = document.getElementById('toast');
    
    let currentDetailImages = [];
    let currentDetailIndex = 0;
    let currentDetailPrice = '';
    
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
            item.className = 'gallery-item';
            
            item.innerHTML = `
                <img src="${src}" alt="Modèle ${index + 1}" loading="lazy">
                <div class="gallery-item-overlay">Voir détails</div>
            `;
            
            item.addEventListener('click', () => {
                openProductModal(images, index, basePrice);
            });
            
            galleryGrid.appendChild(item);
        });
        
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function openProductModal(images, index, price) {
        currentDetailImages = images;
        currentDetailIndex = index;
        currentDetailPrice = price;
        updateProductModalView();
        
        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function updateProductModalView() {
        document.getElementById('detail-title').textContent = `Modèle ${currentDetailIndex + 1}`;
        document.getElementById('detail-price').textContent = currentDetailPrice;
        detailImg.src = currentDetailImages[currentDetailIndex];
        
        // Hide arrows if only 1 image
        if (currentDetailImages.length <= 1) {
            detailPrev.style.display = 'none';
            detailNext.style.display = 'none';
        } else {
            detailPrev.style.display = 'flex';
            detailNext.style.display = 'flex';
        }
    }

    // Prev/Next in Product Modal
    detailPrev.addEventListener('click', () => {
        currentDetailIndex = (currentDetailIndex - 1 + currentDetailImages.length) % currentDetailImages.length;
        updateProductModalView();
    });
    
    detailNext.addEventListener('click', () => {
        currentDetailIndex = (currentDetailIndex + 1) % currentDetailImages.length;
        updateProductModalView();
    });
    
    // Zoom in on image click (open Lightbox)
    detailImg.addEventListener('click', () => {
        // We reuse the original openLightbox (which has been modified to support autoplay)
        // Pass only the current image so it opens fullscreen
        openLightbox(currentDetailImages[currentDetailIndex]);
        // Put lightbox above product modal by setting z-index higher dynamically
        document.getElementById('lightbox').style.zIndex = '100000';
    });
    
    // Add to cart Toast
    if (btnAddCart) {
        btnAddCart.addEventListener('click', () => {
            const size = document.getElementById('size-select').value;
            toast.textContent = `Toge (Taille ${size.split(' ')[0]}) ajoutée au panier !`;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        });
    }

});
"""

# Replace in js
if '// --- Ecommerce Modals Logic ---' in js:
    js = old_js_pattern.sub(new_js, js)
else:
    # If not found for some reason, just insert before last });
    last_bracket = js.rfind('});')
    js = js[:last_bracket] + new_js + '\n});\n'

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Product Modal UI updated successfully.")
