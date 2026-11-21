"""TAYKUT 2027 rover — web modeli (glTF) montajı. Blender 5.x, başsız:

  blender -b --factory-startup --python tools/rover/build_rover.py -- <ikiz_meshes> <params.json> <çıktı_klasörü> [--render]

Kaynak: dijital ikizin link başına GLB parçaları (Rover_Dijital_Ikiz/.../taykut_description/meshes; her parça
kendi URDF link çerçevesinde) ve ölçüler (src/content/rover2027.generated.json, rover_params.yaml kaynaklı).

Adımlar:
 1. Parçaları içe aktar ve YÖNELİMİ DÜZELT: ikiz parçaları `export_yup=False` ile (Z yukarı) kaydetmiş;
    glTF içe aktarıcısı Y yukarı varsayıp Blender'da (x, −z, y) üretiyor. Mesh verisine X etrafında −90°
    uygulanınca ROS çerçevesi (x ileri, y sol, z yukarı) geri gelir.
 2. URDF eklem konumlarıyla hiyerarşi: rover_root > body > rocker_L/R > (wheel_FL, bogie_L > wheel_ML, wheel_RL).
    Her eklem bir boş düğümdür (pivot = eklem ekseni); dönüşler three.js'te bu düğümlere uygulanır.
 3. Görsel cila: kenar yumuşatma (bevel) ve ağırlıklı normaller (yakın çekimde ışık kenarları yakalar),
    web PBR malzemeleri (alüminyum, anodize, TPU, çelik, PCB).
 4. Etiket çapaları (anchors/*): 3B etiketlerin bağlanacağı boş düğümler.
 5. glTF dışa aktarım: Y yukarı (standart). Blender (x, y, z) → glTF (x, z, −y) = src/lib/frames.ts enuToThree.

Not: İkizdeki motor gövdesi eski karar (CRL-4001B) biçiminde; güncel karar DJI M3508 doğrudan tahrik.
Görsel fark küçük (silindirik redüktörlü motor); model "tasarım konsepti" olarak etiketlenir.
"""

import json
import math
import os
import sys

import bpy
from mathutils import Matrix, Vector

args = sys.argv[sys.argv.index("--") + 1:]
SRC, PARAMS = args[0], args[1]
OUT = os.path.abspath(args[2])  # Blender göreli render yolunu .blend dizinine göre çözer; mutlak yol şart
RENDER = "--render" in args
os.makedirs(OUT, exist_ok=True)

P = json.load(open(PARAMS, encoding="utf-8"))
G = P["geometry"]

# Tekerlek rengi: TAYKUT imza sarısı (SummerTech TPU tekerleklerinden ölçülen #E7AD01). Tasarım konsepti.
TIRE_SRGB = (0xE7 / 255, 0xAD / 255, 0x01 / 255)


def srgb_to_linear(c):
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
FIX = Matrix.Rotation(-math.pi / 2, 4, "X")  # ikiz GLB yönelim düzeltmesi (bkz. adım 1)


# ------------------------------------------------------------------ malzemeler (web PBR)
def pbr(name, color_srgb, metal, rough, clearcoat=0.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    b = next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    b.inputs["Base Color"].default_value = (*srgb_to_linear(color_srgb), 1)
    b.inputs["Metallic"].default_value = metal
    b.inputs["Roughness"].default_value = rough
    if "Coat Weight" in b.inputs:
        b.inputs["Coat Weight"].default_value = clearcoat
    return m


MATS = {
    # ikiz malzeme adı → web malzemesi
    "aluminyum": pbr("TK_Aluminium", (0.80, 0.81, 0.83), 1.0, 0.34),
    "anodize_koyu": pbr("TK_Anodized", (0.09, 0.095, 0.10), 0.85, 0.42),
    "celik": pbr("TK_Steel", (0.62, 0.63, 0.65), 1.0, 0.28),
    "civata_siyah": pbr("TK_BoltBlack", (0.06, 0.06, 0.065), 0.9, 0.38),
    "disli_celik": pbr("TK_GearSteel", (0.56, 0.53, 0.47), 1.0, 0.30),
    "tpu_mavi": pbr("TK_TPU", TIRE_SRGB, 0.0, 0.66),
    "kayis_kaucuk": pbr("TK_Rubber", (0.03, 0.03, 0.03), 0.0, 0.85),
    "motor_govde": pbr("TK_Motor", (0.13, 0.13, 0.14), 0.7, 0.40),
    "elektronik_kutu": pbr("TK_Enclosure", (0.16, 0.17, 0.18), 0.2, 0.55),
    "guverte": pbr("TK_Deck", (0.11, 0.115, 0.12), 0.5, 0.50),
    "batarya": pbr("TK_Battery", (0.05, 0.06, 0.07), 0.1, 0.45),
    "rulman_conta": pbr("TK_Seal", (0.55, 0.12, 0.08), 0.0, 0.55),
}


# ------------------------------------------------------------------ içe aktarma
def import_part(file, name):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(SRC, f"{file}.glb"))
    new = [o for o in bpy.data.objects if o not in before]
    meshes = [o for o in new if o.type == "MESH"]
    if len(meshes) != 1:
        raise SystemExit(f"{file}: beklenen 1 mesh, bulunan {len(meshes)}")
    obj = meshes[0]
    for o in new:
        if o is not obj:
            bpy.data.objects.remove(o, do_unlink=True)
    obj.parent = None
    obj.matrix_world = Matrix.Identity(4)
    obj.data.transform(FIX)
    obj.data.update()
    obj.name = name
    obj.data.name = f"{name}_mesh"
    for i, m in enumerate(obj.data.materials):
        if m and m.name.split(".")[0] in MATS:
            obj.data.materials[i] = MATS[m.name.split(".")[0]]
    return obj


def empty(name, parent=None, loc=(0, 0, 0)):
    e = bpy.data.objects.new(name, None)
    e.empty_display_type = "PLAIN_AXES"
    e.empty_display_size = 0.04
    scene.collection.objects.link(e)
    e.parent = parent
    e.location = loc
    return e


def attach(mesh_obj, parent):
    scene.collection.objects.link(mesh_obj) if mesh_obj.name not in scene.collection.objects else None
    mesh_obj.parent = parent
    mesh_obj.matrix_parent_inverse = Matrix.Identity(4)
    mesh_obj.location = (0, 0, 0)


def polish(obj, bevel=0.0012):
    """Kenar yumuşatma + ağırlıklı normaller: yakın çekimde keskin CG kenarları yerine gerçek parça ışıltısı."""
    bev = obj.modifiers.new("bevel", "BEVEL")
    bev.width = bevel
    bev.segments = 2
    bev.limit_method = "ANGLE"
    bev.angle_limit = math.radians(40)
    bev.harden_normals = True
    wn = obj.modifiers.new("wnormals", "WEIGHTED_NORMAL")
    wn.keep_sharp = True


# ------------------------------------------------------------------ hiyerarşi (URDF eklemleri)
root = empty("rover_root")
body = empty("body", root)
base = import_part("base_link", "body_mesh")
attach(base, body)
polish(base)

diff = empty("diff_gear", body, (0, 0, G.get("diff_bar_z", 0.035)))
d = import_part("diff_bar", "diff_gear_mesh")
attach(d, diff)

wheel_y_off = G["wheelY"] - G["rockerPivotY"]
for side, sgn in (("L", 1), ("R", -1)):
    rocker = empty(f"rocker_{side}", body, (0, sgn * G["rockerPivotY"], G["rockerPivotZ"]))
    rm = import_part(f"rocker_{side}", f"rocker_{side}_mesh")
    attach(rm, rocker)
    polish(rm)
    bogie = empty(f"bogie_{side}", rocker, (G["rockerBogieDx"], 0, G["bogiePivotZ"] - G["rockerPivotZ"]))
    bm = import_part(f"bogie_{side}", f"bogie_{side}_mesh")
    attach(bm, bogie)
    polish(bm)
    wheels = [
        (f"wheel_F{side}", rocker, (G["rockerFrontDx"], sgn * wheel_y_off, G["wheelZ"] - G["rockerPivotZ"])),
        (f"wheel_M{side}", bogie, (G["bogieHalfLength"], sgn * wheel_y_off, G["wheelZ"] - G["bogiePivotZ"])),
        (f"wheel_R{side}", bogie, (-G["bogieHalfLength"], sgn * wheel_y_off, G["wheelZ"] - G["bogiePivotZ"])),
    ]
    for name, parent, loc in wheels:
        w = empty(name, parent, loc)
        wm = import_part(f"wheel_{side}", f"{name}_mesh")
        attach(wm, w)
        polish(wm, bevel=0.0008)

# Etiket çapaları (gövde çerçevesinde; B10 etiketleri bunlara bağlanır)
anchors = empty("anchors", body)
for name, loc in {
    "wheel": (G["rockerFrontDx"], G["wheelY"] + 0.06, G["wheelZ"] + 0.05),
    "rocker": (0.18, G["rockerPivotY"] + 0.02, -0.06),
    "differential": (0, 0, G.get("diff_bar_z", 0.035)),
    "battery": (-0.15, 0, 0.0),
    "computer": (0.12, 0, 0.08),
    "bogie": (G["rockerBogieDx"], G["wheelY"] + 0.02, G["bogiePivotZ"] - 0.02),
}.items():
    empty(f"anchor_{name}", anchors, loc)

bpy.context.view_layer.update()

# ------------------------------------------------------------------ ölçüm raporu
def world_tris():
    dg = bpy.context.evaluated_depsgraph_get()
    total = 0
    for o in scene.objects:
        if o.type == "MESH":
            me = o.evaluated_get(dg).to_mesh()
            total += sum(len(p.vertices) - 2 for p in me.polygons)
            o.evaluated_get(dg).to_mesh_clear()
    return total

report = {
    "triangles": world_tris(),
    "nodes": sorted(o.name for o in scene.objects if o.type == "EMPTY"),
    "pivots": {o.name: [round(v, 4) for v in o.matrix_world.translation] for o in scene.objects if o.type == "EMPTY" and (o.name.startswith(("rocker", "bogie", "wheel", "diff")))},
}
json.dump(report, open(os.path.join(OUT, "taykut2027.report.json"), "w"), indent=2)
print("RAPOR", json.dumps({"triangles": report["triangles"], "nodes": len(report["nodes"])}))

# ------------------------------------------------------------------ dışa aktarım (LOD0, LOD1, LOD2)
def export(path):
    bpy.ops.export_scene.gltf(
        filepath=path, export_format="GLB", export_yup=True, export_apply=True,
        export_extras=False, export_cameras=False, export_lights=False,
    )
    print("GLB", os.path.basename(path), os.path.getsize(path))


export(os.path.join(OUT, "taykut2027.lod0.raw.glb"))
# LOD'lar: aynı hiyerarşi ve düğüm adları; mesh'ler sadeleştirilir (bevel kaldırılır + decimate).
# Hedefler: LOD1 ~40k üçgen (arazide orta mesafe), LOD2 ~8k (uzak/küre geçişi).
lod_tris = {}
for lod, (ratio, keep_bevel) in {"lod1": (0.45, False), "lod2": (0.09, False)}.items():
    for o in [o for o in scene.objects if o.type == "MESH" and o.name != "Floor"]:
        for m in list(o.modifiers):
            if m.type == "DECIMATE" or (m.type == "BEVEL" and not keep_bevel):
                o.modifiers.remove(m)
        dec = o.modifiers.new("decimate", "DECIMATE")
        dec.ratio = ratio
        dec.use_collapse_triangulate = True
    bpy.context.view_layer.update()
    lod_tris[lod] = world_tris()
    export(os.path.join(OUT, f"taykut2027.{lod}.raw.glb"))
print("LOD", json.dumps(lod_tris))
report["lods"] = lod_tris
json.dump(report, open(os.path.join(OUT, "taykut2027.report.json"), "w"), indent=2)

# LOD döngüsü sahneyi LOD2'de bıraktı; önizleme LOD0 ile alınmalı (yoksa tekerler sekizgen görünür).
for o in [o for o in scene.objects if o.type == "MESH"]:
    for m in list(o.modifiers):
        o.modifiers.remove(m)
    polish(o, bevel=0.0008 if o.name.startswith("wheel_") else 0.0012)
bpy.context.view_layer.update()
assert world_tris() == report["triangles"], f"önizleme sahnesi LOD0'a dönmedi: {world_tris()}"

# ------------------------------------------------------------------ önizleme render (isteğe bağlı)
if RENDER:
    world = bpy.data.worlds.new("w")
    scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (0.035, 0.04, 0.05, 1)  # metaller yansıtacak bir şey görsün (alüminyum koyu görünmesin)
    bg.inputs[1].default_value = 0.8
    for eng in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
        try:
            scene.render.engine = eng
            break
        except TypeError:
            pass
    scene.render.resolution_x, scene.render.resolution_y = 1600, 1000
    scene.view_settings.view_transform = "AgX" if "AgX" in [i.identifier for i in scene.view_settings.bl_rna.properties["view_transform"].enum_items] else "Filmic"
    # Işık: sert üst spot + soğuk kenar ışığı (hangar sahnesinin ön izlemesi)
    def light(kind, loc, energy, color, size=0.3, rot=None):
        ld = bpy.data.lights.new(kind + "L", kind)
        ld.energy = energy
        ld.color = color
        if hasattr(ld, "shadow_soft_size"):
            ld.shadow_soft_size = size
        lo = bpy.data.objects.new(kind, ld)
        scene.collection.objects.link(lo)
        lo.location = loc
        target = Vector((0, 0, -0.1))
        lo.rotation_euler = (target - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        return lo
    light("SPOT", (0.4, 0.6, 2.2), 900, (1.0, 0.92, 0.82), 0.25)
    light("AREA", (-1.8, -1.2, 0.8), 260, (0.55, 0.7, 1.0), 1.0)
    light("AREA", (1.6, -1.6, 0.4), 90, (1, 1, 1), 2.0)
    bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, G["wheelZ"] - G["wheelRadius"] + 0.0))
    floor = bpy.context.object
    floor.data.materials.append(pbr("Floor", (0.03, 0.035, 0.04), 0.0, 0.55))
    cam_data = bpy.data.cameras.new("cam")
    cam = bpy.data.objects.new("cam", cam_data)
    scene.collection.objects.link(cam)
    scene.camera = cam
    shots = {
        "34": ((1.7, -1.5, 0.75), 50),
        "yan": ((0.0, -3.0, 0.1), 45),
        "teker": ((0.95, -0.85, -0.05), 85),
    }
    for name, (loc, lens) in shots.items():
        cam.location = loc
        cam_data.lens = lens
        aim = Vector((0.0, 0, -0.12)) if name == "yan" else Vector((0.05, 0, -0.08))
        cam.rotation_euler = (aim - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        if name == "teker":
            cam.rotation_euler = (Vector((0.45, -0.34, -0.27)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        scene.render.filepath = os.path.join(OUT, f"render-{name}.png")
        bpy.ops.render.render(write_still=True)
    print("RENDER tamam")
