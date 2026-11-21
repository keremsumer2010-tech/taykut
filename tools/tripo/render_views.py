"""Tripo çok görünüşlü girdi: birebir rover modelinin ön/sol/arka/sağ görüntüleri (açık, düz zemin).

  blender -b --factory-startup --python tools/tripo/render_views.py -- <model.glb> <çıktı_klasörü>

Tripo'nun aracı "tahmin etmemesi" için girdi bizim ölçülü modelimizdir; Tripo yalnız yüzey ayrıntısı ve
doku üretir. Görünüşler: kamera +x'te bakınca ön (rover +x ileri), +y sol.
"""

import math
import os
import sys

import bpy
from mathutils import Vector

src, out = sys.argv[sys.argv.index("--") + 1 :][:2]
out = os.path.abspath(out)
os.makedirs(out, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=os.path.abspath(src))
scene = bpy.context.scene

mins = Vector((1e9,) * 3)
maxs = Vector((-1e9,) * 3)
for o in scene.objects:
    if o.type == "MESH":
        for c in o.bound_box:
            w = o.matrix_world @ Vector(c)
            mins = Vector(map(min, mins, w))
            maxs = Vector(map(max, maxs, w))
center = (mins + maxs) / 2
size = max(maxs - mins)

for eng in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
    try:
        scene.render.engine = eng
        break
    except TypeError:
        pass
scene.render.resolution_x = scene.render.resolution_y = 1024
scene.render.film_transparent = False
scene.view_settings.view_transform = "Standard"
world = bpy.data.worlds.new("w")
scene.world = world
world.use_nodes = True
bg = next(n for n in world.node_tree.nodes if n.type == "BACKGROUND")
bg.inputs[0].default_value = (0.9, 0.9, 0.9, 1)  # düz açık zemin: Tripo arka planı kolay ayırır
bg.inputs[1].default_value = 1.0
sun = bpy.data.objects.new("sun", bpy.data.lights.new("sun", "SUN"))
sun.data.energy = 3.0
sun.rotation_euler = (math.radians(40), 0, math.radians(30))
scene.collection.objects.link(sun)

cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
cam.data.type = "ORTHO"
cam.data.ortho_scale = size * 1.15
scene.collection.objects.link(cam)
scene.camera = cam
views = {"front": Vector((1, 0, 0)), "left": Vector((0, 1, 0)), "back": Vector((-1, 0, 0)), "right": Vector((0, -1, 0))}
for name, d in views.items():
    cam.location = center + d * size * 3 + Vector((0, 0, size * 0.25))
    cam.rotation_euler = (center - cam.location).to_track_quat("-Z", "Y").to_euler()
    scene.render.filepath = os.path.join(out, f"{name}.png")
    bpy.ops.render.render(write_still=True)
print("VIEWS tamam", out)
