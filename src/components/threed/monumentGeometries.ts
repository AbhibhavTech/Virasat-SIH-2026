import * as THREE from 'three';

export type Monument3DType =
  | 'gateway-of-india'
  | 'taj-mahal'
  | 'qutub-minar'
  | 'konark-sun-temple'
  | 'hampi-stone-temple'
  | 'amber-palace'
  | 'hawa-mahal';

export type MaterialCreator = (color: number, roughness?: number, metalness?: number) => THREE.MeshStandardMaterial;

export const FALLBACK_IMAGES: Record<string, string> = {
  'taj-mahal': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
  'gateway-of-india': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
  'qutub-minar': 'https://images.unsplash.com/photo-1545129139-1beb780cf337?auto=format&fit=crop&w=1200&q=80',
  'konark-sun-temple': 'https://images.unsplash.com/photo-1600100397608-f010f443b793?auto=format&fit=crop&w=1200&q=80',
  'hampi-stone-temple': 'https://images.unsplash.com/photo-1600100397608-f010f443b793?auto=format&fit=crop&w=1200&q=80',
  'amber-palace': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  'hawa-mahal': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80',
};

export function checkWebGLSupport(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

const addBox = (g: THREE.Group, [w, h, d]: [number, number, number], mat: THREE.Material, [x, y, z]: [number, number, number]) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  g.add(m);
  return m;
};

export function buildTajMahalGeometry(g: THREE.Group, createMat: MaterialCreator): void {
  const marble = createMat(0xf8fafc, 0.25, 0.05);
  const gold = createMat(0xf59e0b, 0.2, 0.5);
  const plinthMat = createMat(0xe2e8f0, 0.4, 0.05);

  addBox(g, [9, 0.8, 9], plinthMat, [0, -1.6, 0]);
  addBox(g, [4.6, 3.8, 4.6], marble, [0, 0.7, 0]);
  addBox(g, [2.4, 3.0, 4.8], marble, [0, 0.5, 0]);

  const dome = new THREE.Mesh(new THREE.SphereGeometry(2.2, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.75), marble);
  dome.position.y = 3.6;
  dome.scale.set(1, 1.25, 1);
  g.add(dome);

  const finial = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.25, 1.4, 16), gold);
  finial.position.y = 5.8;
  g.add(finial);

  [[-3.8, -3.8], [3.8, -3.8], [-3.8, 3.8], [3.8, 3.8]].forEach(([mx, mz]) => {
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 6.2, 16), marble);
    shaft.position.set(mx, 1.5, mz);
    g.add(shaft);
    const chhatri = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 12), marble);
    chhatri.position.set(mx, 4.7, mz);
    g.add(chhatri);
  });
}

export function buildQutubMinarGeometry(g: THREE.Group, createMat: MaterialCreator): void {
  const red = createMat(0x9a3412, 0.5, 0.1);
  const dark = createMat(0x7c2d12, 0.55, 0.1);
  const marble = createMat(0xf8fafc, 0.3, 0.05);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.0, 0.8, 32), dark);
  base.position.y = -1.6;
  g.add(base);

  const stories = [
    { bottomR: 2.8, topR: 2.2, h: 2.4, y: -0.2, mat: red },
    { bottomR: 2.1, topR: 1.7, h: 2.0, y: 1.8, mat: red },
    { bottomR: 1.6, topR: 1.3, h: 1.8, y: 3.5, mat: red },
    { bottomR: 1.25, topR: 1.0, h: 1.5, y: 5.0, mat: marble },
    { bottomR: 0.95, topR: 0.75, h: 1.2, y: 6.2, mat: marble },
  ];

  stories.forEach((st) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(st.topR, st.bottomR, st.h, 24), st.mat);
    mesh.position.y = st.y;
    g.add(mesh);
    const balcony = new THREE.Mesh(new THREE.CylinderGeometry(st.topR + 0.35, st.topR + 0.1, 0.25, 24), dark);
    balcony.position.y = st.y + st.h / 2;
    g.add(balcony);
  });
}

export function buildKonarkSunTempleGeometry(g: THREE.Group, createMat: MaterialCreator): void {
  const stone = createMat(0xb45309, 0.6, 0.1);
  const accent = createMat(0x92400e, 0.6, 0.1);

  addBox(g, [8, 1.4, 5.5], stone, [0, -1.3, 0]);
  const jagamohana = new THREE.Mesh(new THREE.ConeGeometry(3.5, 5.0, 4), stone);
  jagamohana.position.set(0, 1.8, 0);
  jagamohana.rotation.y = Math.PI / 4;
  g.add(jagamohana);

  const wheelGeo = new THREE.TorusGeometry(1.1, 0.22, 16, 32);
  [[-2.4, -1.2, 2.8], [2.4, -1.2, 2.8], [-2.4, -1.2, -2.8], [2.4, -1.2, -2.8]].forEach(([wx, wy, wz]) => {
    const wheel = new THREE.Mesh(wheelGeo, accent);
    wheel.position.set(wx, wy, wz);
    g.add(wheel);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16), accent);
    hub.rotation.x = Math.PI / 2;
    hub.position.set(wx, wy, wz);
    g.add(hub);
  });
}

export function buildHampiChariotGeometry(g: THREE.Group, createMat: MaterialCreator): void {
  const granite = createMat(0x78716c, 0.65, 0.1);
  const gold = createMat(0xd97706, 0.4, 0.2);

  addBox(g, [5.2, 1.5, 4.2], granite, [0, -1.2, 0]);
  addBox(g, [3.8, 2.6, 3.4], granite, [0, 0.8, 0]);

  const shikhara = new THREE.Mesh(new THREE.ConeGeometry(2.4, 2.8, 4), gold);
  shikhara.position.set(0, 3.4, 0);
  shikhara.rotation.y = Math.PI / 4;
  g.add(shikhara);

  const wheelGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.35, 24);
  [[-2.2, -1.1, 2.2], [2.2, -1.1, 2.2], [-2.2, -1.1, -2.2], [2.2, -1.1, -2.2]].forEach(([wx, wy, wz]) => {
    const w = new THREE.Mesh(wheelGeo, granite);
    w.rotation.z = Math.PI / 2;
    w.position.set(wx, wy, wz);
    g.add(w);
  });
}

export function buildAmberPalaceGeometry(g: THREE.Group, createMat: MaterialCreator): void {
  const sandstone = createMat(0xd97706, 0.55, 0.1);
  const red = createMat(0xb45309, 0.5, 0.1);
  const marble = createMat(0xf8fafc, 0.3, 0.05);

  addBox(g, [9, 1.6, 6.5], sandstone, [0, -1.2, 0]);
  addBox(g, [6.4, 2.4, 4.6], sandstone, [0, 0.8, 0]);
  addBox(g, [4.0, 1.5, 2.8], marble, [0, 2.7, 0]);

  [[-2.8, 2.2, -1.8], [2.8, 2.2, -1.8], [-2.8, 2.2, 1.8], [2.8, 2.2, 1.8]].forEach(([cx, cy, cz]) => {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 1.2, 12), red);
    pillar.position.set(cx, cy, cz);
    g.add(pillar);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6), sandstone);
    dome.position.set(cx, cy + 0.8, cz);
    g.add(dome);
  });
}

export function buildGatewayOfIndiaGeometry(g: THREE.Group, createMat: MaterialCreator): void {
  const basalt = createMat(0xa8a29e, 0.6, 0.1);
  const darkBasalt = createMat(0x78716c, 0.65, 0.1);

  addBox(g, [8.5, 0.8, 5.5], basalt, [0, -1.6, 0]);
  addBox(g, [2.4, 5.6, 4.2], basalt, [-2.5, 1.6, 0]);
  addBox(g, [2.4, 5.6, 4.2], basalt, [2.5, 1.6, 0]);
  addBox(g, [7.8, 1.8, 4.4], basalt, [0, 5.2, 0]);

  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.8, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.7), darkBasalt);
  dome.position.set(0, 6.2, 0);
  g.add(dome);

  [[-3.4, 4.8, -1.8], [3.4, 4.8, -1.8], [-3.4, 4.8, 1.8], [3.4, 4.8, 1.8]].forEach(([tx, ty, tz]) => {
    const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 2.2, 16), darkBasalt);
    turret.position.set(tx, ty, tz);
    g.add(turret);
    const tDome = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 12), darkBasalt);
    tDome.position.set(tx, ty + 1.2, tz);
    g.add(tDome);
  });
}

export function populateMonumentGeometry(
  type: Monument3DType,
  group: THREE.Group,
  createMat: MaterialCreator
): void {
  switch (type) {
    case 'taj-mahal':
      buildTajMahalGeometry(group, createMat);
      break;
    case 'qutub-minar':
      buildQutubMinarGeometry(group, createMat);
      break;
    case 'konark-sun-temple':
      buildKonarkSunTempleGeometry(group, createMat);
      break;
    case 'hampi-stone-temple':
      buildHampiChariotGeometry(group, createMat);
      break;
    case 'amber-palace':
      buildAmberPalaceGeometry(group, createMat);
      break;
    case 'gateway-of-india':
    default:
      buildGatewayOfIndiaGeometry(group, createMat);
      break;
  }
}
