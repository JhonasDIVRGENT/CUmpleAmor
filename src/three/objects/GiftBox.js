import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { dedication } from '../../config/dedication.js';

function textTexture(text, width = 2048, height = 2048, background = '#FBF4E8', foreground = '#8B6914') {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);
  context.strokeStyle = 'rgba(177, 137, 67, .72)';
  context.lineWidth = 5;
  context.strokeRect(26, 26, width - 52, height - 52);
  context.strokeStyle = 'rgba(177, 137, 67, .28)';
  context.lineWidth = 2;
  context.strokeRect(48, 48, width - 96, height - 96);
  context.fillStyle = foreground;
  context.shadowColor = 'rgba(86, 54, 18, .16)';
  context.shadowBlur = 4;
  context.textAlign = 'center';
  const lines = text.split('\n');
  let fontSize = height < 1500 ? 132 : 176;
  const maxTextWidth = width - 120;
  do {
    context.font = `600 ${fontSize}px Georgia`;
    if (Math.max(...lines.map(line => context.measureText(line).width)) <= maxTextWidth) break;
    fontSize -= 4;
  } while (fontSize > 56);
  context.font = `600 ${fontSize}px Georgia`;
  context.textBaseline = 'middle';
  const lineHeight = height * 0.19;
  lines.forEach((line, index) => context.fillText(line, width / 2, height / 2 - (lines.length - 1) * lineHeight / 2 + index * lineHeight));
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function paperTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 768;
  const context = canvas.getContext('2d');
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, 768, 768);
  for (let index = 0; index < 18000; index += 1) {
    const tone = 208 + Math.floor(Math.random() * 30);
    context.fillStyle = `rgba(${tone + 9}, ${tone + 2}, ${tone - 5}, .018)`;
    context.fillRect(Math.random() * 768, Math.random() * 768, 1, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.5, 2.5);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function champagne() {
  return new THREE.MeshPhysicalMaterial({
    color: '#D0AE6C',
    metalness: 0.86,
    roughness: 0.3,
    clearcoat: 0.18,
    clearcoatRoughness: 0.32,
  });
}

function satinRibbon() {
  return new THREE.MeshPhysicalMaterial({
    color: '#D7B66F',
    metalness: 0.25,
    roughness: 0.38,
    clearcoat: 0.35,
    clearcoatRoughness: 0.3,
  });
}

export class GiftBox {
  constructor() {
    this.group = new THREE.Group();
    this.group.position.y = -0.15;
    const paper = paperTexture();
    const paperBump = paper.clone();
    paperBump.colorSpace = THREE.NoColorSpace;
    paperBump.needsUpdate = true;
    const ivory = new THREE.MeshStandardMaterial({
      color: '#FFFDF8',
      map: paper,
      bumpMap: paperBump,
      bumpScale: 0.012,
      roughness: 0.78,
      metalness: 0,
      emissive: '#FFF8EC',
      emissiveIntensity: 0.08,
    });
    const lidMaterial = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      map: paper,
      bumpMap: paperBump,
      bumpScale: 0.009,
      roughness: 0.70,
      metalness: 0,
      emissive: '#FFF8EC',
      emissiveIntensity: 0.08,
    });
    const gold = champagne();
    const ribbonGold = satinRibbon();
    const velvet = new THREE.MeshStandardMaterial({
      color: '#E8D7C5',
      roughness: 0.85,
      metalness: 0,
    });
    const silk = new THREE.MeshStandardMaterial({
      color: '#E8D7C5',
      roughness: 0.85,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    const envelope = new THREE.MeshStandardMaterial({
      color: '#E8D6C1',
      roughness: 0.72,
      metalness: 0.01,
    });

    this.baseGroup = new THREE.Group();
    const floor = new THREE.Mesh(new RoundedBoxGeometry(2.8, 0.16, 2.45, 6, 0.05), ivory);
    floor.position.y = -0.98;
    floor.castShadow = true;
    floor.receiveShadow = true;
    this.baseGroup.add(floor);
    const innerFloor = new THREE.Mesh(new RoundedBoxGeometry(2.42, 0.035, 2.08, 5, 0.04), velvet);
    innerFloor.position.y = -0.88;
    innerFloor.receiveShadow = true;
    this.baseGroup.add(innerFloor);
    const tissue = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.8), silk);
    tissue.rotation.x = -Math.PI / 2;
    tissue.rotation.z = -0.08;
    tissue.position.set(0, -0.835, 0.04);
    tissue.receiveShadow = true;
    this.baseGroup.add(tissue);
    const keepsake = new THREE.Mesh(new RoundedBoxGeometry(1.02, 0.07, 0.68, 5, 0.035), envelope);
    keepsake.position.set(0, -0.75, 0.12);
    keepsake.rotation.y = -0.08;
    keepsake.castShadow = true;
    this.baseGroup.add(keepsake);
    const keepsakeStripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.82, 0.012, 0.012),
      gold,
    );
    keepsakeStripe.position.set(0, -0.705, 0.12);
    keepsakeStripe.rotation.y = -0.08;
    this.baseGroup.add(keepsakeStripe);
    const seal = new THREE.Mesh(
      new THREE.CircleGeometry(0.09, 24),
      new THREE.MeshStandardMaterial({ color: '#B97968', roughness: 0.55, metalness: 0.05 }),
    );
    seal.rotation.x = -Math.PI / 2;
    seal.position.set(0.2, -0.69, 0.1);
    this.baseGroup.add(seal);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: '#829175', roughness: 0.8 });
    const petalMaterial = new THREE.MeshStandardMaterial({ color: '#D9AEB2', roughness: 0.72, side: THREE.DoubleSide });
    [-0.86, 0.86].forEach(x => {
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.55, 8), stemMaterial);
      stem.position.set(x, -0.59, 0.58);
      stem.rotation.z = x < 0 ? -0.2 : 0.2;
      this.baseGroup.add(stem);
      for (let petalIndex = 0; petalIndex < 3; petalIndex += 1) {
        const petal = new THREE.Mesh(new THREE.CircleGeometry(0.09, 16), petalMaterial);
        petal.rotation.x = -Math.PI / 2;
        petal.position.set(x + (petalIndex - 1) * 0.08, -0.31, 0.58 + (petalIndex % 2) * 0.06);
        this.baseGroup.add(petal);
      }
    });
    const wallHeight = 1.34;
    const wallY = -0.27;
    const backWall = new THREE.Mesh(new RoundedBoxGeometry(2.8, wallHeight, 0.1, 4, 0.03), ivory);
    backWall.position.set(0, wallY, -1.18);
    const frontWall = backWall.clone();
    frontWall.position.z = 1.18;
    const sideWall = new THREE.Mesh(new RoundedBoxGeometry(0.1, wallHeight, 2.25, 4, 0.03), ivory);
    sideWall.position.set(-1.35, wallY, 0);
    const rightWall = sideWall.clone();
    rightWall.position.x = 1.35;
    [backWall, frontWall, sideWall, rightWall].forEach(wall => {
      wall.castShadow = true;
      wall.receiveShadow = true;
      this.baseGroup.add(wall);
    });
    const rimFront = new THREE.Mesh(new THREE.BoxGeometry(2.82, 0.035, 0.045), gold);
    rimFront.position.set(0, 0.42, 1.205);
    const rimBack = rimFront.clone();
    rimBack.position.z = -1.205;
    const rimLeft = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.035, 2.38), gold);
    rimLeft.position.set(-1.405, 0.42, 0);
    const rimRight = rimLeft.clone();
    rimRight.position.x = 1.405;
    this.baseGroup.add(rimFront, rimBack, rimLeft, rimRight);
    this.group.add(this.baseGroup);

    this.lidGroup = new THREE.Group();
    this.lidPivot = this.lidGroup;
    this.lidGroup.position.set(0, 0.4, -1.12);

    const lid = new THREE.Mesh(new RoundedBoxGeometry(2.92, 0.2, 2.52, 6, 0.05), lidMaterial);
    lid.position.set(0, 0.02, 1.18);
    lid.castShadow = true;
    this.lidGroup.add(lid);

    const frontMessageMaterial = new THREE.MeshStandardMaterial({
      map: textTexture(dedication.boxFrontMessage, 2048, 1024, '#F7F0E5', '#75502F'),
      color: '#F7F0E5',
      roughness: 0.74,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    const frontMessage = new THREE.Mesh(
      new THREE.PlaneGeometry(2.24, 0.48),
      frontMessageMaterial,
    );
    frontMessage.position.set(0, -0.2, 1.235);
    this.baseGroup.add(frontMessage);

    const ribbonX = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.012, 2.5), gold);
    ribbonX.position.set(0, 0.13, 1.18);
    const ribbonZ = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.012, 0.32), gold);
    ribbonZ.position.set(0, 0.132, 1.18);
    this.lidGroup.add(ribbonX, ribbonZ);
    ribbonX.material = ribbonGold;
    ribbonZ.material = ribbonGold;

    this.ribbon = new THREE.Group();
    const petal = new THREE.BoxGeometry(0.42, 0.012, 0.22);
    const petals = [
      { x: -0.22, z: 0, ry: 0.18, rz: 0.12 },
      { x: 0.22, z: 0, ry: -0.18, rz: -0.12 },
      { x: 0, z: 0.16, ry: Math.PI / 2, rz: 0.1 },
      { x: 0, z: -0.16, ry: Math.PI / 2, rz: -0.1 },
    ];
    petals.forEach(pose => {
      const loop = new THREE.Mesh(petal, gold);
      loop.position.set(pose.x, 0.02, pose.z);
      loop.rotation.set(0.08, pose.ry, pose.rz);
      loop.material = ribbonGold;
      this.ribbon.add(loop);
    });
    const knot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.16), gold);
    knot.position.y = 0.04;
    knot.material = ribbonGold;
    this.ribbon.add(knot);
    this.ribbon.position.set(0, 0.15, 1.18);
    this.lidGroup.add(this.ribbon);
    this.group.add(this.lidGroup);
    this.hitTarget = floor;
    performance.mark('dedication-drawn');
  }

  open() {
    return this.lidGroup;
  }
}
