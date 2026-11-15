# AGENT RULES & ARCHITECTURAL DIRECTIVES: "Frasco de Promesas para Karlita"

## 1. Misión y Filosofía
Este proyecto no es una demo técnica genérica. Es un regalo de cumpleaños espiritual, íntimo, interactivo y cinematográfico para Karlita.
Cada decisión técnica, visual y de copy debe transmitir:
- **Elegancia editorial de lujo** (estética *Cereal Magazine*, *Kinfolk*, alta joyería francesa, oro cepillado, papel de algodón de 300g, cristal veneciano puro).
- **Profundidad espiritual genuina** (Reina-Valera 1909 intacta, reverente, consoladora y sin inventar textos bíblicos).
- **Rigor técnico absoluto** (arquitectura limpia, 60 FPS estables, WebGL optimizado, PBR riguroso y físicas verosímiles).

---

## 2. Reglas Estrictas de Versículos y Datos Bíblicos
1. **Versión Obligatoria:** Todos los versículos provienen estrictamente de la traducción **Reina-Valera 1909 (RVR1909)**, de dominio público.
2. **Cero Placeholders Falsos:** Está TERMINANTEMENTE PROHIBIDO generar versículos tipo "Lorem ipsum", "Dios te bendiga 1:1" o versículos inventados.
3. **Volumen de Datos Requerido:**
   - Exactamente **270 versículos** (o más si se añade buffer), en RVR1909.
   - Distribución equitativa: **45 versículos por cada una de las 6 emociones/categorías**:
     - `feliz`, `agradecida`, `enfadada`, `ansiosa`, `solitaria`, `triste`
4. **Estructura de Objeto Inviolable:**
   ```json
   {
     "id": "paz_001",
     "category": "ansiosa",
     "book": "Filipenses",
     "chapter": 4,
     "verse": "6-7",
     "reference": "Filipenses 4:6-7",
     "text": "Texto completo autorizado de RVR1909",
     "version": "RVR1909"
   }
   ```
5. **Validación Automática:** Antes de dar por completada cualquier fase con datos, debe ejecutarse exitosamente:
   ```bash
   node scripts/validate-verses.mjs
   ```

---

## 3. Reglas de Renderizado 3D y WebGL (Three.js)
1. **Flujo de Iluminación y Color:**
   - Renderer con `toneMapping = THREE.ACESFilmicToneMapping` y `toneMappingExposure = 1.05 - 1.15`.
   - `outputColorSpace = THREE.SRGBColorSpace`.
   - Iluminación de estudio: Key Light cálida suave (3200K - 4000K), Fill Light difusa complementaria (5500K), Rim Light dorado rasante y entorno HDRI/PMREM neutro de alta fidelidad (`RoomEnvironment`).
2. **Materiales Fotorrealistas (PBR):**
   - **Cristal del Frasco:** `MeshPhysicalMaterial` con `transmission: 0.95`, `roughness: 0.05`, `ior: 1.52`, `metalness: 0.0`, `thickness: 1.2`, `attenuationColor` sutil y reflexión especular nítida.
   - **Papelitos:** `MeshStandardMaterial` o `MeshPhysicalMaterial` con rugosidad alta (`0.75 - 0.85`), `metalness: 0.0` y leve `subsurface scattering` simulado vía `sheen` o tinte translúcido.
   - **Tapa de Corcho:** Rugosidad procedural o mapeo granular orgánico.
   - **Detalles Dorados:** `metalness: 0.88`, `roughness: 0.22`, color dorado champagne `#E5C378` (evitar dorados amarillentos chillones).
3. **Instancing Obligatorio para los 270 Papelitos:**
   - Los 270 rollitos deben renderizarse preferentemente mediante `THREE.InstancedMesh` para mantener las llamadas de dibujo (draw calls) al mínimo absoluto (< 20 draw calls por fotograma).
4. **Post-Processing Medido:**
   - Bloom muy controlado (`UnrealBloomPass` con umbral alto `threshold: 0.85`, radio sutil y fuerza suave `0.3 - 0.45`). Solo las luces especulares y los acentos dorados deben emanar brillo, nunca la escena completa.

---

## 4. Reglas del Pipeline Físico (cannon-es)
1. **Mundo Físico Separado:** Frecuencia fija (fixed timestep a 60Hz: `1/60s`) para evitar inestabilidad numérica.
2. **Contenedor Cilíndrico Seguro:** El interior del frasco debe estar delimitado por cilindro o planos compuestos de colisión para que ningún rollito escape o atraviese el cristal.
3. **Modo Dormido (Sleep States):** Activar `allowSleep: true` en los cuerpos rígidos de los rollos para que consuman 0% de CPU una vez reposen en el fondo del frasco.
4. **Agitación Dinámica:** Al activar "Agitar frasco" o rotar enérgicamente con el mouse/touch, aplicar impulsos y torques aleatorios coherentes en los cuerpos activos.

---

## 5. Reglas de Animación y Coreografía (GSAP)
1. Usar curvas de aceleración naturales (`power3.out`, `expo.out`, `sine.inOut`).
2. La cámara debe interpolarse suavemente con `OrbitControls.enableDamping = true` (`dampingFactor = 0.05`).
3. La extracción del pergamino (`ActiveScroll.js`) debe ejecutarse en 3 actos:
   - Acto I: Destape o despegue del corcho y ascenso vertical levitante del rollo seleccionado.
   - Acto II: Desenrolle cilíndrico en el aire con partículas o destellos sutiles dorados.
   - Acto III: Acercamiento suave a la cámara y apertura del canvas de lectura (`VerseModal.js`).

---

## 6. Rendimiento y Compatibilidad Móvil
1. **Target:** 60 FPS fluidos en navegadores de escritorio y dispositivos móviles modernos.
2. **Pixel Ratio Limitado:** `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`.
3. **Gestión de Memoria:** Todo objeto creado debe poder eliminarse (`dispose()` de geometrías, materiales y texturas) sin memory leaks.
4. **Audio Web Autoplay:** El audio debe respetar las políticas de interacción del navegador (iniciar solo tras la primera interacción del usuario en la pantalla de bienvenida con un fade-in ultrasuave).

---

## 7. Separación de Responsabilidades
- `src/config/`: Textos personales, nombres, dedicatoria y parámetros de fácil personalización por el usuario sin tocar código Three.js.
- `src/data/`: Datos puros (versículos y categorías cromáticas).
- `src/state/`: Estado reactivo (máquina de estados, filtro de emoción activo, versículo en pantalla, historial).
- `src/three/`: Únicamente lógica WebGL, meshes, shaders, luces, físicas y cámara.
- `src/ui/`: Capa DOM HTML/Tailwind para overlays, tipografía nítida y accesibilidad.
