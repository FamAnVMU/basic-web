import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SOLAR_PLANETS } from '../../data/solarSystemData';
import type { PlanetData, PlanetSatellite } from '../../data/solarSystemData';

interface HoverInfo {
  id: string;
  name: string;
  subtitle: string;
  x: number;
  y: number;
}

export interface SatelliteScreenPosition {
  id: string;
  x: number;
  y: number;
  satellite: PlanetSatellite;
}

export interface NavTarget {
  id: string;
  timestamp: number;
}

interface SolarSystemCanvasProps {
  activePlanetId: string;
  navTarget: NavTarget;
  isOverview: boolean;
  onSelectPlanet: (planetId: string, openDetails?: boolean) => void;
  onHoverPlanet: (info: HoverInfo | null) => void;
  onUpdateSatellitePositions: (positions: SatelliteScreenPosition[]) => void;
  onActivePlanetChange?: (planetId: string) => void;
  onExitOverview?: () => void;
  isDetailsOpen: boolean;
  planets?: PlanetData[];
}

export const SolarSystemCanvas: React.FC<SolarSystemCanvasProps> = ({
  activePlanetId,
  navTarget,
  isOverview,
  onSelectPlanet,
  onHoverPlanet,
  onUpdateSatellitePositions,
  onActivePlanetChange,
  onExitOverview,
  isDetailsOpen,
  planets = SOLAR_PLANETS,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activePlanetRef = useRef<string>(activePlanetId);
  activePlanetRef.current = activePlanetId;

  const planetsRef = useRef<PlanetData[]>(planets);
  planetsRef.current = planets;

  const isOverviewRef = useRef<boolean>(isOverview);
  isOverviewRef.current = isOverview;

  const isDetailsOpenRef = useRef<boolean>(isDetailsOpen);
  isDetailsOpenRef.current = isDetailsOpen;

  const onSelectRef = useRef(onSelectPlanet);
  onSelectRef.current = onSelectPlanet;

  const onHoverRef = useRef(onHoverPlanet);
  onHoverRef.current = onHoverPlanet;

  const onUpdateSatellitesRef = useRef(onUpdateSatellitePositions);
  onUpdateSatellitesRef.current = onUpdateSatellitePositions;

  const onActivePlanetChangeRef = useRef(onActivePlanetChange);
  onActivePlanetChangeRef.current = onActivePlanetChange;

  const onExitOverviewRef = useRef(onExitOverview);
  onExitOverviewRef.current = onExitOverview;

  const targetProgressRef = useRef<number>(
    Math.max(0, planets.findIndex((p) => p.id === activePlanetId))
  );
  const currentProgressRef = useRef<number>(targetProgressRef.current);
  const lastNotifiedPlanetId = useRef<string>(activePlanetId);
  const isProgrammaticNavRef = useRef<boolean>(false);

  const triggerDirectWarpRef = useRef<((targetIdx: number, targetId: string) => void) | null>(null);

  // Sync target progress whenever navTarget changes from UI clicks (dock / nav / badges / meshes)
  useEffect(() => {
    if (!navTarget) return;
    const idx = planetsRef.current.findIndex((p) => p.id === navTarget.id);
    if (idx !== -1) {
      isProgrammaticNavRef.current = true;
      lastNotifiedPlanetId.current = navTarget.id;
      activePlanetRef.current = navTarget.id;

      if (triggerDirectWarpRef.current) {
        triggerDirectWarpRef.current(idx, navTarget.id);
      } else {
        currentProgressRef.current = idx;
        targetProgressRef.current = idx;
      }
    }
  }, [navTarget]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020612, 0.0008);

    const camera = new THREE.PerspectiveCamera(
      46,
      window.innerWidth / window.innerHeight,
      0.1,
      2500
    );
    // Initial camera position matches focused home planet view with zero stutter
    camera.position.set(0, 0.6, 31.5);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: !isMobile,
      alpha: false,
    });
    renderer.setClearColor(0x020612, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    // 2. High-Res Particle & Cosmic Cloud Textures
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.25, 'rgba(210, 240, 255, 0.95)');
      grad.addColorStop(0.55, 'rgba(56, 189, 248, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const createNebulaCloudTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.25, 'rgba(220, 240, 255, 0.65)');
      grad.addColorStop(0.5, 'rgba(140, 180, 255, 0.25)');
      grad.addColorStop(0.75, 'rgba(60, 120, 255, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const createDiffractionStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      const cx = 64;
      const cy = 64;

      // Horizontal diffraction spike
      const hGrad = ctx.createLinearGradient(0, cy, 128, cy);
      hGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      hGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
      hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = hGrad;
      ctx.fillRect(0, cy - 1.5, 128, 3);

      // Vertical diffraction spike
      const vGrad = ctx.createLinearGradient(cx, 0, cx, 128);
      vGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      vGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
      vGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = vGrad;
      ctx.fillRect(cx - 1.5, 0, 3, 128);

      // Diamond core bloom
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(210, 245, 255, 0.85)');
      grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const particleTexture = createParticleTexture();
    const nebulaTexture = createNebulaCloudTexture();
    const flareTexture = createDiffractionStarTexture();

    // 3. Cinematic Star Lighting
    const ambientLight = new THREE.AmbientLight(0x0d1e34, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x93c5fd, 3.8);
    sunLight.position.set(28, 20, 24);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x0284c7, 1.6);
    rimLight.position.set(-25, -12, -12);
    scene.add(rimLight);

    // 4. Background Starfields, Cosmic Nebulae & Milky Way Dust
    // Helper: Astronomical spectral star color distribution (O, B, A, F, G, K, M)
    const getAstronomicalStarColor = (type: number, lum: number = 1.0) => {
      if (type < 0.38) {
        // Class O/B: Diamond Blue-White
        return [0.78 * lum, 0.90 * lum, 1.0 * lum];
      } else if (type < 0.62) {
        // Class A: Electric Cyan & Ice Blue
        return [0.35 * lum, 0.85 * lum, 1.0 * lum];
      } else if (type < 0.78) {
        // Class F/G: Warm Sun Gold & Champagne
        return [1.0 * lum, 0.90 * lum, 0.60 * lum];
      } else if (type < 0.90) {
        // Class K/M: Ruby Amber & Rose Flame
        return [1.0 * lum, 0.62 * lum, 0.45 * lum];
      } else {
        // Cosmic Violet / Nebula Purple
        return [0.88 * lum, 0.68 * lum, 1.0 * lum];
      }
    };

    // 4.1 Tier 1: Deep Cosmic Micro-Dust (Infinite velvety depth)
    const dustCount = isMobile ? 1200 : 3200;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      const radius = THREE.MathUtils.randFloat(450, 950);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));

      dustPos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      dustPos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      dustPos[i3 + 2] = radius * Math.cos(phi);

      const lum = THREE.MathUtils.randFloat(0.35, 0.85);
      const [r, g, b] = getAstronomicalStarColor(Math.random(), lum);
      dustColors[i3] = r;
      dustColors[i3 + 1] = g;
      dustColors[i3 + 2] = b;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 1.8,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustField = new THREE.Points(dustGeo, dustMat);
    scene.add(dustField);

    // 4.2 Tier 2: Mid-Field Multi-Spectral Stars
    const starCount = isMobile ? 900 : 2200;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = THREE.MathUtils.randFloat(280, 750);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));

      starPos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPos[i3 + 2] = radius * Math.cos(phi);

      const lum = THREE.MathUtils.randFloat(0.7, 1.35);
      const [r, g, b] = getAstronomicalStarColor(Math.random(), lum);
      starColors[i3] = r;
      starColors[i3 + 1] = g;
      starColors[i3 + 2] = b;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 3.2,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 4.3 Tier 3: Milky Way Galactic Rift & Stardust Band (Dải Ngân Hà)
    const mwCount = isMobile ? 650 : 1800;
    const mwGeo = new THREE.BufferGeometry();
    const mwPos = new Float32Array(mwCount * 3);
    const mwColors = new Float32Array(mwCount * 3);

    // Tilted Galactic coordinate transformation
    const mwRotationMatrix = new THREE.Matrix4()
      .makeRotationX(THREE.MathUtils.degToRad(38))
      .multiply(new THREE.Matrix4().makeRotationZ(THREE.MathUtils.degToRad(-24)));

    for (let i = 0; i < mwCount; i++) {
      const i3 = i * 3;
      // Angle along galactic disc
      const angle = Math.random() * Math.PI * 2;
      const distance = THREE.MathUtils.randFloat(350, 700);
      // Gaussian concentration near the galactic disc plane
      const discSpread = (Math.random() + Math.random() + Math.random() - 1.5) * 65;
      const discRadialSpread = (Math.random() - 0.5) * 120;

      const pVec = new THREE.Vector3(
        (distance + discRadialSpread) * Math.cos(angle),
        discSpread,
        (distance + discRadialSpread) * Math.sin(angle)
      ).applyMatrix4(mwRotationMatrix);

      mwPos[i3] = pVec.x;
      mwPos[i3 + 1] = pVec.y;
      mwPos[i3 + 2] = pVec.z;

      // Color variation: Golden galactic core blending into cyan/violet stellar arms
      const coreProximity = Math.abs(Math.sin(angle));
      const lum = THREE.MathUtils.randFloat(0.55, 1.25);
      if (coreProximity > 0.6) {
        // Warm gold / amber dust
        mwColors[i3] = 1.0 * lum;
        mwColors[i3 + 1] = 0.85 * lum;
        mwColors[i3 + 2] = 0.5 * lum;
      } else {
        // Cyan & lavender stellar dust
        mwColors[i3] = 0.45 * lum;
        mwColors[i3 + 1] = 0.8 * lum;
        mwColors[i3 + 2] = 1.0 * lum;
      }
    }
    mwGeo.setAttribute('position', new THREE.BufferAttribute(mwPos, 3));
    mwGeo.setAttribute('color', new THREE.BufferAttribute(mwColors, 3));

    const mwMat = new THREE.PointsMaterial({
      size: 2.4,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mwField = new THREE.Points(mwGeo, mwMat);
    scene.add(mwField);

    // 4.4 Tier 4: Hero Beacon Stars & Pulsars (Diffraction Spikes / James Webb Style)
    const heroCount = 38;
    const heroGeo = new THREE.BufferGeometry();
    const heroPos = new Float32Array(heroCount * 3);
    const heroColors = new Float32Array(heroCount * 3);

    for (let i = 0; i < heroCount; i++) {
      const i3 = i * 3;
      const radius = THREE.MathUtils.randFloat(320, 680);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));

      heroPos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      heroPos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      heroPos[i3 + 2] = radius * Math.cos(phi);

      const [r, g, b] = getAstronomicalStarColor(Math.random(), 1.4);
      heroColors[i3] = r;
      heroColors[i3 + 1] = g;
      heroColors[i3 + 2] = b;
    }
    heroGeo.setAttribute('position', new THREE.BufferAttribute(heroPos, 3));
    heroGeo.setAttribute('color', new THREE.BufferAttribute(heroColors, 3));

    const heroMat = new THREE.PointsMaterial({
      size: 16.0,
      map: flareTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const heroStars = new THREE.Points(heroGeo, heroMat);
    scene.add(heroStars);

    // 4.5 3D Volumetric Cosmic Nebulae (Glowing interstellar gas clouds)
    const nebulaGroup = new THREE.Group();
    const nebulaMaterials: THREE.SpriteMaterial[] = [];

    // Helper to spawn a billowing nebula cluster
    const createNebulaCluster = (
      center: THREE.Vector3,
      count: number,
      spread: number,
      palette: number[],
      baseScale: number,
      opacity: number
    ) => {
      for (let i = 0; i < count; i++) {
        const colorHex = palette[i % palette.length];
        const mat = new THREE.SpriteMaterial({
          map: nebulaTexture,
          color: colorHex,
          transparent: true,
          opacity: opacity * THREE.MathUtils.randFloat(0.75, 1.25),
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        nebulaMaterials.push(mat);

        const sprite = new THREE.Sprite(mat);
        const offset = new THREE.Vector3(
          THREE.MathUtils.randFloatSpread(spread),
          THREE.MathUtils.randFloatSpread(spread * 0.7),
          THREE.MathUtils.randFloatSpread(spread)
        );
        sprite.position.copy(center).add(offset);
        const s = baseScale * THREE.MathUtils.randFloat(0.8, 1.4);
        sprite.scale.set(s, s, 1);
        nebulaGroup.add(sprite);
      }
    };

    // Nebula 1: The Cygnus Cyan & Electric Teal Lagoon (Top-left sky)
    createNebulaCluster(
      new THREE.Vector3(-320, 180, -420),
      isMobile ? 8 : 16,
      180,
      [0x06b6d4, 0x0284c7, 0x0891b2, 0x38bdf8],
      180,
      0.15
    );

    // Nebula 2: The Carina Violet-Magenta Stellar Rose (Lower-right deep space)
    createNebulaCluster(
      new THREE.Vector3(340, -140, -450),
      isMobile ? 9 : 18,
      200,
      [0x7c3aed, 0xa855f7, 0xdb2777, 0x4c1d95],
      190,
      0.14
    );

    // Nebula 3: The Sagittarius Golden Amber Core (Galactic center dust)
    createNebulaCluster(
      new THREE.Vector3(60, -220, -480),
      isMobile ? 6 : 14,
      220,
      [0xd97706, 0xb45309, 0xf59e0b, 0x6366f1],
      220,
      0.12
    );

    scene.add(nebulaGroup);

    // 4.6 Shooting Stars (Meteors - Sao Băng)
    const meteorMax = 2;
    const meteorPool: {
      line: THREE.Line;
      geo: THREE.BufferGeometry;
      active: boolean;
      progress: number;
      speed: number;
      start: THREE.Vector3;
      end: THREE.Vector3;
      trailLength: number;
    }[] = [];

    const meteorMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      linewidth: 2,
    });

    for (let i = 0; i < meteorMax; i++) {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(6); // 2 vertices: head and tail
      const cols = new Float32Array(6);
      // Head: pure white
      cols[0] = 1; cols[1] = 1; cols[2] = 1;
      // Tail: cyan, fading
      cols[3] = 0; cols[4] = 0.85; cols[5] = 1;
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));

      const line = new THREE.Line(geo, meteorMat);
      line.visible = false;
      scene.add(line);

      meteorPool.push({
        line,
        geo,
        active: false,
        progress: 0,
        speed: 1.0,
        start: new THREE.Vector3(),
        end: new THREE.Vector3(),
        trailLength: 60,
      });
    }

    let nextMeteorTime = performance.now() + 2500;
    const triggerMeteor = () => {
      const meteor = meteorPool.find((m) => !m.active);
      if (!meteor) return;

      const sx = THREE.MathUtils.randFloat(-350, 350);
      const sy = THREE.MathUtils.randFloat(180, 420);
      const sz = THREE.MathUtils.randFloat(-380, -180);
      meteor.start.set(sx, sy, sz);

      // Trajectory downward and across
      const dx = THREE.MathUtils.randFloat(-240, -140) * (Math.random() > 0.5 ? 1 : -1);
      const dy = THREE.MathUtils.randFloat(-200, -120);
      const dz = THREE.MathUtils.randFloat(-40, 40);
      meteor.end.set(sx + dx, sy + dy, sz + dz);

      meteor.trailLength = THREE.MathUtils.randFloat(55, 90);
      meteor.speed = THREE.MathUtils.randFloat(0.018, 0.032);
      meteor.progress = 0;
      meteor.active = true;
      meteor.line.visible = true;
    };

    // 5. Photorealistic Texture Loader & Centerpiece Main Planet: "PHAM AN" (NASA Blue Marble 4K)
    const textureLoader = new THREE.TextureLoader();

    // Load High-Res NASA & Planetary Maps
    const earthDayMap = textureLoader.load('/textures/earth_day.jpg');
    const earthNormalMap = textureLoader.load('/textures/earth_normal.jpg');
    const earthSpecMap = textureLoader.load('/textures/earth_specular.jpg');
    const earthCloudsMap = textureLoader.load('/textures/earth_clouds.png');
    const earthLightsMap = textureLoader.load('/textures/earth_lights.png');

    [earthDayMap, earthNormalMap, earthSpecMap, earthCloudsMap, earthLightsMap].forEach((t) => {
      t.anisotropy = maxAnisotropy;
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
    });

    const mainPlanetGroup = new THREE.Group();
    // Offset downwards to match reference composition where planet comfortably sits in lower half
    mainPlanetGroup.position.set(0, -6.8, 0);
    scene.add(mainPlanetGroup);

    const mainRadius = 5.2; // Slightly more compact to provide generous space for top telemetry text
    const mainGeo = new THREE.SphereGeometry(mainRadius, 128, 128); // 128x128 for ultra crisp sphere

    // Main Surface Material with Normal Relief, Water Specular, and Cyber Night Lights
    const mainMat = new THREE.MeshStandardMaterial({
      map: earthDayMap,
      normalMap: earthNormalMap,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughnessMap: earthSpecMap,
      roughness: 0.45,
      metalness: 0.15,
      emissiveMap: earthLightsMap,
      emissive: new THREE.Color(0x00f3ff), // Cyber glowing night cities
      emissiveIntensity: 0.85,
    });
    const mainMesh = new THREE.Mesh(mainGeo, mainMat);
    mainMesh.userData = { planetId: 'home' };
    mainPlanetGroup.add(mainMesh);

    // Dynamic 3D Cloud Layer Mesh (rotates independently over the surface)
    const cloudGeo = new THREE.SphereGeometry(mainRadius * 1.018, 96, 96);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: earthCloudsMap,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    mainPlanetGroup.add(cloudMesh);

    // Atmospheric Fresnel Glow Shader (refined thin crisp rim)
    const atmosphereGeo = new THREE.SphereGeometry(mainRadius * 1.045, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = dot(viewDir, vNormal);
          fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
          float glow = pow(fresnel, 3.5);
          vec3 cyanGlow = vec3(0.05, 0.82, 1.0);
          gl_FragColor = vec4(cyanGlow, glow * 0.75);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    mainPlanetGroup.add(atmosphereMesh);

    // 7. Concentric Circular Orbit Lines
    const orbitRadii = [8.8, 13.5, 18.5, 23.5, 28.5];
    const orbitGroup = new THREE.Group();
    orbitGroup.position.set(0, -6.8, 0);
    orbitGroup.rotation.x = Math.PI * 0.08;
    scene.add(orbitGroup);

    orbitRadii.forEach((radius, idx) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius * 0.96, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(128);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p.x, 0, p.y))
      );
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: idx === 1 || idx === 2 ? 0.35 : 0.18,
        blending: THREE.AdditiveBlending,
      });
      const orbitLine = new THREE.LineLoop(lineGeo, lineMat);
      orbitGroup.add(orbitLine);
    });

    // 8. Orbiting Planets Photorealistic Texture & Shader Materials
    const jupiterTex = textureLoader.load('/textures/jupitermap.jpg');
    const neptune2kTex = textureLoader.load('/textures/2k_neptune.jpg');
    const venusTex = textureLoader.load('/textures/venusmap.jpg');
    const mars2kTex = textureLoader.load('/textures/2k_mars.jpg');
    const marsBumpTex = textureLoader.load('/textures/marsbump.jpg');

    [jupiterTex, neptune2kTex, venusTex, mars2kTex, marsBumpTex].forEach((t) => {
      t.anisotropy = maxAnisotropy;
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
    });

    // Procedural Ultra-Crisp Concentric Ring Texture with Cassini Division and Micro-Ringlets
    const createConcentricRingTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      const grad = ctx.createLinearGradient(0, 0, 1024, 0);
      // Inner edge fade
      grad.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(0.03, 'rgba(192, 132, 252, 0.08)');

      // C-Ring (Crepe ring: delicate semi-transparent icy dust)
      grad.addColorStop(0.12, 'rgba(192, 132, 252, 0.32)');
      grad.addColorStop(0.32, 'rgba(168, 85, 247, 0.38)');

      // Maxwell division
      grad.addColorStop(0.35, 'rgba(25, 12, 45, 0.08)');

      // B-Ring (The brightest, densest inner ring with majestic icy luminescence)
      grad.addColorStop(0.38, 'rgba(233, 213, 255, 0.92)');
      grad.addColorStop(0.48, 'rgba(245, 208, 254, 0.98)');
      grad.addColorStop(0.56, 'rgba(216, 180, 254, 0.82)');
      grad.addColorStop(0.66, 'rgba(243, 232, 255, 0.95)');
      grad.addColorStop(0.70, 'rgba(216, 180, 254, 0.88)');

      // Cassini Division (The iconic dark gap between B and A rings)
      grad.addColorStop(0.71, 'rgba(10, 4, 25, 0.02)');
      grad.addColorStop(0.75, 'rgba(10, 4, 25, 0.02)');

      // A-Ring (Outer ring with high structural density)
      grad.addColorStop(0.76, 'rgba(216, 180, 254, 0.78)');
      grad.addColorStop(0.85, 'rgba(192, 132, 252, 0.72)');
      // Encke gap
      grad.addColorStop(0.89, 'rgba(15, 6, 32, 0.05)');
      grad.addColorStop(0.90, 'rgba(216, 180, 254, 0.70)');
      grad.addColorStop(0.95, 'rgba(168, 85, 247, 0.45)');

      // F-Ring strand & smooth cosmic fade
      grad.addColorStop(0.97, 'rgba(147, 51, 234, 0.28)');
      grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 64);

      // Micro-ringlet striations for authentic photographic telescope quality
      for (let x = 380; x < 970; x += 3) {
        if (x >= 720 && x <= 770) continue; // Keep Cassini division clean
        const alpha = (Math.sin(x * 0.48) * 0.5 + 0.5) * 0.16;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(x, 0, 1.5, 64);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.needsUpdate = true;
      return texture;
    };

    const ringTexture = createConcentricRingTexture();

    interface OrbitingPlanetItem {
      id: string;
      group: THREE.Group;
      mesh: THREE.Mesh;
      glowMesh: THREE.Mesh;
      radius: number;
      speed: number;
      angle: number;
      baseColor: string;
      size: number;
    }

    const orbitingPlanetMeshes: OrbitingPlanetItem[] = [];

    const initialAngles: Record<string, number> = {
      vmu: Math.PI * 0.95,
      knowledge: Math.PI * 0.08,
      goals: Math.PI * 0.65,
      contact: Math.PI * 1.75,
    };

    SOLAR_PLANETS.filter((p) => p.id !== 'home').forEach((planet) => {
      const pGroup = new THREE.Group();
      orbitGroup.add(pGroup);

      const geo = new THREE.SphereGeometry(planet.size, 64, 64);
      let mat: THREE.MeshStandardMaterial;

      if (planet.id === 'vmu') {
        // VMU Orbit - Photorealistic Golden Gas Giant (Jupiter Map with amber maritime glow)
        mat = new THREE.MeshStandardMaterial({
          map: jupiterTex,
          roughness: 0.5,
          metalness: 0.15,
          emissive: new THREE.Color(0x78350f),
          emissiveIntensity: 0.35,
        });
      } else if (planet.id === 'knowledge') {
        // Knowledge - Deep Violet / Cosmic Neptune with icy ring system (2K High-Res)
        mat = new THREE.MeshStandardMaterial({
          map: neptune2kTex,
          color: new THREE.Color(0xd8b4fe),
          roughness: 0.4,
          metalness: 0.2,
          emissive: new THREE.Color(0x3b0764),
          emissiveIntensity: 0.4,
        });
      } else if (planet.id === 'goals') {
        // Future Goals - Emerald / Jade Terrestrial Exoplanet with atmospheric relief
        mat = new THREE.MeshStandardMaterial({
          map: venusTex,
          color: new THREE.Color(0x10b981),
          roughness: 0.55,
          metalness: 0.15,
          emissive: new THREE.Color(0x064e3b),
          emissiveIntensity: 0.5,
        });
      } else {
        // Connection - Red Ruby / Mars (2K High-Res NASA Map with crater & canyon bump relief)
        mat = new THREE.MeshStandardMaterial({
          map: mars2kTex,
          normalMap: marsBumpTex,
          normalScale: new THREE.Vector2(1.2, 1.2),
          color: new THREE.Color(0xffffff),
          roughness: 0.62,
          metalness: 0.15,
          emissive: new THREE.Color(0x3b0a15),
          emissiveIntensity: 0.35,
        });
      }

      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = { planetId: planet.id };
      pGroup.add(mesh);

      // Tight, crisp atmospheric rim glow (not a large blurry halo)
      const glowGeo = new THREE.SphereGeometry(planet.size * 1.05, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(planet.glowColor),
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      pGroup.add(glowMesh);

      if (planet.hasRings) {
        const innerR = planet.size * 1.38;
        const outerR = planet.size * 2.45;
        // 128 theta segments, 16 radial segments with custom concentric radial UV mapping
        const ringGeo = new THREE.RingGeometry(innerR, outerR, 128, 16);
        const pos = ringGeo.attributes.position;
        const uvs = ringGeo.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const dist = Math.sqrt(x * x + y * y);
          const u = (dist - innerR) / (outerR - innerR);
          uvs.setXY(i, u, 0.5);
        }
        uvs.needsUpdate = true;

        const ringMat = new THREE.MeshStandardMaterial({
          map: ringTexture,
          side: THREE.DoubleSide,
          transparent: true,
          roughness: 0.35,
          metalness: 0.1,
          blending: THREE.NormalBlending,
          depthWrite: false,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI * 0.45;
        pGroup.add(ringMesh);
      }

      orbitingPlanetMeshes.push({
        id: planet.id,
        group: pGroup,
        mesh,
        glowMesh,
        radius: planet.orbitRadius,
        speed: planet.orbitSpeed * 0.12,
        angle: initialAngles[planet.id] || Math.random() * Math.PI * 2,
        baseColor: planet.color,
        size: planet.size,
      });
    });

    // 9. DYNAMIC SATELLITES WITH GLOWING TETHER BEAMS (Orbital Information Nodes)
    const satelliteSystemGroup = new THREE.Group();
    scene.add(satelliteSystemGroup);

    interface SatelliteNode3D {
      group: THREE.Group;
      line: THREE.Line;
      lineGeo: THREE.BufferGeometry;
      angleOffset: number;
      orbitDist: number;
      speed: number;
    }

    const satelliteNodes3D: SatelliteNode3D[] = [];

    // Shared high-detail satellite geometries & materials (Authentic space probe model)
    const satChassisGeo = new THREE.CylinderGeometry(0.2, 0.24, 0.45, 6);
    const satTopBayGeo = new THREE.CylinderGeometry(0.14, 0.2, 0.14, 6);
    const satPanelGeo = new THREE.BoxGeometry(0.8, 0.02, 0.36);
    const satTrussGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 6);
    satTrussGeo.rotateZ(Math.PI / 2);
    const satDishGeo = new THREE.ConeGeometry(0.2, 0.08, 16, 1, true);
    satDishGeo.rotateX(Math.PI / 3);
    const satEngineGeo = new THREE.ConeGeometry(0.11, 0.12, 8, 1, true);
    satEngineGeo.rotateX(Math.PI);
    const satBeaconGeo = new THREE.SphereGeometry(0.05, 8, 8);

    const satChassisMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x78350f,
      emissiveIntensity: 0.25,
    });
    const satTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.3,
    });
    const satPanelMat = new THREE.MeshStandardMaterial({
      color: 0x0c2744,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x02162b,
      emissiveIntensity: 0.45,
    });
    const satDishMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.8,
      roughness: 0.25,
    });
    const satBeaconMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
    });

    // Create 4 3D authentic space satellite probes
    for (let i = 0; i < 4; i++) {
      const sGroup = new THREE.Group();
      satelliteSystemGroup.add(sGroup);

      // 1. Central Aerospace Bus (Gold Kapton Foil Chassis)
      const chassisMesh = new THREE.Mesh(satChassisGeo, satChassisMat);
      sGroup.add(chassisMesh);

      // 2. Equipment Bay on top
      const topBayMesh = new THREE.Mesh(satTopBayGeo, satTitaniumMat);
      topBayMesh.position.set(0, 0.28, 0);
      sGroup.add(topBayMesh);

      // 3. Engine Thruster on bottom
      const engineMesh = new THREE.Mesh(satEngineGeo, satTitaniumMat);
      engineMesh.position.set(0, -0.28, 0);
      sGroup.add(engineMesh);

      // 4. Dual Photovoltaic Solar Array Wings (Left & Right)
      const leftTruss = new THREE.Mesh(satTrussGeo, satTitaniumMat);
      leftTruss.position.set(-0.25, 0, 0);
      sGroup.add(leftTruss);

      const rightTruss = new THREE.Mesh(satTrussGeo, satTitaniumMat);
      rightTruss.position.set(0.25, 0, 0);
      sGroup.add(rightTruss);

      const leftPanel = new THREE.Mesh(satPanelGeo, satPanelMat);
      leftPanel.position.set(-0.75, 0, 0);
      sGroup.add(leftPanel);

      const rightPanel = new THREE.Mesh(satPanelGeo, satPanelMat);
      rightPanel.position.set(0.75, 0, 0);
      sGroup.add(rightPanel);

      // 5. High-Gain Parabolic Communications Dish
      const dishMesh = new THREE.Mesh(satDishGeo, satDishMat);
      dishMesh.position.set(0, 0.36, 0.08);
      sGroup.add(dishMesh);

      // 6. Navigation Beacon LED & Point Light
      const beaconMesh = new THREE.Mesh(satBeaconGeo, satBeaconMat);
      beaconMesh.position.set(0, 0.38, -0.1);
      sGroup.add(beaconMesh);

      const pLight = new THREE.PointLight(0x00f3ff, 2.0, 7);
      pLight.position.set(0, 0.4, 0);
      sGroup.add(pLight);

      // 7. Glowing Tether Line connecting to planet
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x00f3ff,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      satelliteSystemGroup.add(line);

      satelliteNodes3D.push({
        group: sGroup,
        line,
        lineGeo,
        angleOffset: (Math.PI * 2 * i) / 4,
        orbitDist: 1.8,
        speed: 0.08 + i * 0.02,
      });
    }

    // 10. Mouse Interaction, Hover Raycasting & Planet Click
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleMouseMove = (e: MouseEvent) => {
      // If cursor is over HTML UI elements (dock, badges, header), do not raycast 3D planets
      if (e.target !== renderer.domElement) {
        document.body.style.cursor = 'default';
        onHoverRef.current(null);
        return;
      }

      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

      mouseVector.x = mouse.targetX;
      mouseVector.y = mouse.targetY;

      raycaster.setFromCamera(mouseVector, camera);

      // Check hover on central planet
      const mainIntersect = raycaster.intersectObject(mainMesh);
      if (mainIntersect.length > 0) {
        document.body.style.cursor = 'pointer';
        const tempV = new THREE.Vector3();
        mainMesh.getWorldPosition(tempV);
        tempV.project(camera);
        const x = (tempV.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(tempV.y * 0.5) + 0.5) * window.innerHeight;

        const homePlanet = planetsRef.current.find((p) => p.id === 'home') || planetsRef.current[0];
        onHoverRef.current({
          id: 'home',
          name: homePlanet.name,
          subtitle: homePlanet.subtitle,
          x,
          y,
        });
        return;
      }

      // Check hover on orbiting planets
      const interactiveMeshes = orbitingPlanetMeshes.map((p) => p.mesh);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        const pId = intersects[0].object.userData.planetId;
        const planetData = planetsRef.current.find((p) => p.id === pId);

        if (planetData) {
          const tempV = new THREE.Vector3();
          intersects[0].object.getWorldPosition(tempV);
          tempV.project(camera);
          const x = (tempV.x * 0.5 + 0.5) * window.innerWidth;
          const y = (-(tempV.y * 0.5) + 0.5) * window.innerHeight;

          onHoverRef.current({
            id: planetData.id,
            name: planetData.name,
            subtitle: planetData.subtitle,
            x,
            y,
          });
          return;
        }
      }

      // No hover
      document.body.style.cursor = 'default';
      onHoverRef.current(null);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Continuous gradual scroll & swipe listeners
    const handleWheel = (e: WheelEvent) => {
      // If modal is open, let user scroll modal content freely
      if (isDetailsOpenRef.current) return;

      // Taking over manual control
      isProgrammaticNavRef.current = false;
      directWarp.active = false;

      // If user is currently in overview, scrolling automatically exits overview to start interplanetary navigation
      if (isOverviewRef.current) {
        isOverviewRef.current = false;
        onExitOverviewRef.current?.();
      }

      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 25;
      if (e.deltaMode === 2) delta *= 350;

      // Continuous gradual progress:
      let progressChange = Math.max(-0.25, Math.min(0.25, delta * 0.0014));
      // If at or near contact (currentProgress >= 3.8) and scrolling down, ensure loop back to home is smooth
      if (currentProgressRef.current >= 3.8 && delta > 0) {
        progressChange = Math.max(0.18, Math.min(0.3, delta * 0.002));
      }

      // Allow timeline to reach past last planet (Contact = 4) towards 5.0 to loop back to Home (0.0)
      targetProgressRef.current = Math.max(
        0,
        Math.min(planetsRef.current.length + 0.3, targetProgressRef.current + progressChange)
      );
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (isDetailsOpenRef.current) return;
      directWarp.active = false;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDetailsOpenRef.current) return;

      isProgrammaticNavRef.current = false;
      directWarp.active = false;

      if (isOverviewRef.current) {
        isOverviewRef.current = false;
        onExitOverviewRef.current?.();
      }

      const currentY = e.touches[0].clientY;
      const diffY = touchStartY - currentY;
      touchStartY = currentY;

      let progressChange = Math.max(-0.2, Math.min(0.2, diffY * 0.0035));
      if (currentProgressRef.current >= 3.8 && diffY > 0) {
        progressChange = Math.max(0.15, Math.min(0.25, diffY * 0.004));
      }

      targetProgressRef.current = Math.max(
        0,
        Math.min(planetsRef.current.length + 0.3, targetProgressRef.current + progressChange)
      );
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const handleClick = (e: MouseEvent) => {
      // Ignore click if it didn't originate directly on the 3D canvas (prevents UI dock / navbar overlap clicks)
      if (e.target !== renderer.domElement) return;

      mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);

      // Check click on central planet ("home")
      const mainIntersect = raycaster.intersectObject(mainMesh);
      if (mainIntersect.length > 0) {
        const isAlreadyActive = activePlanetRef.current === 'home';
        if (isAlreadyActive) {
          // Already at home planet -> 2nd click opens information modal
          onSelectRef.current('home', true);
        } else {
          // Currently at another planet -> 1st click flies directly to home planet without opening modal
          isOverviewRef.current = false;
          onExitOverviewRef.current?.();
          triggerDirectWarp(0, 'home');
          onSelectRef.current('home', false);
        }
        return;
      }

      // Check click on orbiting planets
      const interactiveMeshes = orbitingPlanetMeshes.map((p) => p.mesh);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const pId = intersects[0].object.userData.planetId;
        if (pId) {
          const idx = planetsRef.current.findIndex((p) => p.id === pId);
          if (idx !== -1) {
            const isAlreadyActive = activePlanetRef.current === pId;
            if (isAlreadyActive) {
              // Already at target planet -> 2nd click opens information modal
              onSelectRef.current(pId, true);
            } else {
              // Currently at another planet -> 1st click flies directly to this planet without opening modal
              isOverviewRef.current = false;
              onExitOverviewRef.current?.();
              triggerDirectWarp(idx, pId);
              onSelectRef.current(pId, false);
            }
          }
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 11. Helper to calculate ideal camera viewpoint for any planet index
    // Ensures generous zoom-out distance so planets never overlap header or telemetry text
    const getPlanetCameraView = (index: number) => {
      const normalizedIndex = ((index % planetsRef.current.length) + planetsRef.current.length) % planetsRef.current.length;
      const planet = planetsRef.current[normalizedIndex] || planetsRef.current[0];
      const camPos = new THREE.Vector3();
      const lookTarget = new THREE.Vector3();
      const worldPos = new THREE.Vector3();

      if (planet.id === 'home') {
        mainMesh.getWorldPosition(worldPos);
        // Generous zoom-out distance Z = 31.5 so main planet sits gracefully in lower 35% of screen
        camPos.set(mouse.x * 1.2, 0.6 + mouse.y * 0.4, 31.5);
        lookTarget.set(0, -4.8, 0);
        return {
          camPos,
          lookTarget,
          worldPos,
          size: mainRadius,
          color: 0x00f3ff,
          planetId: 'home',
        };
      } else {
        const found = orbitingPlanetMeshes.find((p) => p.id === planet.id);
        if (found) {
          found.mesh.getWorldPosition(worldPos);
          const size = found.size;
          const color = new THREE.Color(found.baseColor).getHex();
          // Distance pushed back comfortably (size * 5.8 + 17.0) so planet occupies only ~20-25% screen height
          const camDist = size * 5.8 + 17.0;
          camPos.set(
            worldPos.x + mouse.x * 0.8,
            worldPos.y + 1.6 + mouse.y * 0.4,
            worldPos.z + camDist
          );
          // Look target slightly below planet center pushes the planet down into lower half of screen
          lookTarget.set(worldPos.x, worldPos.y - 1.4, worldPos.z);
          return {
            camPos,
            lookTarget,
            worldPos,
            size,
            color,
            planetId: planet.id,
          };
        }
        return {
          camPos: new THREE.Vector3(0, 0, 32),
          lookTarget: new THREE.Vector3(0, 0, 0),
          worldPos,
          size: 2.0,
          color: 0x00f3ff,
          planetId: planet.id,
        };
      }
    };

    // Camera Flight Interpolation Variables
    const currentCameraPos = new THREE.Vector3().copy(camera.position);
    const currentLookTarget = new THREE.Vector3(0, -4.8, 0);

    // Direct Warp Flight State (Deliberate, slow and buttery smooth transition)
    const directWarp = {
      active: false,
      startTime: 0,
      duration: 1400, // 1.4s for majestic cosmic flight
      startCamPos: new THREE.Vector3(),
      startLookTarget: new THREE.Vector3(),
      destIdx: 0,
      destId: 'home',
    };

    const triggerDirectWarp = (destIdx: number, destId: string) => {
      directWarp.active = true;
      directWarp.startTime = performance.now();
      directWarp.duration = 1400;
      directWarp.startCamPos.copy(camera.position);
      directWarp.startLookTarget.copy(currentLookTarget);
      directWarp.destIdx = destIdx;
      directWarp.destId = destId;
      activePlanetRef.current = destId;
      lastNotifiedPlanetId.current = destId;
      currentProgressRef.current = destIdx;
      targetProgressRef.current = destIdx;
    };

    triggerDirectWarpRef.current = triggerDirectWarp;

    // 12. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Damped mouse movement
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Rotate Main Planet & Cloud Layer independently for dynamic living atmosphere
      mainMesh.rotation.y += delta * 0.06;
      cloudMesh.rotation.y += delta * 0.085;

      // Update positions of orbiting planets
      orbitingPlanetMeshes.forEach((p) => {
        p.angle += delta * p.speed;

        const x = Math.cos(p.angle) * p.radius;
        const z = Math.sin(p.angle) * p.radius * 0.96;
        p.group.position.set(x, 0, z);

        p.mesh.rotation.y += delta * 0.2;

        const isCurrentActive = activePlanetRef.current === p.id;
        p.glowMesh.scale.setScalar(isCurrentActive ? 1.08 : 1.03);
        (p.glowMesh.material as THREE.MeshBasicMaterial).opacity = isCurrentActive ? 0.32 : 0.12;
      });

      // Wrap seamlessly from the last planet (Contact = 4) back to Home (0)
      if (currentProgressRef.current >= planetsRef.current.length) {
        currentProgressRef.current -= planetsRef.current.length;
        targetProgressRef.current = Math.max(0, targetProgressRef.current - planetsRef.current.length);
      }

      // Update continuous smooth progress
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.075;
      const progress = currentProgressRef.current;

      // Determine nearest planet (cycles 0 to 4)
      const rawNearest = Math.round(progress);
      const nearestIdx = rawNearest % planetsRef.current.length;
      const nearestPlanet = planetsRef.current[nearestIdx];

      // Handle programmatic navigation vs free scroll
      if (isProgrammaticNavRef.current) {
        // If close enough to destination, complete programmatic arrival
        if (Math.abs(currentProgressRef.current - targetProgressRef.current) < 0.04) {
          currentProgressRef.current = targetProgressRef.current;
          if (currentProgressRef.current >= planetsRef.current.length) {
            currentProgressRef.current -= planetsRef.current.length;
            targetProgressRef.current = 0;
          }
          isProgrammaticNavRef.current = false;
        }
      } else {
        // Freely scrolling: notify UI when active planet changes (cycles 0 to 4)
        if (nearestPlanet && nearestPlanet.id !== lastNotifiedPlanetId.current) {
          lastNotifiedPlanetId.current = nearestPlanet.id;
          activePlanetRef.current = nearestPlanet.id;
          onActivePlanetChangeRef.current?.(nearestPlanet.id);
        }
      }

      if (directWarp.active) {
        const elapsedWarp = performance.now() - directWarp.startTime;
        const rawT = Math.min(1, elapsedWarp / directWarp.duration);

        // Smootherstep S-curve easing (extremely gentle acceleration and deceleration)
        const ease = rawT * rawT * rawT * (rawT * (rawT * 6 - 15) + 10);

        const destView = getPlanetCameraView(directWarp.destIdx);

        // Direct interpolation between starting viewpoint and destination viewpoint
        currentCameraPos.lerpVectors(directWarp.startCamPos, destView.camPos, ease);
        currentLookTarget.lerpVectors(directWarp.startLookTarget, destView.lookTarget, ease);

        // Majestic cosmic flight arc lift (lifts gently up & out into deep space, then descends)
        const flightArc = Math.sin(rawT * Math.PI) * 3.5;
        currentCameraPos.y += flightArc * 0.35;
        currentCameraPos.z += flightArc * 0.55;

        camera.position.copy(currentCameraPos);
        camera.lookAt(currentLookTarget);

        if (rawT >= 1) {
          directWarp.active = false;
          currentProgressRef.current = directWarp.destIdx;
          targetProgressRef.current = directWarp.destIdx;
          isProgrammaticNavRef.current = false;
        }
      } else {
        // Continuous interpolation between adjacent planets (with cyclic wrap to index 0)
        const indexA = Math.floor(progress) % planetsRef.current.length;
        const indexB = (indexA + 1) % planetsRef.current.length;
        const fraction = progress - Math.floor(progress);
        // Smooth cubic curve
        const ease = fraction * fraction * (3 - 2 * fraction);

        const viewA = getPlanetCameraView(indexA);
        const viewB = getPlanetCameraView(indexB);

        const targetCameraPos = new THREE.Vector3();
        const targetLookTarget = new THREE.Vector3();

        if (isOverviewRef.current) {
          targetCameraPos.set(mouse.x * 1.5, 4.0 + mouse.y * 0.8, 40.0);
          targetLookTarget.set(0, -4.5, 0);
        } else {
          targetCameraPos.lerpVectors(viewA.camPos, viewB.camPos, ease);
          targetLookTarget.lerpVectors(viewA.lookTarget, viewB.lookTarget, ease);

          // Cosmic flight arc lift between planets
          const arcLift = Math.sin(fraction * Math.PI) * 2.8;
          targetCameraPos.y += arcLift * 0.35;
          targetCameraPos.z += arcLift * 0.55;
        }

        // Smooth camera interpolation
        currentCameraPos.lerp(targetCameraPos, 0.07);
        currentLookTarget.lerp(targetLookTarget, 0.07);

        camera.position.copy(currentCameraPos);
        camera.lookAt(currentLookTarget);
      }

      // 14. Update Orbiting Satellites Around the Focused Planet
      const activePlanetData = planetsRef.current[nearestIdx] || planetsRef.current[0];
      const nearestView = getPlanetCameraView(nearestIdx);
      const activeWorldPos = nearestView.worldPos;
      const activeSize = nearestView.size;
      const activeColor = nearestView.color;

      const satDist = activeSize * 2.2 + 2.2;

      const screenPositions: SatelliteScreenPosition[] = [];

      satelliteNodes3D.forEach((sat, sIdx) => {
        const angle = sat.angleOffset + elapsed * sat.speed;
        const satX = activeWorldPos.x + Math.cos(angle) * satDist;
        const satY = activeWorldPos.y + Math.sin(angle * 1.2) * (activeSize * 0.35);
        const satZ = activeWorldPos.z + Math.sin(angle) * satDist;

        sat.group.position.set(satX, satY, satZ);
        sat.group.rotation.y = elapsed * 0.25;
        sat.group.rotation.x = Math.sin(elapsed * 0.4 + sIdx) * 0.12;

        // Elegant scaling in overview mode:
        // Keeps satellites sleek and proportional whether close up or viewing entire solar system
        const isOverview = isOverviewRef.current;
        const targetScale = isOverview ? 0.65 : 1.0;
        sat.group.scale.setScalar(targetScale);

        // Update connecting beam line to planet
        const positions = sat.lineGeo.attributes.position.array as Float32Array;
        positions[0] = activeWorldPos.x;
        positions[1] = activeWorldPos.y;
        positions[2] = activeWorldPos.z;
        positions[3] = satX;
        positions[4] = satY;
        positions[5] = satZ;
        sat.lineGeo.attributes.position.needsUpdate = true;

        const satLineMat = sat.line.material as THREE.LineBasicMaterial;
        satLineMat.color.setHex(activeColor);
        satLineMat.opacity = isOverview ? 0.2 : 0.45;

        // Project 3D satellite position to 2D viewport coordinates
        const tempV = new THREE.Vector3(satX, satY, satZ);
        tempV.project(camera);

        // Only include if in front of camera
        if (tempV.z < 1) {
          const sx = (tempV.x * 0.5 + 0.5) * window.innerWidth;
          const sy = (-(tempV.y * 0.5) + 0.5) * window.innerHeight;

          if (activePlanetData.satellites && activePlanetData.satellites[sIdx]) {
            screenPositions.push({
              id: activePlanetData.satellites[sIdx].id,
              x: sx,
              y: sy,
              satellite: activePlanetData.satellites[sIdx],
            });
          }
        }
      });

      onUpdateSatellitesRef.current(screenPositions);

      // Multi-layer celestial parallax rotation
      starField.rotation.y = elapsed * 0.0018;
      dustField.rotation.y = elapsed * 0.0013;
      mwField.rotation.y = elapsed * 0.0016;
      heroStars.rotation.y = elapsed * 0.0018;
      nebulaGroup.rotation.y = elapsed * 0.0007;

      // Pulsar beacon breathing effect
      heroMat.size = 15.0 + Math.sin(elapsed * 2.6) * 3.5;

      // Shooting Stars / Meteors dynamic execution
      const now = performance.now();
      if (now > nextMeteorTime) {
        triggerMeteor();
        nextMeteorTime = now + THREE.MathUtils.randFloat(3500, 7500);
      }

      for (let i = 0; i < meteorPool.length; i++) {
        const m = meteorPool[i];
        if (!m.active) continue;
        m.progress += m.speed;
        if (m.progress >= 1.0) {
          m.active = false;
          m.line.visible = false;
        } else {
          // Compute head and trailing tail coordinates
          const head = m.start.clone().lerp(m.end, m.progress);
          const dir = m.end.clone().sub(m.start).normalize();
          const tail = head.clone().sub(dir.multiplyScalar(m.trailLength));

          const posAttr = m.geo.attributes.position as THREE.BufferAttribute;
          posAttr.setXYZ(0, head.x, head.y, head.z);
          posAttr.setXYZ(1, tail.x, tail.y, tail.z);
          posAttr.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 15. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      renderer.domElement.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      triggerDirectWarpRef.current = null;

      particleTexture.dispose();
      nebulaTexture.dispose();
      flareTexture.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      mwGeo.dispose();
      mwMat.dispose();
      heroGeo.dispose();
      heroMat.dispose();
      nebulaMaterials.forEach((m) => m.dispose());
      meteorMat.dispose();
      meteorPool.forEach((m) => m.geo.dispose());
      satChassisGeo.dispose();
      satTopBayGeo.dispose();
      satPanelGeo.dispose();
      satTrussGeo.dispose();
      satDishGeo.dispose();
      satEngineGeo.dispose();
      satBeaconGeo.dispose();
      satChassisMat.dispose();
      satTitaniumMat.dispose();
      satPanelMat.dispose();
      satDishMat.dispose();
      satBeaconMat.dispose();
      satelliteNodes3D.forEach((s) => {
        s.lineGeo.dispose();
        (s.line.material as THREE.Material).dispose();
      });
      earthDayMap.dispose();
      earthNormalMap.dispose();
      earthSpecMap.dispose();
      earthCloudsMap.dispose();
      earthLightsMap.dispose();
      jupiterTex.dispose();
      neptune2kTex.dispose();
      venusTex.dispose();
      mars2kTex.dispose();
      marsBumpTex.dispose();
      ringTexture.dispose();
      mainGeo.dispose();
      mainMat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 60%, #071933 0%, #030c1f 48%, #01040a 100%)',
      }}
      title="Bấm vào bất kỳ hành tinh nào để phóng góc nhìn đến hành tinh đó"
      aria-label="Không gian 3D tương tác hệ hành tinh"
    />
  );
};
