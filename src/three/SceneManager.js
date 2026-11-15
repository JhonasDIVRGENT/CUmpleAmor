import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { environmentConfig } from '../config/environmentConfig.js';

function champagneBackgroundTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(1024, 440, 0, 1024, 440, 760);
  gradient.addColorStop(0, '#F4E8DA');
  gradient.addColorStop(.42, '#EADBD0');
  gradient.addColorStop(.78, '#E9DDD3');
  gradient.addColorStop(1, '#DDCBBE');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function surfaceTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 768;
  const context = canvas.getContext('2d');
  context.fillStyle = '#E9DDD3';
  context.fillRect(0, 0, 768, 768);
  for (let index = 0; index < 12000; index += 1) {
    const tone = 205 + Math.floor(Math.random() * 25);
    context.fillStyle = `rgba(${tone + 8}, ${tone}, ${tone - 5}, .018)`;
    context.fillRect(Math.random() * 768, Math.random() * 768, 1, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function measurePerformance(name, start, end) {
  performance.measure(name, start, end);
  const entry = performance.getEntriesByName(name, 'measure').at(-1);
  if (entry) console.info(`[performance] ${name}: ${entry.duration.toFixed(1)}ms`);
}

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = champagneBackgroundTexture();
    this.scene.fog = new THREE.FogExp2(environmentConfig.fogColor, environmentConfig.fogDensity);
    this.camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100);
    this.camera.position.set(4.2, 2.35, 7.2);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    performance.mark('renderer-created');
    performance.mark('rendererCreated');
    this.contextLost = false;
    this.renderer.setClearColor(environmentConfig.backgroundColor, 1);
    this.renderer.setClearAlpha(1);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = environmentConfig.exposure;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.getContext();
    performance.mark('webglContextReady');
    container.appendChild(this.renderer.domElement);
    this.renderer.domElement.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      this.contextLost = true;
      console.error('[three] WebGL context lost', {
        time: performance.now().toFixed(1),
      });
    });
    this.renderer.domElement.addEventListener('webglcontextrestored', () => {
      this.contextLost = false;
      console.info('[three] WebGL context restored', {
        time: performance.now().toFixed(1),
      });
    });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 3.8;
    this.controls.maxDistance = 8.5;
    this.controls.minPolarAngle = 0.82;
    this.controls.maxPolarAngle = 1.7;
    this.controls.target.set(0, 0, 0);
    this.updaters = new Set();
    this.setupEnvironment();
    this.addSurfaceAndLights();
    this.addParticles();
    this.lastTime = performance.now();
    addEventListener('resize', () => this.resize());
  }

  setupEnvironment() {
    this.scene.environmentIntensity = environmentConfig.environmentIntensity;
  }

  addSurfaceAndLights() {
    const floorTexture = surfaceTexture();
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: environmentConfig.floorColor,
      map: floorTexture,
      bumpMap: floorTexture,
      bumpScale: 0.006,
      roughness: 0.85,
      metalness: 0,
    });
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      floorMaterial,
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.12;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const sun = new THREE.DirectionalLight(environmentConfig.keyLightColor, environmentConfig.keyLightIntensity);
    sun.position.set(-4.5, 7.5, 5.5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.radius = 3;
    sun.shadow.bias = -0.00015;
    sun.shadow.normalBias = 0.03;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 24;
    sun.shadow.camera.left = -6;
    sun.shadow.camera.right = 6;
    sun.shadow.camera.top = 6;
    sun.shadow.camera.bottom = -6;
    this.scene.add(sun);

    const fill = new THREE.HemisphereLight('#FFF8EE', '#B29A88', environmentConfig.fillLightIntensity);
    this.scene.add(fill);
    const rim = new THREE.PointLight(
      environmentConfig.rimLightColor,
      environmentConfig.rimLightIntensity,
      10,
    );
    rim.position.set(3.2, 3.2, -3.2);
    this.scene.add(rim);
  }

  addParticles() {
    const positions = new Float32Array(36 * 3);
    for (let index = 0; index < 36; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 6;
      positions[index * 3 + 1] = Math.random() * 4 - 0.6;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 64;
    const glowContext = glowCanvas.getContext('2d');
    const glow = glowContext.createRadialGradient(32, 32, 0, 32, 32, 32);
    glow.addColorStop(0, 'rgba(255,244,190,1)');
    glow.addColorStop(0.25, 'rgba(229,195,120,.55)');
    glow.addColorStop(1, 'rgba(229,195,120,0)');
    glowContext.fillStyle = glow;
    glowContext.fillRect(0, 0, 64, 64);
    const material = new THREE.PointsMaterial({
      color: '#E5C378',
      size: 0.035,
      map: new THREE.CanvasTexture(glowCanvas),
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
    this.updaters.add(delta => {
      this.particles.rotation.y += delta * 0.02;
      this.particles.position.y = Math.sin(performance.now() * 0.00035) * 0.06;
    });
  }

  addUpdater(updater) {
    this.updaters.add(updater);
    return () => this.updaters.delete(updater);
  }

  start() {
    let firstRender = true;
    const frame = now => {
      const delta = (now - this.lastTime) / 1000;
      this.lastTime = now;
      this.controls.update();
      this.updaters.forEach(updater => updater(delta));
      if (firstRender) {
        if (this.contextLost) {
          requestAnimationFrame(frame);
          return;
        }
        try {
          this.renderer.render(this.scene, this.camera);
        } catch (error) {
          console.error('[three] First render failed', error);
          requestAnimationFrame(frame);
          return;
        }
        firstRender = false;
        performance.mark('first-giftbox-render');
        performance.mark('firstFrameRendered');
        window.dispatchEvent(new CustomEvent('scene:first-frame-rendered'));
        window.dispatchEvent(new CustomEvent('scene:ready'));
        if (performance.getEntriesByName('giftbox-created', 'mark').length) {
          measurePerformance('giftbox-to-first-render', 'giftbox-created', 'first-giftbox-render');
        }
      } else {
        try {
          if (!this.contextLost) {
            this.renderer.render(this.scene, this.camera);
          }
        } catch (error) {
          console.error('[three] Render loop failed', error);
        }
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  resize() {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
  }
}
