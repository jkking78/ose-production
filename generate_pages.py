import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

header_match = re.search(r'(.*?<\/header>)', html, re.DOTALL)
header = header_match.group(1)
header = header.replace('href="#', 'href="index.html#')

footer_match = re.search(r'(<!-- Footer -->.*)', html, re.DOTALL)
footer = footer_match.group(1)

groups = re.findall(r'data-images="([^"]+)"', html)

categories = [
    {'name': 'enfant', 'title': 'Collection Toges Enfant', 'price': 'À partir de 25 000 FCFA'},
    {'name': 'licence-master', 'title': 'Collection Toges Licence & Master', 'price': 'À partir de 60 000 FCFA'},
    {'name': 'doctorat', 'title': 'Collection Toges Doctorat', 'price': 'À partir de 125 000 FCFA'},
    {'name': 'international', 'title': 'Universités Privées', 'price': 'À partir de 20 000 FCFA'}
]

def generate_page(cat, index):
    data = groups[index]
    image_groups = data.split('|')
    
    grid_html = '<div class="gallery-grid" id="category-grid">\n'
    for i, groupStr in enumerate(image_groups):
        srcs = groupStr.split(',')
        imagesHtml = ''
        for j, src in enumerate(srcs):
            opacity = '1' if j == 0 else '0'
            imagesHtml += f'<img src="{src}" alt="Modèle {i + 1} - {j+1}" loading="lazy" style="opacity:{opacity}; position: absolute; top:0; left:0; transition: opacity 0.5s ease-in-out;">\n'
        
        dotsHtml = ''
        if len(srcs) > 1:
            dots = ''
            for j in range(len(srcs)):
                bg = 'var(--magenta)' if j == 0 else 'rgba(255,255,255,0.7)'
                dots += f'<div style="width: 6px; height: 6px; border-radius: 50%; background: {bg};"></div>'
            dotsHtml = f'<div class="carousel-dots" style="position: absolute; bottom: 10px; width: 100%; display: flex; justify-content: center; gap: 5px; z-index: 2;">{dots}</div>'
            
        grid_html += f'''
        <div class="gallery-item" data-images="{groupStr}">
            <div class="gallery-image" style="position: relative;">
                {imagesHtml}
                {dotsHtml}
            </div>
            <div class="gallery-info" style="text-align: center; margin-top: 10px;">
                <h3 style="text-align: left; margin-bottom: 10px;">Modèle {i + 1}</h3>
                <button class="btn-primary btn-voir" style="width: 100%; padding: 10px; font-size: 0.9rem;">Voir</button>
            </div>
        </div>
        '''
    grid_html += '</div>\n'

    page_html = header + f'''
    <main style="padding-top: 100px;">
        <section class="section">
            <div class="container">
                <div class="section-header fade-in-up">
                    <h2 style="margin-bottom: 2rem;">{cat['title']}</h2>
                    <p style="margin-bottom: 3rem;">{cat['price']}</p>
                </div>
                {grid_html}
            </div>
        </section>
    </main>
    ''' + footer
    
    with open(f"{cat['name']}.html", 'w', encoding='utf-8') as f:
        f.write(page_html)

for idx, cat in enumerate(categories):
    generate_page(cat, idx)

print('Generated category HTML files.')
