import re

# 1. UPDATE HTML
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace .detail-options block
old_options = """<div class="detail-options">
                        <label for="size-select">Sélectionnez votre taille :</label>
                        <select id="size-select">
                            <option>S (Moins de 1m60)</option>
                            <option>M (1m60 - 1m75)</option>
                            <option>L (1m75 - 1m85)</option>
                            <option>XL (Plus de 1m85)</option>
                        </select>
                    </div>"""

new_options = """<div class="detail-options dynamic-measurements-container">
                        <div class="quantity-wrapper">
                            <label for="toga-quantity">Combien de toges souhaitez-vous commander ?</label>
                            <input type="number" id="toga-quantity" class="quantity-input" min="1" max="100" value="1">
                        </div>
                        <div id="toga-forms-wrapper" class="forms-wrapper">
                            <!-- Dynamic forms will be injected here -->
                        </div>
                    </div>"""

if old_options in html:
    html = html.replace(old_options, new_options)
else:
    print("Warning: old options not found. Using regex fallback.")
    html = re.sub(r'<div class="detail-options".*?</div>', new_options, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)


# 2. UPDATE CSS
css = """
/* Dynamic Form Styles */
.dynamic-measurements-container {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.quantity-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.quantity-wrapper label {
    font-weight: 600;
    color: var(--text);
}

.quantity-input {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    width: 100%;
    outline: none;
    transition: border-color 0.3s;
}

.quantity-input:focus {
    border-color: var(--primary);
}

.forms-wrapper {
    max-height: 40vh; /* Allow scrolling if many togas */
    overflow-y: auto;
    padding-right: 10px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Custom Scrollbar for forms */
.forms-wrapper::-webkit-scrollbar {
    width: 6px;
}
.forms-wrapper::-webkit-scrollbar-track {
    background: #f1f1f1; 
    border-radius: 4px;
}
.forms-wrapper::-webkit-scrollbar-thumb {
    background: #ccc; 
    border-radius: 4px;
}
.forms-wrapper::-webkit-scrollbar-thumb:hover {
    background: var(--primary); 
}

.toga-form-block {
    background: #f9f9f9;
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 15px;
}

.toga-form-header {
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--primary);
    margin-bottom: 12px;
    border-bottom: 2px solid #eee;
    padding-bottom: 5px;
}

.form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
}

.form-group {
    flex: 1 1 calc(50% - 10px);
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.form-group label {
    font-size: 0.85rem;
    color: #555;
    font-weight: 500;
}

.form-group input, .form-group select {
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
    outline: none;
}

.form-group input:focus, .form-group select:focus {
    border-color: var(--primary);
}
"""

with open('style.css', 'a', encoding='utf-8') as f:
    f.write('\n' + css)

# 3. UPDATE JS
with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

# We need to inject the logic for dynamic form generation
new_js_logic = """
    // --- Dynamic Form Logic ---
    const quantityInput = document.getElementById('toga-quantity');
    const formsWrapper = document.getElementById('toga-forms-wrapper');
    
    function generateTogaForms() {
        if (!quantityInput || !formsWrapper) return;
        
        let qty = parseInt(quantityInput.value);
        if (isNaN(qty) || qty < 1) qty = 1;
        if (qty > 100) qty = 100;
        
        let html = '';
        for (let i = 1; i <= qty; i++) {
            html += `
                <div class="toga-form-block fade-in-up" style="animation-delay: ${Math.min(i*0.05, 0.5)}s">
                    <div class="toga-form-header">Toge ${i}</div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Tour de poitrine (cm)</label>
                            <input type="number" placeholder="Ex: 95" class="toga-measure" data-toga="${i}" data-field="poitrine">
                        </div>
                        <div class="form-group">
                            <label>Hauteur totale (cm)</label>
                            <input type="number" placeholder="Ex: 175" class="toga-measure" data-toga="${i}" data-field="hauteur">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Tour de tête (cm)</label>
                            <input type="number" placeholder="Ex: 58" class="toga-measure" data-toga="${i}" data-field="tete">
                        </div>
                        <div class="form-group">
                            <label>Long. manches (cm)</label>
                            <input type="number" placeholder="Ex: 60" class="toga-measure" data-toga="${i}" data-field="manches">
                        </div>
                    </div>
                    <div class="form-row" style="margin-bottom: 0;">
                        <div class="form-group" style="flex: 1 1 100%;">
                            <label>Nom pour broderie (Optionnel)</label>
                            <input type="text" placeholder="Ex: Jean Dupont" class="toga-measure" data-toga="${i}" data-field="broderie">
                        </div>
                    </div>
                </div>
            `;
        }
        formsWrapper.innerHTML = html;
        
        // Ensure fade-in-up class renders since it doesn't have an observer
        const newBlocks = formsWrapper.querySelectorAll('.toga-form-block.fade-in-up');
        newBlocks.forEach(block => {
            // we force it visible, or change CSS. 
            // Better: just add visible class.
            setTimeout(() => block.classList.add('visible'), 50);
        });
    }

    if (quantityInput) {
        quantityInput.addEventListener('input', generateTogaForms);
    }
    
    // We need to override the updateProductModalView to also generate the form initially
    const originalUpdateProductModalView = updateProductModalView;
    updateProductModalView = function() {
        originalUpdateProductModalView();
        // Reset quantity to 1 when opening a new product
        if (quantityInput) {
            quantityInput.value = 1;
            generateTogaForms();
        }
    };
    
    // Update the Toast message for Cart
    if (btnAddCart) {
        // Clone and replace to remove old listener
        const newBtnAddCart = btnAddCart.cloneNode(true);
        btnAddCart.parentNode.replaceChild(newBtnAddCart, btnAddCart);
        
        newBtnAddCart.addEventListener('click', () => {
            let qty = parseInt(quantityInput.value) || 1;
            toast.textContent = `${qty} Toge(s) ajoutée(s) au panier avec les mesures !`;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        });
    }
"""

last_bracket = js.rfind('});')
if last_bracket != -1:
    js = js[:last_bracket] + new_js_logic + '\n});\n'

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Dynamic form script integrated.")
