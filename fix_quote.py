import re

# --- 1. Fix HTML ---
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the modal wrapper
old_wrapper = '<div id="quote-modal" class="modal">'
new_wrapper = '<div id="quote-modal" class="custom-modal">\n        <div class="custom-modal-overlay"></div>'
html = html.replace(old_wrapper, new_wrapper)

# Replace the modal content class
old_content = '<div class="modal-content quote-modal-content fade-in-up">'
new_content = '<div class="custom-modal-content quote-modal-content fade-in-up">'
html = html.replace(old_content, new_content)

# Replace the close button X
old_close = '<span class="close-modal" onclick="closeQuoteModal()"><i class="ph ph-x"></i></span>'
new_close = '<span class="close-modal" onclick="closeQuoteModal()">&times;</span>'
html = html.replace(old_close, new_close)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)


# --- 2. Fix JS ---
with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace openQuoteModal logic
old_open = """function openQuoteModal() {
    if(quoteModal) {
        quoteModal.style.display = 'flex';
    }
}"""

new_open = """function openQuoteModal() {
    if(quoteModal) {
        quoteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}"""
js = js.replace(old_open, new_open)

# Replace closeQuoteModal logic
old_close = """function closeQuoteModal() {
    if(quoteModal) {
        quoteModal.style.display = 'none';
    }
}"""

new_close = """function closeQuoteModal() {
    if(quoteModal) {
        quoteModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}"""
js = js.replace(old_close, new_close)

# Replace click outside logic
# The existing logic is window.addEventListener('click', (e) => { if (e.target == quoteModal) { closeQuoteModal(); } });
# With custom-modal, the overlay is usually e.target, or maybe it's just the overlay div. I'll replace the old window click logic with overlay click.

old_click = """// Close when clicking outside
window.addEventListener('click', (e) => {
    if (e.target == quoteModal) {
        closeQuoteModal();
    }
});"""

new_click = """// Close when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('custom-modal-overlay') && e.target.parentElement.id === 'quote-modal') {
        closeQuoteModal();
    }
});"""
js = js.replace(old_click, new_click)


with open('script.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Modal HTML and JS fixed.")
