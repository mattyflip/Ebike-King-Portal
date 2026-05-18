import vtracer
import os

input_path = r'C:\Users\matty\Ebike King AI Portal Project\src\assets\logo.png'
temp_path = r'C:\Users\matty\Ebike King AI Portal Project\src\assets\logo_temp.png'
output_path = r'C:\Users\matty\Ebike King AI Portal Project\src\assets\logo.svg'

# Using vtracer directly on the resized/transparent temp path again with optimization
from PIL import Image

img = Image.open(input_path).convert("RGBA")
img.thumbnail((600, 600), Image.Resampling.LANCZOS)
datas = img.getdata()
new_data = []
for item in datas:
    if item[0] < 50 and item[1] < 50 and item[2] < 50:
        new_data.append((0, 0, 0, 0))
    else:
        new_data.append(item)
img.putdata(new_data)
img.save(temp_path, "PNG")

vtracer.convert_image_to_svg_py(
    temp_path, 
    output_path,
    colormode = 'color',
    mode = 'spline',
    filter_speckle = 15,    # Increase to remove small noise
    path_precision = 1      # Reduce decimal places
)

os.remove(temp_path)
print(f"Optimized SVG created at {output_path}")
