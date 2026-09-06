"""Spanish is the canonical vocabulary. English associations are authored separately."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
strings={'es':{},'en':{}}
def phrase(key,es,en):
    strings['es'][key]=es; strings['en'][key]=en

ui={
'title':('El Bosque de Elenita',"Elenita’s Forest"),'subtitle':('Un pequeño mundo, grandes descubrimientos.','A little world of wonderful discoveries.'),
'start':('Entrar al bosque','Enter the forest'),'loading':('El bosque está despertando…','The forest is waking up…'),
'ready':('Todo empieza con un toque.','It all begins with a touch.'),'parents':('Para los grandes','For grown-ups'),
'gate':('Mantén la hoja presionada. Después resuelve la suma.','Hold the leaf. Then solve the sum.'),
'hold':('Mantener presionado','Press and hold'),'answer':('Respuesta','Answer'),'open':('Abrir','Open'),
'close':('Volver al bosque','Back to the forest'),'language':('Idioma','Language'),
'narration':('Voz','Voice'),'music':('Música','Music'),'animals':('Animales','Animals'),
'instruments':('Instrumentos','Instruments'),'environment':('Naturaleza','Nature'),'master':('Volumen general','Master volume'),
'subtitles':('Palabras en pantalla','Words on screen'),'motion':('Movimiento reducido','Reduced motion'),
'reset':('Restablecer preferencias','Reset preferences'),'sound':('Sonido','Sound'),'mute':('Silenciar','Mute'),
'fullscreen':('Pantalla completa','Full screen'),'map':('Pasear por el bosque','Explore the forest'),
'home':('Volver al bosque','Return to the forest'),'next':('Seguir el sendero','Follow the path'),'previous':('Volver por el sendero','Go back along the path'),
'rotate':('El bosque se ve mejor de lado.','The forest looks lovely sideways.'),
'continue':('Continuar así','Continue like this'),'about':('Hecho con cariño para Elenita. Sin anuncios, cuentas ni datos personales.','Made with love for Elenita. No ads, accounts or personal data.'),
'voiceNote':('Voces sintéticas guardadas en el dispositivo. Puedes apagar la voz y acompañarla con la tuya.','Synthetic voices stored on the device. You can turn the voice off and use your own.'),
'spaceNote':('Un pequeño modelo del espacio. Los tamaños y las distancias están simplificados.','A little model of space. Sizes and distances are simplified.'),
'error':('El bosque necesita otro intento.','The forest needs another try.'),'retry':('Intentar de nuevo','Try again'),
'offline':('El bosque está listo para jugar sin conexión.','The forest is ready to play offline.'),
'welcome':('Hola, Elenita.','Hello, Elenita.'),'sky':('El cielo','The sky'),
}
for key,values in ui.items(): phrase('ui.'+key,*values)
places=[
 ('meadow','El Claro','The Meadow',[0,0],'rabbit'),
 ('shapes','El Jardín de las Figuras','The Shape Garden',[18,-5],'shapes'),
 ('letters','El Sendero de las Letras','The Letter Trail',[28,-24],'letter'),
 ('numbers','El Rincón de los Números','The Number Grove',[8,-36],'number'),
 ('music','El Claro Musical','The Music Clearing',[-15,-25],'music'),
 ('observatory','El Observatorio','The Observatory',[-18,-6],'telescope')]
place_data=[]
for id,es,en,position,icon in places:
    phrase('place.'+id,es,en); place_data.append(dict(id=id,key='place.'+id,position=position,icon=icon))
entities=[]
def entity(id,kind,model,place,position,key,**kwargs):
    entities.append(dict(id=id,kind=kind,model=model,place=place,position=position,key=key,**kwargs))

animals=[('rabbit','Conejo','Rabbit',[-2.5,0,1],1),('frog','Rana','Frog',[4.3,.18,1.7],.9),('duck','Pato','Duck',[2.3,.1,-.2],1),('butterfly','Mariposa','Butterfly',[-.4,1.8,-1.5],.8),('owl','Búho','Owl',[-4.5,1.65,-2.4],.95)]
for id,es,en,pos,size in animals:
    phrase('animal.'+id,es+'.',en+'.'); entity(id,'animal',id,'meadow',pos,'animal.'+id,scale=size)

shape_names=[('circle','Círculo','Circle','amarillo','yellow','#f0c96d','azul','blue','#79b5ce'),('triangle','Triángulo','Triangle','rojo','red','#d98473','verde','green','#91b663'),('square','Cuadrado','Square','azul','blue','#79b5ce','amarillo','yellow','#f0c96d'),('rectangle','Rectángulo','Rectangle','verde','green','#91b663','naranja','orange','#e6a161'),('pentagon','Pentágono','Pentagon','morado','purple','#aa94bd','rosado','pink','#eaada2'),('hexagon','Hexágono','Hexagon','amarillo','yellow','#f0c96d','azul','blue','#79b5ce'),('trapezoid','Trapecio','Trapezoid','naranja','orange','#e6a161','rojo','red','#d98473'),('star','Estrella','Star','rosada','pink','#eaada2','azul','blue','#79b5ce')]
for i,(id,es,en,c1,e1,h1,c2,e2,h2) in enumerate(shape_names):
    phrase('shape.'+id,es+'.',en+'.')
    phrase('shape.'+id+'.0',f'{es} {c1}.',f'{e1.capitalize()} {en.lower()}.')
    phrase('shape.'+id+'.1',f'{es} {c2}.',f'{e2.capitalize()} {en.lower()}.')
    entity('shape_'+id,'shape','shape_'+id,'shapes',[-4.5+(i%4)*3,.12,-2.3+(i//4)*4],'shape.'+id,colors=[h1,h2],behavior=id,scale=1.05)

for i,(char,es,en,association) in enumerate([('A','A. Árbol.','A. Apple.','tree'),('E','E. Estrella.','E. Earth.','star'),('L','Ele. Luna.','L. Leaf.','moon'),('M','Eme. Mariposa.','M. Moon.','butterfly'),('S','Ese. Sol.','S. Sun.','sun')]):
    phrase('letter.'+char.lower(),es,en)
    english_models={'A':'apple','E':'planet_earth','L':'leaf','M':'moon','S':'sun'}
    entity('letter_'+char.lower(),'letter','letter_'+char.lower(),'letters',[-4.4+i*2.2,.12,0 if i%2 else -1.4],'letter.'+char.lower(),color=['#d98473','#f0c96d','#79b5ce','#aa94bd','#91b663'][i],association=association,associations={'es':association,'en':english_models[char]},scale=1.3)

for i,(es,en) in enumerate(zip(['Cero','Uno','Dos','Tres','Cuatro','Cinco'],['Zero','One','Two','Three','Four','Five'])):
    phrase('number.'+str(i),es+'.',en+'.')
    phrase('count.'+str(i),'. '.join(['Uno','Dos','Tres','Cuatro','Cinco'][:i])+'.' if i else 'Cero. El nido está vacío.', '. '.join(['One','Two','Three','Four','Five'][:i])+'.' if i else 'Zero. The nest is empty.')
    entity('number_'+str(i),'number','number_'+str(i),'numbers',[-4.2+(i%3)*4.2,.12,-2+(i//3)*3.8],'number.'+str(i),value=i,color=['#aa94bd','#d98473','#79b5ce','#f0c96d','#91b663','#e6a161'][i],scale=1.45)

for id,es,en,pos in [('xylophone','Xilófono','Xylophone',[-2,0,0]),('drum','Tambor','Drum',[2.2,0,.5]),('bell','Campanas','Bells',[4.3,.2,-1.1])]:
    phrase('instrument.'+id,es+'.',en+'.'); entity(id,'instrument',id,'music',pos,'instrument.'+id,scale=1.4 if id=='xylophone' else 1.25)

for id,es,en in [('sun','Sol','Sun'),('moon','Luna','Moon'),('cloud','Nube','Cloud'),('star','Estrella','Star'),('rain','Lluvia','Rain'),('wind','Viento','Wind')]: phrase('sky.'+id,es+'.',en+'.')
for id,es,en in [('flower','Flor','Flower'),('tree','Árbol','Tree'),('pond','Agua','Water'),('mushroom','Hongo','Mushroom'),('telescope','Telescopio','Telescope')]: phrase('nature.'+id,es+'.',en+'.')
entity('telescope','environment','telescope','observatory',[0,0,0],'nature.telescope',scale=1.6)

for id,es,en in [('sun','Sol','Sun'),('mercury','Mercurio','Mercury'),('venus','Venus','Venus'),('earth','La Tierra','Earth'),('moon','Luna','Moon'),('mars','Marte','Mars'),('jupiter','Júpiter','Jupiter'),('saturn','Saturno','Saturn'),('uranus','Urano','Uranus'),('neptune','Neptuno','Neptune')]: phrase('planet.'+id,es+'.',en+'.')

data=dict(places=place_data,entities=entities,strings=strings)
(ROOT/'src/data').mkdir(exist_ok=True)
(ROOT/'src/data/content.json').write_text(json.dumps(data,indent=2,ensure_ascii=False),encoding='utf-8')
(ROOT/'public/content.json').write_text(json.dumps(data,ensure_ascii=False),encoding='utf-8')
print('CONTENT_OK',len(entities),'entities,',len(strings['es']),'localization keys')
