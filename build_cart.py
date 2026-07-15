import re

# 1. UPDATE HTML
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

cart_html = """
    <!-- Floating Cart Button -->
    <div id="floating-cart" class="floating-cart">
        <i class="ph ph-shopping-cart"></i>
        <span id="cart-badge" class="cart-badge">0</span>
    </div>

    <!-- Cart Sidebar -->
    <div id="cart-sidebar" class="cart-sidebar">
        <div class="cart-header">
            <h2>Votre Panier</h2>
            <button id="close-cart" class="close-cart">&times;</button>
        </div>
        <div id="cart-items" class="cart-items">
            <!-- Cart items will be injected here by JS -->
        </div>
        <div class="cart-footer">
            <button id="btn-checkout-whatsapp" class="btn-primary" style="width: 100%;">
                <i class="ph ph-whatsapp-logo"></i> Commander via WhatsApp
            </button>
        </div>
    </div>
    <div id="cart-overlay" class="cart-overlay"></div>
"""

if 'id="floating-cart"' not in html:
    html = html.replace('</body>', cart_html + '\n</body>')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)


# 2. UPDATE CSS
css = """
/* --- Cart Styles --- */
.floating-cart {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: var(--primary);
    color: white;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    cursor: pointer;
    z-index: 9999;
    transition: transform 0.3s, background 0.3s;
}

.floating-cart:hover {
    transform: scale(1.1);
    background: var(--secondary);
}

.cart-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: red;
    color: white;
    font-size: 14px;
    font-weight: bold;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 2px solid white;
}

.cart-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(5px);
    z-index: 10001;
    display: none;
    opacity: 0;
    transition: opacity 0.3s;
}

.cart-overlay.active {
    display: block;
    opacity: 1;
}

.cart-sidebar {
    position: fixed;
    top: 0;
    right: -400px;
    width: 100%;
    max-width: 400px;
    height: 100%;
    background: white;
    box-shadow: -10px 0 30px rgba(0,0,0,0.2);
    z-index: 10002;
    transition: right 0.4s cubic-bezier(0.77, 0, 0.175, 1);
    display: flex;
    flex-direction: column;
}

.cart-sidebar.active {
    right: 0;
}

.cart-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.cart-header h2 {
    font-size: 1.5rem;
    color: var(--text);
    margin: 0;
}

.close-cart {
    background: none;
    border: none;
    font-size: 30px;
    cursor: pointer;
    color: var(--text);
}

.cart-items {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.cart-item {
    background: #f9f9f9;
    border-radius: 12px;
    padding: 15px;
    position: relative;
    border: 1px solid #eee;
}

.cart-item h4 {
    margin: 0 0 10px 0;
    color: var(--primary);
    font-size: 1.1rem;
}

.cart-item p {
    margin: 5px 0;
    font-size: 0.9rem;
    color: #555;
}

.cart-item-toga {
    background: white;
    padding: 10px;
    border-radius: 8px;
    margin-top: 10px;
    border: 1px solid #eee;
    font-size: 0.85rem;
}

.remove-item {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    color: red;
    cursor: pointer;
    font-size: 1.2rem;
}

.cart-footer {
    padding: 20px;
    border-top: 1px solid #eee;
    background: white;
}
"""

with open('style.css', 'a', encoding='utf-8') as f:
    f.write('\n' + css)


# 3. UPDATE JS
with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

js_cart_logic = """
    // --- Shopping Cart Logic (localStorage) ---
    const whatsappNumber = "2250000000000"; // Remplacez par votre vrai numéro (indicatif + numéro)
    
    const floatingCart = document.getElementById('floating-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartBadge = document.getElementById('cart-badge');
    const btnCheckoutWhatsapp = document.getElementById('btn-checkout-whatsapp');
    
    let cart = JSON.parse(localStorage.getItem('ose_cart')) || [];
    
    function saveCart() {
        localStorage.setItem('ose_cart', JSON.stringify(cart));
        updateCartBadge();
        renderCart();
    }
    
    function updateCartBadge() {
        if(cartBadge) {
            cartBadge.textContent = cart.length;
            if(cart.length > 0) {
                cartBadge.style.display = 'flex';
                floatingCart.style.display = 'flex';
            } else {
                cartBadge.style.display = 'none';
                // Optional: hide floating cart when empty
                // floatingCart.style.display = 'none'; 
            }
        }
    }
    
    function renderCart() {
        if(!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:#999; margin-top:50px;">Votre panier est vide.</p>';
            return;
        }
        
        cart.forEach((item, itemIndex) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            
            let togasHtml = '';
            item.togas.forEach((toga, i) => {
                const title = toga.broderie ? `Toge ${i+1} (${toga.broderie})` : `Toge ${i+1}`;
                togasHtml += `
                    <div class="cart-item-toga">
                        <strong>${title}</strong><br>
                        Poitrine: ${toga.poitrine || 'N/A'}cm | Hauteur: ${toga.hauteur || 'N/A'}cm<br>
                        Tête: ${toga.tete || 'N/A'}cm | Manches: ${toga.manches || 'N/A'}cm
                    </div>
                `;
            });
            
            itemDiv.innerHTML = `
                <h4>${item.category} - ${item.modelName}</h4>
                <p><strong>Prix Base:</strong> ${item.price}</p>
                <p><strong>Quantité:</strong> ${item.quantity} toge(s)</p>
                <button class="remove-item" onclick="removeFromCart(${itemIndex})"><i class="ph ph-trash"></i></button>
                <div style="margin-top:10px;">${togasHtml}</div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });
    }
    
    // Make remove function global
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        saveCart();
    };
    
    // UI Interactions
    if(floatingCart) {
        floatingCart.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
        });
    }
    
    function closeCartSidebar() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }
    
    if(closeCartBtn) closeCartBtn.addEventListener('click', closeCartSidebar);
    if(cartOverlay) cartOverlay.addEventListener('click', closeCartSidebar);
    
    // Replace old Add to Cart logic to actually save to Cart
    if (btnAddCart) {
        const newBtnAddCart = btnAddCart.cloneNode(true);
        btnAddCart.parentNode.replaceChild(newBtnAddCart, btnAddCart);
        
        newBtnAddCart.addEventListener('click', () => {
            let qty = parseInt(quantityInput.value) || 1;
            
            // Gather all toga measurements
            let togasData = [];
            for (let i = 1; i <= qty; i++) {
                const poitrine = document.querySelector(`.toga-measure[data-toga="${i}"][data-field="poitrine"]`)?.value || '';
                const hauteur = document.querySelector(`.toga-measure[data-toga="${i}"][data-field="hauteur"]`)?.value || '';
                const tete = document.querySelector(`.toga-measure[data-toga="${i}"][data-field="tete"]`)?.value || '';
                const manches = document.querySelector(`.toga-measure[data-toga="${i}"][data-field="manches"]`)?.value || '';
                const broderie = document.querySelector(`.toga-measure[data-toga="${i}"][data-field="broderie"]`)?.value || '';
                
                togasData.push({ poitrine, hauteur, tete, manches, broderie });
            }
            
            // Get product info from Modal titles
            const categoryTitle = document.getElementById('gallery-title').textContent;
            const modelName = document.getElementById('detail-title').textContent;
            const price = document.getElementById('detail-price').textContent;
            const imageSrc = document.getElementById('detail-img').src;
            
            const cartItem = {
                category: categoryTitle,
                modelName: modelName,
                price: price,
                image: imageSrc,
                quantity: qty,
                togas: togasData
            };
            
            cart.push(cartItem);
            saveCart();
            
            // Show toast
            toast.textContent = `${qty} Toge(s) ajoutée(s) au panier avec succès !`;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
            
            // Automatically open cart for better UX
            setTimeout(() => {
                cartSidebar.classList.add('active');
                cartOverlay.classList.add('active');
                // Close product modal
                document.getElementById('product-detail-modal').classList.remove('active');
                // document.getElementById('category-gallery-modal').classList.remove('active');
            }, 1000);
        });
    }
    
    // WhatsApp Checkout
    if(btnCheckoutWhatsapp) {
        btnCheckoutWhatsapp.addEventListener('click', () => {
            if(cart.length === 0) return;
            
            let message = "Bonjour OSE Production ! Je souhaite passer une commande :%0A%0A";
            
            cart.forEach((item, index) => {
                message += `*--- ARTICLE ${index + 1} ---*%0A`;
                message += `Catégorie: ${item.category}%0A`;
                message += `Modèle: ${item.modelName}%0A`;
                message += `Quantité: ${item.quantity}%0A`;
                message += `Prix Base: ${item.price}%0A%0A`;
                
                message += `*Détails des mesures :*%0A`;
                item.togas.forEach((toga, i) => {
                    const title = toga.broderie ? `Toge ${i+1} (${toga.broderie})` : `Toge ${i+1}`;
                    message += `- ${title} : Poitrine ${toga.poitrine||'X'}cm, Hauteur ${toga.hauteur||'X'}cm, Tête ${toga.tete||'X'}cm, Manches ${toga.manches||'X'}cm%0A`;
                });
                message += `%0A`;
            });
            
            message += `Merci de m'indiquer la suite de la procédure.`;
            
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });
    }
    
    // Initial call
    updateCartBadge();
    renderCart();
"""

last_bracket = js.rfind('});')
if last_bracket != -1:
    js = js[:last_bracket] + js_cart_logic + '\n});\n'

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Cart script created.")
