# ARQUITECTURA TÉCNICA: "Frasco de Promesas para Karlita"

> **Estado vigente:** la experiencia actual usa una caja de regalo 3D, un HUD
> de seis emociones y tarjetas editoriales de versículos. El frasco 3D, las
> físicas de `cannon-es`, los rollitos y el botón de agitar fueron retirados
> definitivamente del flujo. Las secciones históricas que mencionan esos
> componentes se conservan como referencia de evolución, pero no describen
> dependencias activas.

## 1. Visión General del Sistema
La aplicación es una experiencia WebGL editorial desarrollada con Three.js,
GSAP y una capa UI HTML/CSS para la lectura contemplativa de las Sagradas
Escrituras (RVR1909). La escena muestra una caja de regalo PBR con apertura
articulada; la selección de emoción abre una tarjeta DOM con el versículo,
favoritos, copia y descarga.

---

## 2. Máquina de Estados de la Experiencia (`experienceStore.js`)

```
 [ INTRO_DEDICATION ]
         │
         ▼ (Clic en "Abrir regalo con amor")
 [ GIFT_BOX_CLOSED ]
         │
         ▼ (Animación GSAP: se desata el lazo y se eleva la tapa)
 [ UNBOXING_REVEAL ]
         │
         ▼ (El frasco emerge con halo dorado; la caja desciende/desaparece)
 [ JAR_INTERACTIVE ] ◄──────────┐
         │                      │
         ▼ (Clic en frasco /    │ (Cerrar modal /
            selección emoción)  │  "Volver al frasco")
 [ VERSE_EXTRACTION ]           │
         │                      │
         ▼ (Scroll animado sale │
            del frasco y se abre)
 [ VERSE_READING ] ─────────────┘
```

### Definición de Estados:
1. `INTRO_DEDICATION`:
   - Pantalla de bienvenida con tipografía editorial (Cinzel / Playfair Display).
   - Dedicatoria personal y botón de entrada que activa el contexto de audio (`audioManager.play()`).
2. `GIFT_BOX_CLOSED`:
   - Escena 3D enfocada en una elegante caja de regalo blanca texturizada con lazo de satén dorado y tarjeta con el nombre de Karlita.
3. `UNBOXING_REVEAL`:
   - Secuencia cinemática GSAP: cámara orbital lenta, el lazo se desanuda, la tapa se desliza hacia arriba revelando el interior iluminado por un resplandor cálido.
4. `JAR_INTERACTIVE`:
   - Estado principal de exploración.
   - El frasco de cristal veneciano contiene los 270 rollitos de papel físico.
   - Activo el HUD flotante (`EmotionHUD.js`):
     - Filtro por 6 emociones/colores.
     - Botón "Agitar frasco" (físicas reactivas).
     - Control mute/unmute de música sacra/ambiente.
     - Selector aleatorio o clic manual mediante raycasting.
5. `VERSE_EXTRACTION`:
   - La tapa de corcho se destapa suavemente.
   - Un rollo del color seleccionado levita desde el interior hasta posicionarse a la altura de los ojos.
   - Se desenrolla en el espacio 3D con partículas doradas.
6. `VERSE_READING`:
   - Se presenta el modal editorial de lectura (`VerseModal.js`) con el versículo bíblico RVR1909 completo, referencia, botón de "Copiar cita", botón de "Guardar en favoritos" y botón de "Tomar otra promesa".

---

## 3. Pipeline de Físicas y Renderizado (cannon-es + Three.js)

### Colisionador del Frasco (Compound Body):
- **Base:** Cilindro o plano circular en la base con fricción adecuada (`material` con `friction: 0.3`, `restitution: 0.2`).
- **Paredes:** Cilindro hueco aproximado por un cilindro físico de Cannon (`Cylinder`) o conjunto poligonal cerrado para impedir escape de papelitos.
- **Tapa de Corcho:** Colisionador superior activo que se remueve o eleva durante la extracción.

### Simulación de los 270 Papelitos:
- Cada rollito es un cuerpo cilíndrico delgado (`cannon.Cylinder` o `cannon.Box` simplificado).
- Se calculan masas bajas (`0.02 kg`) y alta amortiguación angular (`angularDamping: 0.4`) para emular papel enrollado denso.
- **Optimización de Rendimiento:**
  - `world.allowSleep = true`: Los rollitos se duermen al estabilizarse.
  - Sincronización de matrices de transformación directamente en un único `THREE.InstancedMesh`.
  - Cuando se agita el frasco, se despiertan los cuerpos (`body.wakeUp()`) y se aplican impulsos impulsivos `body.applyImpulse()`.

---

## 4. Guía de Personalización Rápida
Para cambiar los mensajes o dedicatoria sin alterar el código de la escena 3D:
1. Abre [src/config/dedication.js](../src/config/dedication.js).
2. Modifica el nombre, título, mensaje de apertura y firma.
3. Para la música de fondo: coloca tu pista de audio MP3 en `public/audio/music.mp3`.

---

## 5. Pipeline de Construcción y Despliegue en Netlify
- Build Tool: Vite
- Comando de compilación: `npm run build`
- Directorio de publicación: `dist`
- Configuración en `netlify.toml`: Redirección SPA estándar (`/* -> /index.html 200`) y compresión gzip/brotli.
