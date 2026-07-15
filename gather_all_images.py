import os
import json

data = {}
base_dir = "assets"
for root, dirs, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.jpg') or f.endswith('.png'):
            path = os.path.join(root, f)
            rel_path = os.path.relpath(path, start=".")
            # Determine main category
            if 'toge-enfant' in rel_path:
                cat = 'toge-enfant'
            elif 'toge-licence-master' in rel_path:
                cat = 'toge-licence-master'
            else:
                cat = 'other'
                
            if cat not in data:
                data[cat] = []
            data[cat].append(rel_path.replace(' ', '%20'))

print(json.dumps(data, indent=2))
