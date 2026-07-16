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
    {'name': 'enfant', 'title': 'Collection Toges Enfant', 'price': '25 000 FCFA'},
    {'name': 'licence-master', 'title': 'Collection Toges Licence & Master', 'price': '60 000 FCFA'},
    {'name': 'doctorat', 'title': 'Collection Toges Doctorat', 'price': '125 000 FCFA'},
    {'name': 'international', 'title': 'Universités Privées', 'price': '20 000 FCFA'}
]

def generate_page(cat, index):
    data = groups[index]
    image_groups = data.split('|')
    
    grid_html = '<div class="category-list" id="category-grid">\n'
    for i, groupStr in enumerate(image_groups):
        srcs = groupStr.split(',')
        imagesHtml = ''
        for j, src in enumerate(srcs):
            opacity = '1' if j == 0 else '0'
            imagesHtml += f'<img src="{src}" alt="Modèle {i + 1} - {j+1}" loading="lazy" style="opacity:{opacity}; position: absolute; top:0; left:0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.5s ease-in-out;">\n'
        
        dotsHtml = ''
        if len(srcs) > 1:
            dots = ''
            for j in range(len(srcs)):
                bg = '#000' if j == 0 else 'rgba(255,255,255,0.9)'
                border = '' if j == 0 else 'border: 1px solid #ccc;'
                dots += f'<div style="width: 8px; height: 8px; border-radius: 50%; background: {bg}; {border} margin: 0 3px;"></div>'
            dotsHtml = f'<div class="carousel-dots" style="position: absolute; bottom: 15px; width: 100%; display: flex; justify-content: center; z-index: 2;">{dots}</div>'
            
        grid_html += f'''
        <div class="gallery-item" data-images="{groupStr}" style="margin-bottom: 40px; cursor: pointer;">
            <div class="gallery-image" style="position: relative; width: 100%; padding-bottom: 125%; background: #f5f5f5; overflow: hidden;">
                {imagesHtml}
                {dotsHtml}
                <div style="position: absolute; top: 15px; right: 15px; z-index: 10; background: transparent; border: none; font-size: 24px; color: #333;">
                    <i class="ph ph-heart"></i>
                </div>
            </div>
            <div class="gallery-info" style="text-align: left; padding: 15px 0;">
                <div style="font-size: 0.85rem; color: #666; margin-bottom: 10px;">Couleur : <strong>Assortie</strong></div>
                <div style="display: inline-block; background: #9c4b8b; color: white; padding: 2px 8px; font-size: 0.75rem; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">PREMIUM</div>
                
                <h3 style="font-family: 'Oswald', sans-serif; font-size: 1.8rem; font-weight: 700; color: #111; margin: 0 0 5px 0;">Modèle {i + 1}</h3>
                <p style="font-size: 1rem; color: #333; margin-bottom: 5px;">{cat['title']}</p>
                <div style="text-decoration: underline; font-size: 0.9rem; color: #555; margin-bottom: 15px;">Description détaillée</div>
                
                <div style="font-size: 1.4rem; font-weight: 700; color: #d00000;">{cat['price']}</div>
            </div>
        </div>
        '''
    grid_html += '</div>\n'

    page_html = header + f'''
    <main style="padding-top: 100px; background: #fff;">
        <section class="section" style="padding-top: 0;">
            <div class="container" style="max-width: 800px; margin: 0 auto; padding: 0 15px;">
                {grid_html}
            </div>
        </section>
    </main>
    ''' + footer
    
    with open(f"{cat['name']}.html", 'w', encoding='utf-8') as f:
        f.write(page_html)

for idx, cat in enumerate(categories):
    generate_page(cat, idx)

print('Generated styled category HTML files.')
