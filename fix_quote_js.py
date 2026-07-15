import re

with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Remove the global constant
js = js.replace("const quoteModal = document.getElementById('quote-modal');\n\n", "")

# Update open function
old_open = """function openQuoteModal() {
    if(quoteModal) {
        quoteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}"""
new_open = """function openQuoteModal() {
    const quoteModal = document.getElementById('quote-modal');
    if(quoteModal) {
        quoteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}"""
js = js.replace(old_open, new_open)

# Update close function
old_close = """function closeQuoteModal() {
    if(quoteModal) {
        quoteModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}"""
new_close = """function closeQuoteModal() {
    const quoteModal = document.getElementById('quote-modal');
    if(quoteModal) {
        quoteModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}"""
js = js.replace(old_close, new_close)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("JS updated successfully.")
