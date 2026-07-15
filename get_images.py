import os
import json

data = {}
base_dir = "assets"
for root, dirs, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.jpg') or f.endswith('.png'):
            path = os.path.join(root, f)
            rel_path = os.path.relpath(path, start=".")
            dir_name = os.path.dirname(rel_path)
            if dir_name not in data:
                data[dir_name] = []
            data[dir_name].append(rel_path.replace(' ', '%20'))

print(json.dumps(data, indent=2))
