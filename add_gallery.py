import re
import json

image_data = {
  "assets": ["assets/toge2.jpg", "assets/toge1.jpg"],
  "assets/toge-licence-master/model 2": ["assets/toge-licence-master/model%202/PHOTO-2026-07-03-21-35-28%203.jpg", "assets/toge-licence-master/model%202/PHOTO-2026-07-03-21-35-28%202.jpg"],
  "assets/toge-licence-master/Model 5": ["assets/toge-licence-master/Model%205/PHOTO-2026-07-03-21-35-33%202.jpg", "assets/toge-licence-master/Model%205/PHOTO-2026-07-03-21-35-33.jpg"],
  "assets/toge-licence-master/Model 4": ["assets/toge-licence-master/Model%204/PHOTO-2026-07-03-21-35-32%203.jpg", "assets/toge-licence-master/Model%204/PHOTO-2026-07-03-21-35-32%202.jpg", "assets/toge-licence-master/Model%204/PHOTO-2026-07-03-21-35-31%202.jpg", "assets/toge-licence-master/Model%204/PHOTO-2026-07-03-21-35-31%203.jpg"],
  "assets/toge-licence-master/Model 3": ["assets/toge-licence-master/Model%203/PHOTO-2026-07-03-21-35-29%203.jpg", "assets/toge-licence-master/Model%203/PHOTO-2026-07-03-21-35-29%202.jpg"],
  "assets/toge-licence-master/Model 6": ["assets/toge-licence-master/Model%206/PHOTO-2026-07-03-21-35-32.jpg"],
  "assets/toge-licence-master/Model 1": ["assets/toge-licence-master/Model%201/PHOTO-2026-07-03-21-35-30%202.jpg", "assets/toge-licence-master/Model%201/PHOTO-2026-07-03-21-35-32%204.jpg", "assets/toge-licence-master/Model%201/PHOTO-2026-07-03-21-35-30.jpg", "assets/toge-licence-master/Model%201/PHOTO-2026-07-03-21-35-31.jpg"],
  "assets/toge-licence-master/Model 8": ["assets/toge-licence-master/Model%208/PHOTO-2026-07-03-21-35-28.jpg"],
  "assets/toge-licence-master/Model 7": ["assets/toge-licence-master/Model%207/PHOTO-2026-07-03-21-35-29.jpg"],
  "assets/toge-enfant": ["assets/toge-enfant/PHOTO-2026-07-03-21-31-05%203.jpg", "assets/toge-enfant/PHOTO-2026-07-03-21-31-06%205.jpg", "assets/toge-enfant/PHOTO-2026-07-03-21-31-06%204.jpg"],
  "assets/toge-enfant/model 2": ["assets/toge-enfant/model%202/PHOTO-2026-07-03-21-31-06%203.jpg", "assets/toge-enfant/model%202/PHOTO-2026-07-03-21-31-06.jpg", "assets/toge-enfant/model%202/PHOTO-2026-07-03-21-31-06%202.jpg"],
  "assets/toge-enfant/model 1": ["assets/toge-enfant/model%201/PHOTO-2026-07-03-21-31-05%202.jpg", "assets/toge-enfant/model%201/PHOTO-2026-07-03-21-31-04.jpg", "assets/toge-enfant/model%201/PHOTO-2026-07-03-21-31-04%202.jpg", "assets/toge-enfant/model%201/PHOTO-2026-07-03-21-31-04%203.jpg", "assets/toge-enfant/model%201/PHOTO-2026-07-03-21-31-05.jpg"]
}

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

def replace_button(match):
    full_match = match.group(0)
    img_src = match.group(1)
    
    parts = img_src.split('/')
    dir_path = '/'.join(parts[:-1]).replace('%20', ' ')
    
    images = []
    if dir_path in image_data:
        images = image_data[dir_path]
    
    if dir_path == "assets/toge-enfant":
        images = [img_src]
    
    if dir_path == "assets":
        images = [img_src]
        
    data_images = ",".join(images)
    
    # We replace `<button class="btn-icon">` with `<button class="btn-icon" data-images="...">`
    return full_match.replace('<button class="btn-icon">', f'<button class="btn-icon" data-images="{data_images}">')

pattern = re.compile(r'<img\s+src="([^"]+)"[^>]*>\s*<div\s+class="product-overlay">\s*<button\s+class="btn-icon"><i\s+class="ph ph-eye"></i>\s*Aperçu</button>')
content = pattern.sub(replace_button, content)

lightbox_html = """
    <!-- Lightbox -->
    <div id="lightbox" class="lightbox">
        <span class="lightbox-close">&times;</span>
        <button class="lightbox-prev"><i class="ph ph-caret-left"></i></button>
        <div class="lightbox-content">
            <img id="lightbox-img" src="" alt="Aperçu">
        </div>
        <button class="lightbox-next"><i class="ph ph-caret-right"></i></button>
        <div class="lightbox-counter">1 / 1</div>
    </div>
"""
if '<div id="lightbox"' not in content:
    content = content.replace('</body>', lightbox_html + '\n</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML Updated.")
