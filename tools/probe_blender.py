import bpy
from pathlib import Path
root = Path(__file__).resolve().parents[1]
(root / '.tools' / 'blender-probe.txt').write_text(bpy.app.version_string)
print('BLENDER_BACKGROUND_OK', bpy.app.version_string)
