import re

# --- 1. Modify HTML ---
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the button
old_btn = '<a href="#contact" class="btn-primary btn-large">Demander un devis personnalisé</a>'
new_btn = '<a href="#" onclick="openQuoteModal(); return false;" class="btn-primary btn-large">Demander un devis personnalisé</a>'
html = html.replace(old_btn, new_btn)

# Add the Modal before </body>
quote_modal_html = """
    <!-- Custom Quote Modal -->
    <div id="quote-modal" class="modal">
        <div class="modal-content quote-modal-content fade-in-up">
            <span class="close-modal" onclick="closeQuoteModal()"><i class="ph ph-x"></i></span>
            <h2>Demander un devis personnalisé</h2>
            <p style="margin-bottom: 20px; color: var(--text-light);">Veuillez remplir ce formulaire pour obtenir une proposition chiffrée adaptée à vos besoins.</p>
            
            <form id="quote-form" onsubmit="submitQuoteForm(event)">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="quote-name">Nom complet du responsable</label>
                        <input type="text" id="quote-name" required placeholder="Ex: Jean Dupont">
                    </div>
                    <div class="form-group">
                        <label for="quote-school">Nom de l'établissement / Université</label>
                        <input type="text" id="quote-school" required placeholder="Ex: Université de Cocody">
                    </div>
                    <div class="form-group">
                        <label for="quote-phone">Numéro WhatsApp</label>
                        <input type="tel" id="quote-phone" required placeholder="Ex: +225 01 02 03 04 05">
                    </div>
                    <div class="form-group">
                        <label for="quote-email">Adresse Email</label>
                        <input type="email" id="quote-email" required placeholder="Ex: contact@ecole.com">
                    </div>
                    <div class="form-group">
                        <label for="quote-type">Type de toges souhaité</label>
                        <select id="quote-type" required>
                            <option value="">Sélectionnez un type</option>
                            <option value="Maternelle">Maternelle</option>
                            <option value="Primaire">Primaire</option>
                            <option value="Collège / Lycée">Collège / Lycée</option>
                            <option value="Licence / Master">Licence / Master</option>
                            <option value="Doctorat">Doctorat</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="quote-quantity">Quantité estimée</label>
                        <select id="quote-quantity" required>
                            <option value="">Sélectionnez une tranche</option>
                            <option value="Moins de 10">Moins de 10</option>
                            <option value="De 10 à 50">De 10 à 50</option>
                            <option value="De 50 à 100">De 50 à 100</option>
                            <option value="Plus de 100">Plus de 100</option>
                        </select>
                    </div>
                </div>

                <div class="form-group" style="margin-top: 15px;">
                    <label for="quote-date">Date prévue de la cérémonie</label>
                    <input type="date" id="quote-date">
                </div>

                <div class="form-options">
                    <p style="font-weight: 600; margin-bottom: 10px;">Options de personnalisation :</p>
                    <label class="checkbox-label">
                        <input type="checkbox" id="opt-embroidery" value="Broderie du logo"> Broderie du logo de l'établissement
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="opt-sash" value="Écharpes personnalisées"> Écharpes personnalisées avec le nom de l'école
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="opt-cap" value="Toques avec pompons"> Toques avec pompons aux couleurs de l'école
                    </label>
                </div>

                <div class="form-group" style="margin-top: 15px;">
                    <label for="quote-message">Précisions supplémentaires</label>
                    <textarea id="quote-message" rows="3" placeholder="Avez-vous des besoins spécifiques ?"></textarea>
                </div>

                <button type="submit" class="btn-primary" style="width: 100%; margin-top: 20px;">
                    <i class="ph ph-whatsapp-logo" style="margin-right: 8px; font-size: 1.2rem;"></i> Envoyer ma demande via WhatsApp
                </button>
            </form>
        </div>
    </div>
</body>
"""

html = html.replace('</body>', quote_modal_html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)


# --- 2. Append CSS ---
css = """
/* --- Quote Form Modal Styles --- */
.quote-modal-content {
    max-width: 700px;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
    text-align: left;
}

.form-group label {
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 5px;
    color: var(--text-dark);
}

.form-group input, 
.form-group select, 
.form-group textarea {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.95rem;
    background-color: #f9f9f9;
    transition: all 0.3s ease;
}

.form-group input:focus, 
.form-group select:focus, 
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(188, 42, 118, 0.1);
}

.form-options {
    text-align: left;
    background: #fbfbfd;
    padding: 15px;
    border-radius: 8px;
    margin-top: 15px;
    border: 1px solid #eee;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    font-size: 0.9rem;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--primary);
}

@media (max-width: 600px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
}
"""

with open('style.css', 'a', encoding='utf-8') as f:
    f.write('\n' + css)


# --- 3. Append JS ---
js = """
// --- Quote Modal Logic ---
const quoteModal = document.getElementById('quote-modal');

function openQuoteModal() {
    if(quoteModal) {
        quoteModal.style.display = 'flex';
    }
}

function closeQuoteModal() {
    if(quoteModal) {
        quoteModal.style.display = 'none';
    }
}

// Close when clicking outside
window.addEventListener('click', (e) => {
    if (e.target == quoteModal) {
        closeQuoteModal();
    }
});

function submitQuoteForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('quote-name').value;
    const school = document.getElementById('quote-school').value;
    const phone = document.getElementById('quote-phone').value;
    const email = document.getElementById('quote-email').value;
    const type = document.getElementById('quote-type').value;
    const quantity = document.getElementById('quote-quantity').value;
    const date = document.getElementById('quote-date').value;
    const message = document.getElementById('quote-message').value;
    
    // Get checked options
    const options = [];
    if(document.getElementById('opt-embroidery').checked) options.push("Broderie du logo");
    if(document.getElementById('opt-sash').checked) options.push("Écharpes personnalisées");
    if(document.getElementById('opt-cap').checked) options.push("Toques avec pompons");
    
    const optionsText = options.length > 0 ? options.join(", ") : "Aucune option spécifique";
    const dateText = date ? date : "Non définie";
    const msgText = message ? `\\n📝 *Précisions* : ${message}` : "";

    // WhatsApp Message formatting
    const waText = `🎓 *NOUVELLE DEMANDE DE DEVIS (GROUPE)* 🎓\\n\\n` +
                   `👤 *Responsable* : ${name}\\n` +
                   `🏫 *Établissement* : ${school}\\n` +
                   `📞 *Contact* : ${phone}\\n` +
                   `✉️ *Email* : ${email}\\n\\n` +
                   `👕 *Type de toge* : ${type}\\n` +
                   `📦 *Quantité* : ${quantity}\\n` +
                   `📅 *Date prévue* : ${dateText}\\n\\n` +
                   `✨ *Options souhaitées* : ${optionsText}` +
                   msgText;
                   
    // Using the same WhatsApp number variable if it exists in scope, otherwise use a placeholder
    const phoneNumber = typeof whatsappNumber !== 'undefined' ? whatsappNumber : "2250102030405";
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waText)}`;
    
    closeQuoteModal();
    window.open(waUrl, '_blank');
}
"""

with open('script.js', 'a', encoding='utf-8') as f:
    f.write('\n' + js)

print("HTML, CSS, and JS updated successfully.")
