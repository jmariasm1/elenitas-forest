"""Deterministic original toy assets. Run with Blender --background --python.

Use -- --proof for one tree and rabbit before generating the complete library.
Blender Z-up, faces toward -Y; glTF exports Y-up, faces toward +Z.
"""
import bpy, math, json, sys, random
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'public' / 'models'
SOURCE = ROOT / 'blender' / 'source'
OUT.mkdir(parents=True, exist_ok=True)
SOURCE.mkdir(parents=True, exist_ok=True)
(ROOT/'.tools').mkdir(exist_ok=True)
random.seed(21)
PALETTE = {'cream':'F4E7CD','pink':'EAADA2','dark':'344D43','white':'FFF7E5',
           'leaf':'73A876','leaf2':'A4C88D','trunk':'947354','green':'91B663',
           'yellow':'F0C96D','orange':'E6A161','blue':'79B5CE','purple':'AA94BD',
           'red':'D98473','brown':'AB886A','water':'75B9BD'}
COLORS = {}
def rgba(c):
    c = PALETTE.get(c,c).lstrip('#')
    # Blender node colors are linear, so decode authored sRGB values.
    return tuple(((int(c[i:i+2],16)/255+0.055)/1.055)**2.4 for i in (0,2,4))+(1,)

def reset(name):
    bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
    for m in list(bpy.data.materials): bpy.data.materials.remove(m)
    mat = bpy.data.materials.new('ToyPalette'); mat.use_nodes=True
    bsdf=mat.node_tree.nodes.get('Principled BSDF'); bsdf.inputs['Roughness'].default_value=.82
    color=mat.node_tree.nodes.new('ShaderNodeVertexColor'); color.layer_name='Color'
    mat.node_tree.links.new(color.outputs['Color'],bsdf.inputs['Base Color'])
    root=bpy.data.objects.new(name,None); bpy.context.collection.objects.link(root)
    return root,mat

root=None; material=None
def finish_obj(obj,name,color):
    obj.name=name; obj.parent=root
    bpy.context.view_layer.objects.active=obj
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    obj.data.materials.clear(); obj.data.materials.append(material)
    attr=obj.data.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='CORNER')
    for v in attr.data: v.color=rgba(color)
    for p in obj.data.polygons: p.use_smooth=True
    return obj

def sphere(name,loc,scale,color,seg=16,rings=10):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg,ring_count=rings,location=loc)
    o=bpy.context.object; o.scale=scale
    return finish_obj(o,name,color)

def cube(name,loc,scale,color,bevel=.12):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc); o=bpy.context.object; o.scale=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    mod=o.modifiers.new('Soft corners','BEVEL'); mod.width=bevel; mod.segments=2
    bpy.ops.object.modifier_apply(modifier=mod.name)
    return finish_obj(o,name,color)

def cylinder(name,loc,radius,depth,color,vertices=16):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=radius,depth=depth,location=loc)
    return finish_obj(bpy.context.object,name,color)

def eye(x,y,z,r=.072):
    sphere('eye',(x,y,z),(r,r*.55,r),'dark',12,6)
    sphere('eye_glint',(x-r*.22,y-r*.5,z+r*.3),(r*.26,r*.2,r*.26),'white',8,4)

def eyes(x,y,z,r=.072):
    eye(-x,y,z,r); eye(x,y,z,r)

def leaf(name,loc,scale,color,angle=0):
    o=sphere(name,loc,scale,color,12,6); o.rotation_euler[1]=angle; return o

def tree():
    cylinder('trunk',(0,0,1.3),.26,2.6,'trunk')
    branch=cylinder('branch',(.35,0,1.65),.14,1,'trunk'); branch.rotation_euler[1]=.65
    sphere('crown',(0,0,2.75),(1.15,.92,1.42),'leaf')
    sphere('crown_l',(-.66,0,2.55),(.8,.77,.88),'leaf2')
    sphere('crown_r',(.7,.1,2.9),(.84,.8,.96),'leaf')

def fir():
    cylinder('trunk',(0,0,.9),.21,1.8,'trunk')
    for z,r in [(1.2,1.05),(1.95,.82),(2.6,.56)]:
        bpy.ops.mesh.primitive_cone_add(vertices=12,radius1=r,radius2=.06,depth=1.45,location=(0,0,z))
        finish_obj(bpy.context.object,'soft_canopy','leaf')

def flower():
    cylinder('stem',(0,0,.25),.028,.5,'leaf',8)
    leaf('leaf',(.12,0,.19),(.16,.045,.07),'green',-.45)
    for i in range(5):
        a=i*math.tau/5
        sphere('petal',(.13*math.cos(a),.13*math.sin(a),.48),(.115,.115,.055),'cream',10,6)
    sphere('pollen',(0,0,.52),(.085,.085,.045),'yellow',10,6)

def rabbit():
    sphere('body',(0,.08,.62),(.48,.53,.59),'cream')
    sphere('head',(0,-.24,1.19),(.44,.38,.43),'cream')
    for x in [-.21,.21]:
        sphere('ear_l' if x<0 else 'ear_r',(x,-.16,1.82),(.13,.12,.49),'cream')
        sphere('ear_pink',(x,-.266,1.83),(.073,.035,.33),'pink')
        sphere('foot',(x,-.27,.13),(.18,.3,.13),'cream')
    sphere('tail',(0,.62,.55),(.22,.22,.22),'white')
    sphere('muzzle',(0,-.57,1.07),(.23,.10,.16),'white')
    eyes(.18,-.568,1.26)
    sphere('nose',(0,-.69,1.14),(.064,.046,.046),'pink')

def frog():
    sphere('body',(0,0,.38),(.55,.4,.36),'green')
    for x in [-.34,.34]:
        sphere('eye_bulb',(x,-.12,.68),(.23,.21,.23),'green')
        sphere('eye_white',(x,-.3,.69),(.16,.07,.15),'cream')
        eye(x,-.37,.70,.09)
        sphere('leg',(x,.05,.15),(.3,.35,.14),'leaf')
        sphere('foot',(x,-.3,.08),(.24,.17,.08),'green')
    cube('smile',(0,-.395,.38),(.34,.035,.028),'dark',.012)
    sphere('cheek',(-.43,-.33,.43),(.1,.035,.048),'pink')
    sphere('cheek',(.43,-.33,.43),(.1,.035,.048),'pink')

def duck():
    sphere('body',(0,.06,.45),(.5,.65,.39),'cream')
    sphere('head',(0,-.4,.86),(.31,.31,.32),'cream')
    cube('beak',(0,-.73,.8),(.31,.35,.11),'orange',.06)
    eyes(.14,-.654,.92,.055)
    for x in [-.46,.46]: sphere('wing',(x,.03,.5),(.11,.38,.23),'yellow')
    sphere('tail',(0,.62,.57),(.2,.28,.18),'cream')
    for x in [-.2,.2]: sphere('foot',(x,-.18,.12),(.18,.23,.045),'orange')

def butterfly():
    sphere('body',(0,0,.52),(.075,.09,.34),'dark',12,6)
    for sign in [-1,1]:
        sphere('wing_l' if sign<0 else 'wing_r',(sign*.28,0,.68),(.3,.055,.31),'orange',16,8)
        sphere('wing_lower',(sign*.23,.008,.36),(.23,.05,.23),'yellow',12,6)
        sphere('wing_spot',(sign*.3,-.055,.72),(.10,.018,.12),'cream',10,6)
        antenna=cylinder('antenna',(sign*.06,0,.9),.013,.22,'dark',6); antenna.rotation_euler[1]=sign*.3

def owl():
    sphere('body',(0,0,.67),(.49,.34,.61),'brown')
    sphere('belly',(0,-.3,.5),(.32,.085,.32),'cream')
    for x in [-.23,.23]:
        sphere('mask',(x,-.27,.89),(.23,.11,.24),'cream')
        eye(x,-.382,.92,.103)
        sphere('foot',(x,-.12,.12),(.1,.14,.06),'orange')
    for x in [-.44,.44]: sphere('wing',(x,-.01,.58),(.14,.25,.38),'trunk')
    bpy.ops.mesh.primitive_cone_add(vertices=4,radius1=.12,depth=.23,location=(0,-.41,.71))
    o=bpy.context.object; o.rotation_euler[0]=math.pi/2; finish_obj(o,'beak','orange')

def shape_points(kind):
    n={'circle':32,'triangle':3,'square':4,'pentagon':5,'hexagon':6,'heptagon':7,'octagon':8}.get(kind)
    if n:
        phase=math.pi/2+(math.pi/4 if kind=='square' else 0)
        return [(math.cos(phase+i*math.tau/n)*.65, math.sin(phase+i*math.tau/n)*.65) for i in range(n)]
    if kind=='rectangle': return [(-.8,-.43),(.8,-.43),(.8,.43),(-.8,.43)]
    if kind=='oval': return [(math.cos(i*math.tau/32)*.75,math.sin(i*math.tau/32)*.45) for i in range(32)]
    if kind=='rhombus': return [(0,-.7),(.43,0),(0,.7),(-.43,0)]
    if kind=='semicircle': return [(math.cos(i*math.pi/20)*.7,math.sin(i*math.pi/20)*.7-.2) for i in range(21)]
    if kind=='trapezoid': return [(-.72,-.45),(.72,-.45),(.4,.45),(-.4,.45)]
    return [(math.cos(math.pi/2+i*math.pi/5)*(.7 if i%2==0 else .34),math.sin(math.pi/2+i*math.pi/5)*(.7 if i%2==0 else .34)) for i in range(10)]

def shape(kind):
    pts=shape_points(kind); n=len(pts)
    verts=[(x,y,z+.72) for y in [-.16,.16] for x,z in pts]
    faces=[tuple(range(n-1,-1,-1)),tuple(range(n,n*2))]+[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
    mesh=bpy.data.meshes.new(kind); mesh.from_pydata(verts,[],faces); mesh.update()
    o=bpy.data.objects.new('color_body',mesh); bpy.context.collection.objects.link(o)
    bpy.context.view_layer.objects.active=o; o.select_set(True)
    bevel=o.modifiers.new('Gentle edge','BEVEL'); bevel.width=.045; bevel.segments=2
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    finish_obj(o,'color_body','white')
    eyes(.145,-.187,.78,.05)

def glyph(char):
    bpy.ops.object.text_add(location=(0,0,0))
    o=bpy.context.object; o.data.body=char; o.data.align_x='CENTER'; o.data.size=1.35
    font=ROOT/'public/fonts/Fredoka.ttf'
    if font.exists(): o.data.font=bpy.data.fonts.load(str(font),check_existing=True)
    o.data.extrude=.105; o.data.bevel_depth=.016; o.data.bevel_resolution=2; o.data.resolution_u=4
    o.rotation_euler[0]=math.pi/2
    bpy.ops.object.convert(target='MESH'); finish_obj(o,'color_body','white')

def pond():
    sphere('bank',(0,0,-.05),(3,2,.22),'cream',32,10)
    sphere('water',(0,0,.17),(2.78,1.78,.07),'water',32,8)

def apple():
    sphere('apple',(-.12,0,.34),(.3,.28,.34),'red')
    sphere('apple',(.12,0,.34),(.3,.28,.34),'red')
    cylinder('stem',(0,0,.72),.028,.23,'trunk',8)
    leaf('leaf',(.14,0,.76),(.18,.04,.08),'leaf',-.3)

def leaf_asset():
    leaf('leaf',(0,0,.3),(.23,.055,.42),'green',-.3)
    cylinder('stem',(-.08,0,.03),.022,.24,'trunk',8)

def cloud():
    for x,z,s in [(-.65,.2,.6),(0,.42,.84),(.7,.23,.57)]: sphere('cloud',(x,0,z),(s,.48,s*.7),'white')

def star(): shape('star')

def sun():
    sphere('sun',(0,0,0),(.85,.38,.85),'yellow',24,12)
    for i in range(10):
        a=i*math.tau/10
        ray=cube('ray',(math.cos(a)*1.12,0,math.sin(a)*1.12),(.1,.1,.26),'yellow',.05)
        ray.rotation_euler[1]=math.pi/2-a
    eyes(.24,-.36,.1,.055)

def moon():
    sphere('moon',(0,0,0),(.72,.4,.72),'cream',24,12)
    for x,z,r in [(-.29,.3,.14),(.31,-.18,.18),(-.24,-.3,.09)]: sphere('crater',(x,-.345,z),(r,.027,r),'BEBFA8',12,6)

def rock(): sphere('rock',(0,0,.22),(.55,.4,.34),'B5BEA3',12,6)
def bush():
    for x,s in [(-.35,.5),(.2,.65),(.65,.4)]: sphere('bush',(x,0,s*.65),(s,s*.7,s*.65),'leaf2',12,8)
def grass():
    for i in range(4):
        o=sphere('blade',((i-1.5)*.12,0,.16),(.035,.025,.22),'leaf',8,4); o.rotation_euler[1]=(i-1.5)*.23
def mushroom():
    cylinder('stem',(0,0,.18),.075,.36,'cream',12)
    sphere('cap',(0,0,.37),(.28,.28,.13),'red',16,8)
    for x,y in [(-.1,-.1),(.08,.1),(.12,-.07)]: sphere('dot',(x,y,.475),(.037,.037,.013),'cream',8,4)
def log():
    o=cylinder('log',(0,0,.25),.26,1.6,'trunk'); o.rotation_euler[1]=math.pi/2
    for x in [-.81,.81]:
        o=cylinder('rings',(x,0,.25),.21,.015,'brown'); o.rotation_euler[1]=math.pi/2
def lily(): sphere('lily',(0,0,.03),(.5,.42,.04),'green',16,6)

def xylophone():
    cube('stand',(0,0,.18),(2.9,.65,.2),'trunk')
    for i,c in enumerate(['red','orange','yellow','green','blue','purple']):
        cube('bar_'+str(i),((i-2.5)*.44,0,.37),(.36,1.2-i*.095,.14),c,.045)
    for x in [-1.1,1.1]: cube('foot',(x,0,.07),(.2,.85,.14),'brown')

def drum():
    cylinder('shell',(0,0,.42),.56,.69,'red',24)
    cylinder('skin',(0,0,.8),.59,.09,'cream',24)
    for i in range(10):
        a=i*math.tau/10; cylinder('lace',(.565*math.cos(a),.565*math.sin(a),.44),.018,.64,'cream',6)

def bell():
    bpy.ops.mesh.primitive_cone_add(vertices=20,radius1=.45,radius2=.18,depth=.48,location=(0,0,.45))
    finish_obj(bpy.context.object,'bell','yellow')
    sphere('top',(0,0,.69),(.18,.18,.16),'yellow')
    sphere('clapper',(0,0,.17),(.1,.1,.1),'trunk')
    cylinder('handle',(0,0,.96),.075,.3,'trunk',12)

def telescope():
    for a in [0,math.tau/3,math.tau*2/3]:
        foot=cylinder('tripod',(.3*math.cos(a),.3*math.sin(a),.55),.055,1.2,'trunk',10)
        foot.rotation_euler=(.45*math.sin(a),-.45*math.cos(a),0)
    tube=cylinder('tube',(0,0,1.36),.22,1.2,'blue',20); tube.rotation_euler[0]=.85
    cap=cylinder('lens',(0,-.44,1.74),.225,.09,'dark',20); cap.rotation_euler[0]=.85
    cylinder('collar',(0,0,1.05),.11,.22,'yellow')

def planet(name):
    colors={'mercury':'A69C92','venus':'DBB580','earth':'659FBA','mars':'CB8870','jupiter':'D9BE9C','saturn':'DEC992','uranus':'A7D4CF','neptune':'789FC7'}
    globe=sphere('globe',(0,0,0),(.85,.85,.85),colors.get(name,'cream'),32,16)
    if name in ['jupiter','saturn']:
        attr=globe.data.color_attributes['Color']
        for poly in globe.data.polygons:
            z=sum(globe.data.vertices[i].co.z for i in poly.vertices)/len(poly.vertices)
            c=(['D1AA83','E4CCAC','BD997D','ECD9B9'][int((z+.85)*7)%4])
            for idx in poly.loop_indices: attr.data[idx].color=rgba(c)
    if name=='jupiter': sphere('great_red_spot',(.3,-.79,-.17),(.20,.065,.1),'BC806D',16,8)
    if name=='earth':
        continents=[ [(-135,60),(-105,72),(-58,50),(-82,12),(-112,28)], [(-78,9),(-45,-6),(-50,-30),(-70,-55),(-80,-12)], [(-12,35),(25,37),(51,10),(31,-34),(10,-30),(-16,7)], [(4,45),(38,66),(108,64),(145,44),(106,5),(66,24),(35,38)], [(114,-15),(143,-12),(152,-35),(125,-39)] ]
        for poly in continents:
            # Latitude/longitude outlines mapped onto the ocean sphere.
            vertices=[]
            for lon,lat in poly:
                la=math.radians(lat); lo=math.radians(lon+40)
                vertices.append((.858*math.cos(la)*math.sin(lo),-.858*math.cos(la)*math.cos(lo),.858*math.sin(la)))
            center=sum((Vector(v) for v in vertices),Vector())/len(vertices); center=center.normalized()*.865
            vertices.append(tuple(center)); n=len(poly)
            mesh=bpy.data.meshes.new('land'); mesh.from_pydata(vertices,[],[(n,i,(i+1)%n) for i in range(n)]); mesh.update()
            # Subdivide and reproject: flat triangle chords would sink into the ocean.
            import bmesh
            bm=bmesh.new(); bm.from_mesh(mesh)
            bmesh.ops.subdivide_edges(bm,edges=list(bm.edges),cuts=5,use_grid_fill=True)
            for vertex in bm.verts: vertex.co=vertex.co.normalized()*.865
            bm.normal_update()
            for face in bm.faces:
                if face.normal.dot(face.calc_center_median())<0: face.normal_flip()
            bm.to_mesh(mesh); bm.free(); mesh.update()
            o=bpy.data.objects.new('continents',mesh); bpy.context.collection.objects.link(o); finish_obj(o,'continents','A9C083')
    if name=='saturn':
        bpy.ops.mesh.primitive_torus_add(major_segments=48,minor_segments=8,location=(0,0,0),major_radius=1.25,minor_radius=.19)
        o=bpy.context.object; o.scale.z=.12; o.rotation_euler[1]=.38; finish_obj(o,'rings','C5AB82')

def merge_static(preserve):
    objects=[o for o in root.children if o.type=='MESH' and not any(o.name.startswith(p) for p in preserve)]
    if objects:
        bpy.ops.object.select_all(action='DESELECT')
        for o in objects: o.select_set(True)
        bpy.context.view_layer.objects.active=objects[0]; bpy.ops.object.join(); objects[0].name='body'

def export(name,animal=False,proof=False):
    preserve=['color_body','bar_','ear_l','ear_r','wing_l','wing_r','rings']
    merge_static(preserve)
    if animal:
        root.scale=(1,1,1); root.keyframe_insert(data_path='scale',frame=1)
        root.scale=(1.012,1.012,1.025); root.keyframe_insert(data_path='scale',frame=40)
        root.scale=(1,1,1); root.keyframe_insert(data_path='scale',frame=80)
        root.animation_data.action.name='Idle'
        bpy.context.scene.frame_end=80
    bpy.context.scene.frame_set(1)
    bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE/(name+'.blend')))
    bpy.ops.export_scene.gltf(filepath=str(OUT/(name+'.glb')),export_format='GLB',export_animations=True,export_frame_range=True,export_force_sampling=True,export_yup=True)
    meshes=[o for o in root.children_recursive if o.type=='MESH']
    triangles=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in meshes)
    return {'id':name,'triangles':triangles,'meshes':len(meshes),'animations':['Idle'] if animal else [],'source':'blender/source/'+name+'.blend','model':'models/'+name+'.glb'}

def preview(name):
    from mathutils import Quaternion
    scene=bpy.context.scene; scene.render.engine='BLENDER_WORKBENCH'
    scene.display.shading.light='STUDIO'; scene.display.shading.color_type='VERTEX'
    scene.display.shading.show_shadows=True; scene.display.shading.show_cavity=True
    scene.render.resolution_x=512; scene.render.resolution_y=512; scene.render.resolution_percentage=100
    bpy.ops.object.camera_add(location=(3,-6,3)); camera=bpy.context.object
    camera.rotation_euler=(Vector((0,0,1))-camera.location).to_track_quat('-Z','Y').to_euler()
    camera.data.type='ORTHO'; camera.data.ortho_scale=4.5; scene.camera=camera
    scene.render.filepath=str(ROOT/'blender/previews'/(name+'.png'))
    bpy.ops.render.render(write_still=True)

proof='--proof' in sys.argv
jobs={'tree':tree,'rabbit':rabbit}
if not proof:
    jobs.update({'fir':fir,'flower':flower,'rock':rock,'bush':bush,'grass':grass,'mushroom':mushroom,'log':log,'lily':lily,'pond':pond,'cloud':cloud,'sun':sun,'moon':moon,'star':star,'frog':frog,'duck':duck,'butterfly':butterfly,'owl':owl,'xylophone':xylophone,'drum':drum,'bell':bell,'telescope':telescope,'apple':apple,'leaf':leaf_asset})
    for k in ['circle','triangle','square','rectangle','oval','rhombus','semicircle','pentagon','hexagon','heptagon','octagon','trapezoid','star']:
        jobs['shape_'+k]=lambda k=k:shape(k)
    for c in 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ': jobs['letter_'+c.lower()]=lambda c=c:glyph(c)
    for n in range(11): jobs['number_'+str(n)]=lambda n=n:glyph(str(n))
    for k in ['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune']:
        jobs['planet_'+k]=lambda k=k:planet(k)
try:
    if not proof and not (ROOT/'public/fonts/Fredoka.ttf').exists():
        raise RuntimeError('Required licensed font is missing: public/fonts/Fredoka.ttf')
    manifest=[]
    for name,fn in jobs.items():
        root,material=reset(name); fn()
        manifest.append(export(name,name in ['rabbit','frog','duck','butterfly','owl'],proof))
        if name in ['tree','rabbit'] or name in ['shape_hexagon','xylophone','planet_saturn']: preview(name)
    (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False),encoding='utf-8')
    (ROOT/'.tools'/('proof.done' if proof else 'assets.done')).write_text(str(len(manifest)))
    print('ASSETS_OK',len(manifest))
except Exception:
    import traceback
    (ROOT/'.tools/assets.error').write_text(traceback.format_exc(),encoding='utf-8')
    raise
