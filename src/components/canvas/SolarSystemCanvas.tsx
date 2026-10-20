import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SOLAR_PLANETS } from '../../data/solarSystemData';
import type { PlanetSatellite } from '../../data/solarSystemData';

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

interface SolarSystemCanvasProps {
  activePlanetId: string;
  isOverview: boolean;
  onSelectPlanet: (planetId: string) => void;
  onHoverPlanet: (info: HoverInfo | null) => void;
  onUpdateSatellitePositions: (positions: SatelliteScreenPosition[]) => void;
}

export const SolarSystemCanvas: React.FC<SolarSystemCanvasProps> = ({
  activePlanetId,
  isOverview,
  onSelectPlanet,
  onHoverPlanet,
  onUpdateSatellitePositions,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activePlanetRef = useRef<string>(activePlanetId);
  activePlanetRef.current = activePlanetId;

  const isOverviewRef = useRef<boolean>(isOverview);
  isOverviewRef.current = isOverview;

  const onSelectRef = useRef(onSelectPlanet);
  onSelectRef.current = onSelectPlanet;

  const onHoverRef = useRef(onHoverPlanet);
  onHoverRef.current = onHoverPlanet;

  const onUpdateSatellitesRef = useRef(onUpdateSatellitePositions);
  onUpdateSatellitesRef.current = onUpdateSatellitePositions;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020612, 0.0008);

    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      2500
    );
    // Initial overview position
    camera.position.set(0, 4.5, 26);

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

    // 2. High-Res Particle Texture
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(56, 189, 248, 0.95)');
      grad.addColorStop(0.5, 'rgba(14, 116, 144, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const particleTexture = createParticleTexture();

    // 3. Cinematic Star Lighting
    const ambientLight = new THREE.AmbientLight(0x0d1e34, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x93c5fd, 3.8);
    sunLight.position.set(28, 20, 24);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x0284c7, 1.6);
    rimLight.position.set(-25, -12, -12);
    scene.add(rimLight);

    // 4. Background Starfields & Cosmic Dust
    const starCount = isMobile ? 900 : 2000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = THREE.MathUtils.randFloat(260, 800);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));

      starPos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPos[i3 + 2] = radius * Math.cos(phi);

      const lum = THREE.MathUtils.randFloat(0.65, 1.3);
      starColors[i3] = 0.55 * lum;
      starColors[i3 + 1] = 0.85 * lum;
      starColors[i3 + 2] = 1.0 * lum;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.8,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 5. High-Resolution (2048x1024) Procedural Textures with Sharp Details
    const createHighResPlanetTexture = (type: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      if (type === 'earth') {
        // Deep Obsidian Ocean
        ctx.fillStyle = '#021838';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Continental Shelf & Coastlines (Cyan Turquoise gradient)
        ctx.fillStyle = '#08486e';
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const r = Math.random() * 220 + 50;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Inner Landmasses (Deep navy & emerald earth)
        ctx.fillStyle = '#0c3559';
        for (let i = 0; i < 60; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const r = Math.random() * 150 + 30;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Craggy mountain ridges & detailed fractal lines
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 3;
        for (let i = 0; i < 30; i++) {
          ctx.beginPath();
          let cx = Math.random() * canvas.width;
          let cy = Math.random() * canvas.height;
          ctx.moveTo(cx, cy);
          for (let j = 0; j < 8; j++) {
            cx += (Math.random() - 0.5) * 120;
            cy += (Math.random() - 0.5) * 80;
            ctx.lineTo(cx, cy);
          }
          ctx.stroke();
        }

        // High-altitude Swirling White Clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        for (let i = 0; i < 70; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const w = Math.random() * 420 + 80;
          const h = Math.random() * 65 + 15;
          ctx.beginPath();
          ctx.ellipse(x, y, w, h, (Math.random() - 0.5) * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Luminous Night City Lights / Cyber Grid on Dark Hemisphere
        ctx.fillStyle = 'rgba(0, 243, 255, 0.9)';
        for (let i = 0; i < 400; i++) {
          const x = Math.random() * (canvas.width * 0.52);
          const y = Math.random() * canvas.height;
          const s = Math.random() * 2 + 1;
          ctx.fillRect(x, y, s, s);
        }
      } else if (type === 'gold') {
        // High-detail Golden Gas Giant with fine atmospheric bands
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < canvas.height; y += 8) {
          const hue = y % 32 < 16 ? '#f59e0b' : '#d97706';
          ctx.fillStyle = hue;
          ctx.fillRect(0, y, canvas.width, 7);
        }

        // Amber Storm Swirls
        ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
        for (let i = 0; i < 45; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          ctx.beginPath();
          ctx.ellipse(x, y, 70, 30, (Math.random() - 0.5) * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === 'violet') {
        // High-detail Ultraviolet striped planet
        ctx.fillStyle = '#2e1065';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < canvas.height; y += 10) {
          ctx.fillStyle = y % 40 < 20 ? '#7e22ce' : '#581c87';
          ctx.fillRect(0, y, canvas.width, 8);
        }

        ctx.fillStyle = 'rgba(216, 180, 254, 0.4)';
        for (let i = 0; i < 50; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 45, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === 'emerald') {
        // Rich Mint & Jade Planet
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < canvas.height; y += 10) {
          ctx.fillStyle = y % 30 < 15 ? '#059669' : '#047857';
          ctx.fillRect(0, y, canvas.width, 9);
        }
      } else {
        // Coral / Crimson Ruby Bands
        ctx.fillStyle = '#881337';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < canvas.height; y += 10) {
          ctx.fillStyle = y % 30 < 15 ? '#e11d48' : '#be123c';
          ctx.fillRect(0, y, canvas.width, 9);
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.anisotropy = maxAnisotropy;
      texture.needsUpdate = true;
      return texture;
    };

    // 6. Centerpiece Main Planet: "PHAM AN" (Orionis Style)
    const mainPlanetGroup = new THREE.Group();
    mainPlanetGroup.position.set(0, -3.2, 0);
    scene.add(mainPlanetGroup);

    const mainRadius = 6.4;
    const mainGeo = new THREE.SphereGeometry(mainRadius, 128, 128); // 128x128 for ultra crisp sphere
    const mainTex = createHighResPlanetTexture('earth');
    const mainMat = new THREE.MeshStandardMaterial({
      map: mainTex,
      roughness: 0.55,
      metalness: 0.25,
      emissive: new THREE.Color(0x02162e),
      emissiveIntensity: 0.75,
    });
    const mainMesh = new THREE.Mesh(mainGeo, mainMat);
    mainMesh.userData = { planetId: 'home' };
    mainPlanetGroup.add(mainMesh);

    // Atmospheric Fresnel Glow Shader
    const atmosphereGeo = new THREE.SphereGeometry(mainRadius * 1.12, 64, 64);
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
          float glow = pow(fresnel, 2.5);
          vec3 cyanGlow = vec3(0.05, 0.82, 1.0);
          gl_FragColor = vec4(cyanGlow, glow * 0.9);
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
    orbitGroup.position.set(0, -3.2, 0);
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

    // 8. Orbiting Planets
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
      const tex = createHighResPlanetTexture(planet.textureType);
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.5,
        metalness: 0.3,
        emissive: new THREE.Color(planet.color),
        emissiveIntensity: 0.45,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = { planetId: planet.id };
      pGroup.add(mesh);

      const glowGeo = new THREE.SphereGeometry(planet.size * 1.25, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(planet.glowColor),
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      pGroup.add(glowMesh);

      if (planet.hasRings) {
        const ringGeo = new THREE.RingGeometry(planet.size * 1.4, planet.size * 2.1, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xc084fc,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.4,
          blending: THREE.AdditiveBlending,
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

    // Create 4 3D satellite probes
    for (let i = 0; i < 4; i++) {
      const sGroup = new THREE.Group();
      satelliteSystemGroup.add(sGroup);

      // Probe Body (Octahedron crystal probe)
      const pGeo = new THREE.OctahedronGeometry(0.35, 0);
      const pMat = new THREE.MeshStandardMaterial({
        color: 0x00f3ff,
        emissive: 0x00f3ff,
        emissiveIntensity: 0.9,
        metalness: 0.9,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      sGroup.add(pMesh);

      // Solar Wings
      const wingGeo = new THREE.BoxGeometry(1.4, 0.04, 0.35);
      const wingMat = new THREE.MeshStandardMaterial({ color: 0x032b45, metalness: 0.8 });
      const wingMesh = new THREE.Mesh(wingGeo, wingMat);
      sGroup.add(wingMesh);

      // Point Light
      const pLight = new THREE.PointLight(0x00f3ff, 2.5, 8);
      sGroup.add(pLight);

      // Glowing Tether Line connecting to planet
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
        speed: 0.6 + i * 0.1,
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

        onHoverRef.current({
          id: 'home',
          name: 'Phạm An (FamAnVMU)',
          subtitle: 'Hành tinh Trung tâm // Sinh viên năm 3 CNTT ĐH Hàng Hải',
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
        const planetData = SOLAR_PLANETS.find((p) => p.id === pId);

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

    const handleClick = () => {
      raycaster.setFromCamera(mouseVector, camera);

      const mainIntersect = raycaster.intersectObject(mainMesh);
      if (mainIntersect.length > 0) {
        onSelectRef.current('home');
        return;
      }

      const interactiveMeshes = orbitingPlanetMeshes.map((p) => p.mesh);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const pId = intersects[0].object.userData.planetId;
        if (pId) {
          onSelectRef.current(pId);
        }
      }
    };

    window.addEventListener('click', handleClick);

    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 11. Camera Flight Interpolation Variables
    const currentCameraPos = new THREE.Vector3().copy(camera.position);
    const currentLookTarget = new THREE.Vector3(0, -1.8, 0);

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

      // Rotate Main Planet slowly
      mainMesh.rotation.y += delta * 0.08;

      // Update positions of orbiting planets
      orbitingPlanetMeshes.forEach((p) => {
        p.angle += delta * p.speed;

        const x = Math.cos(p.angle) * p.radius;
        const z = Math.sin(p.angle) * p.radius * 0.96;
        p.group.position.set(x, 0, z);

        p.mesh.rotation.y += delta * 0.2;

        const isCurrentActive = activePlanetRef.current === p.id;
        p.glowMesh.scale.setScalar(isCurrentActive ? 1.6 : 1.25);
        (p.glowMesh.material as THREE.MeshBasicMaterial).opacity = isCurrentActive ? 0.6 : 0.25;
      });

      // 13. Determine Active Planet World Position for Camera Flight
      const activeId = activePlanetRef.current;
      const targetCameraPos = new THREE.Vector3();
      const targetLookTarget = new THREE.Vector3();

      let activeWorldPos = new THREE.Vector3();
      let activeSize = mainRadius;
      let activeColor = 0x00f3ff;

      if (isOverviewRef.current) {
        // Return to Full Solar System Overview vista (matching screenshot)
        targetCameraPos.set(mouse.x * 1.5, 4.5 + mouse.y * 1.0, 26);
        targetLookTarget.set(0, -1.8, 0);
      } else if (activeId === 'home') {
        mainMesh.getWorldPosition(activeWorldPos);
        targetLookTarget.copy(activeWorldPos);
        // Move camera closer so central planet is majestic & detailed
        targetCameraPos.set(mouse.x * 1.0, activeWorldPos.y + 1.2 + mouse.y * 0.6, 15.5);
      } else {
        const found = orbitingPlanetMeshes.find((p) => p.id === activeId);
        if (found) {
          found.mesh.getWorldPosition(activeWorldPos);
          activeSize = found.size;
          activeColor = new THREE.Color(found.baseColor).getHex();

          targetLookTarget.copy(activeWorldPos);
          // Fly directly down close to that orbiting planet
          targetCameraPos.set(
            activeWorldPos.x + mouse.x * 0.6,
            activeWorldPos.y + activeSize * 0.8 + mouse.y * 0.4,
            activeWorldPos.z + activeSize * 3.4
          );
        }
      }

      // Smooth camera glide interpolation (lerp)
      currentCameraPos.lerp(targetCameraPos, 0.045);
      currentLookTarget.lerp(targetLookTarget, 0.045);

      camera.position.copy(currentCameraPos);
      camera.lookAt(currentLookTarget);

      // 14. Update Orbiting Satellites Around the Focused Planet
      const activePlanetData = SOLAR_PLANETS.find((p) => p.id === activeId) || SOLAR_PLANETS[0];
      const satDist = activeSize * 1.6 + 1.2;

      const screenPositions: SatelliteScreenPosition[] = [];

      satelliteNodes3D.forEach((sat, sIdx) => {
        const angle = sat.angleOffset + elapsed * sat.speed;
        const satX = activeWorldPos.x + Math.cos(angle) * satDist;
        const satY = activeWorldPos.y + Math.sin(angle * 1.2) * (activeSize * 0.4);
        const satZ = activeWorldPos.z + Math.sin(angle) * satDist;

        sat.group.position.set(satX, satY, satZ);
        sat.group.rotation.y = elapsed * 0.8;

        // Update connecting beam line to planet
        const positions = sat.lineGeo.attributes.position.array as Float32Array;
        positions[0] = activeWorldPos.x;
        positions[1] = activeWorldPos.y;
        positions[2] = activeWorldPos.z;
        positions[3] = satX;
        positions[4] = satY;
        positions[5] = satZ;
        sat.lineGeo.attributes.position.needsUpdate = true;

        (sat.line.material as THREE.LineBasicMaterial).color.setHex(activeColor);

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

      // Subtle starfield rotation
      starField.rotation.y = elapsed * 0.002;

      renderer.render(scene, camera);
    };

    animate();

    // 15. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);

      particleTexture.dispose();
      mainTex.dispose();
      mainGeo.dispose();
      mainMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      starGeo.dispose();
      starMat.dispose();

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
        background: 'radial-gradient(ellipse at 50% 65%, #071e3d 0%, #030d22 45%, #020612 100%)',
      }}
      title="Bấm vào bất kỳ hành tinh nào để phóng góc nhìn đến hành tinh đó"
      aria-label="Không gian 3D tương tác hệ hành tinh"
    />
  );
};
