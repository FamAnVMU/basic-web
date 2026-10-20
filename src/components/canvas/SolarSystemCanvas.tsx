import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SOLAR_PLANETS } from '../../data/solarSystemData';
import type { PlanetData } from '../../data/solarSystemData';

interface SolarSystemCanvasProps {
  activePlanetId: string;
  onSelectPlanet: (planetId: string) => void;
}

export const SolarSystemCanvas: React.FC<SolarSystemCanvasProps> = ({
  activePlanetId,
  onSelectPlanet,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activePlanetRef = useRef<string>(activePlanetId);
  activePlanetRef.current = activePlanetId;

  const onSelectRef = useRef(onSelectPlanet);
  onSelectRef.current = onSelectPlanet;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // 1. Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020612, 0.0009);

    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    // Positioned to give the exact vista shown in the reference image
    camera.position.set(0, 4.5, 26);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: !isMobile,
      alpha: false,
    });
    renderer.setClearColor(0x020612, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // 2. Lighting (Cinematic Sun from Upper-Right)
    const ambientLight = new THREE.AmbientLight(0x0d1b2a, 1.1);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x7dd3fc, 3.4);
    sunLight.position.set(24, 18, 22);
    scene.add(sunLight);

    // Subtle blue rim light from bottom-left
    const rimLight = new THREE.DirectionalLight(0x0284c7, 1.4);
    rimLight.position.set(-20, -10, -10);
    scene.add(rimLight);

    // 3. Circular Soft-Glow Particle Texture for Stars & Dust
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(56, 189, 248, 0.9)');
      grad.addColorStop(0.5, 'rgba(14, 116, 144, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const particleTexture = createParticleTexture();

    // 4. Background Starfields
    const starCount = isMobile ? 800 : 1800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = THREE.MathUtils.randFloat(250, 750);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));

      starPos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPos[i3 + 2] = radius * Math.cos(phi);

      const lum = THREE.MathUtils.randFloat(0.6, 1.2);
      starColors[i3] = 0.6 * lum;
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
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 5. Procedural Planet Texture Generator
    const createPlanetCanvasTexture = (type: PlanetData['textureType']) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      if (type === 'earth') {
        // Deep vibrant blue oceans with swirling clouds & continents (like ORIONIS in reference image)
        ctx.fillStyle = '#03193a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Landmasses / continents
        ctx.fillStyle = '#063462';
        for (let i = 0; i < 35; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const r = Math.random() * 120 + 30;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Swirling Clouds (bright white & cyan)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        for (let i = 0; i < 40; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const w = Math.random() * 260 + 50;
          const h = Math.random() * 40 + 10;
          ctx.beginPath();
          ctx.ellipse(x, y, w, h, Math.PI * 0.05, 0, Math.PI * 2);
          ctx.fill();
        }

        // Cyber / Electrical city lights on night side
        ctx.fillStyle = 'rgba(0, 243, 255, 0.8)';
        for (let i = 0; i < 150; i++) {
          const x = Math.random() * (canvas.width * 0.5);
          const y = Math.random() * canvas.height;
          ctx.fillRect(x, y, 2, 2);
        }
      } else if (type === 'gold') {
        // Golden / Amber gas giant (like ETHERON in reference image)
        ctx.fillStyle = '#b45309';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Bands of gold, copper, amber
        for (let y = 0; y < canvas.height; y += 12) {
          ctx.fillStyle = y % 24 === 0 ? '#f59e0b' : '#d97706';
          ctx.fillRect(0, y, canvas.width, 10);
        }
        // Swirls
        ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
        for (let i = 0; i < 20; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 40, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === 'violet') {
        // Deep purple / ultraviolet orb (like THERONIX in reference image)
        ctx.fillStyle = '#3b0764';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < canvas.height; y += 15) {
          ctx.fillStyle = y % 30 === 0 ? '#7e22ce' : '#581c87';
          ctx.fillRect(0, y, canvas.width, 12);
        }
        ctx.fillStyle = 'rgba(192, 132, 252, 0.35)';
        for (let i = 0; i < 25; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 35, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === 'emerald') {
        // Emerald / Mint planet
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < canvas.height; y += 16) {
          ctx.fillStyle = y % 32 === 0 ? '#059669' : '#047857';
          ctx.fillRect(0, y, canvas.width, 14);
        }
      } else {
        // Coral / Pink
        ctx.fillStyle = '#881337';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < canvas.height; y += 14) {
          ctx.fillStyle = y % 28 === 0 ? '#e11d48' : '#be123c';
          ctx.fillRect(0, y, canvas.width, 12);
        }
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      return tex;
    };

    // 6. Centerpiece Main Planet: "PHAM AN" (Orionis Style)
    const mainPlanetGroup = new THREE.Group();
    // Offset slightly downwards to match the screenshot composition where planet fills lower center
    mainPlanetGroup.position.set(0, -3.2, 0);
    scene.add(mainPlanetGroup);

    const mainRadius = 6.4;
    const mainGeo = new THREE.SphereGeometry(mainRadius, 64, 64);
    const mainTex = createPlanetCanvasTexture('earth');
    const mainMat = new THREE.MeshStandardMaterial({
      map: mainTex,
      roughness: 0.6,
      metalness: 0.25,
      emissive: new THREE.Color(0x02162e),
      emissiveIntensity: 0.7,
    });
    const mainMesh = new THREE.Mesh(mainGeo, mainMat);
    mainPlanetGroup.add(mainMesh);

    // Glowing Atmosphere Fresnel Halo (Custom Shader)
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
          float glow = pow(fresnel, 2.4);
          vec3 cyanGlow = vec3(0.05, 0.75, 1.0);
          gl_FragColor = vec4(cyanGlow, glow * 0.85);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    mainPlanetGroup.add(atmosphereMesh);

    // Subtle atmospheric dust motes around central planet
    const auraCount = isMobile ? 120 : 280;
    const auraGeo = new THREE.BufferGeometry();
    const auraPos = new Float32Array(auraCount * 3);
    for (let i = 0; i < auraCount; i++) {
      const i3 = i * 3;
      const d = THREE.MathUtils.randFloat(mainRadius * 1.05, mainRadius * 1.25);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      auraPos[i3] = d * Math.sin(phi) * Math.cos(theta);
      auraPos[i3 + 1] = d * Math.sin(phi) * Math.sin(theta);
      auraPos[i3 + 2] = d * Math.cos(phi);
    }
    auraGeo.setAttribute('position', new THREE.BufferAttribute(auraPos, 3));
    const auraMat = new THREE.PointsMaterial({
      size: 2.5,
      map: particleTexture,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const auraPoints = new THREE.Points(auraGeo, auraMat);
    mainPlanetGroup.add(auraPoints);

    // 7. Concentric Circular Orbit Lines (Exact match to reference image)
    const orbitRadii = [8.8, 11.8, 14.8, 18.2, 22.0, 26.5];
    const orbitGroup = new THREE.Group();
    // Tilt slightly forward to look like the concentric perspective orbits in the image
    orbitGroup.position.set(0, -3.2, 0);
    orbitGroup.rotation.x = Math.PI * 0.08;
    scene.add(orbitGroup);

    orbitRadii.forEach((radius, idx) => {
      const curve = new THREE.EllipseCurve(
        0,
        0,
        radius,
        radius * 0.96, // Slight elliptical eccentricity for perspective
        0,
        2 * Math.PI,
        false,
        0
      );
      const points = curve.getPoints(128);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p.x, 0, p.y))
      );

      const lineMat = new THREE.LineBasicMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: idx === 1 || idx === 3 ? 0.35 : 0.18,
        blending: THREE.AdditiveBlending,
      });

      const orbitLine = new THREE.LineLoop(lineGeo, lineMat);
      orbitGroup.add(orbitLine);
    });

    // 8. Orbiting Planets & Interactive Mesh Setup
    const orbitingPlanetMeshes: {
      id: string;
      group: THREE.Group;
      mesh: THREE.Mesh;
      glowMesh: THREE.Mesh;
      radius: number;
      speed: number;
      angle: number;
      baseColor: string;
    }[] = [];

    // Pre-assigned distinct orbital angles to match the screenshot composition
    // - Gold planet (VMU) on Left (like Etheron)
    // - Violet planet (Knowledge) on Right (like Theronix)
    // - Emerald planet (Goals) on lower-left
    // - Coral planet (Contact) on upper-right
    const initialAngles: Record<string, number> = {
      vmu: Math.PI * 0.95, // Left
      knowledge: Math.PI * 0.08, // Right
      goals: Math.PI * 0.65, // Lower Left
      contact: Math.PI * 1.75, // Upper Right
    };

    SOLAR_PLANETS.filter((p) => p.id !== 'home').forEach((planet) => {
      const pGroup = new THREE.Group();
      orbitGroup.add(pGroup);

      const geo = new THREE.SphereGeometry(planet.size, 32, 32);
      const tex = createPlanetCanvasTexture(planet.textureType);
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.5,
        metalness: 0.3,
        emissive: new THREE.Color(planet.color),
        emissiveIntensity: 0.4,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = { planetId: planet.id };
      pGroup.add(mesh);

      // Subtle atmospheric halo around orbiting planet
      const glowGeo = new THREE.SphereGeometry(planet.size * 1.25, 24, 24);
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(planet.glowColor),
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      pGroup.add(glowMesh);

      // Planetary rings for violet planet (like Saturn/Theronix)
      if (planet.hasRings) {
        const ringGeo = new THREE.RingGeometry(planet.size * 1.4, planet.size * 2.1, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xc084fc,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.35,
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
      });
    });

    // 9. Decorative Minor Celestial Orbs (matching small purple, orange, green moons in screenshot)
    const decorativeMoons = [
      { radius: 10.2, angle: Math.PI * 0.4, size: 0.5, color: 0xa855f7 }, // Purple moon near top
      { radius: 13.0, angle: Math.PI * 1.85, size: 0.4, color: 0xef4444 }, // Small red orb
      { radius: 16.5, angle: Math.PI * 1.95, size: 0.6, color: 0xf97316 }, // Orange orb
      { radius: 11.2, angle: Math.PI * 0.72, size: 0.45, color: 0x10b981 }, // Green orb
    ];

    decorativeMoons.forEach((m) => {
      const mGeo = new THREE.SphereGeometry(m.size, 16, 16);
      const mMat = new THREE.MeshStandardMaterial({
        color: m.color,
        emissive: m.color,
        emissiveIntensity: 0.6,
      });
      const mMesh = new THREE.Mesh(mGeo, mMat);
      mMesh.position.set(Math.cos(m.angle) * m.radius, 0, Math.sin(m.angle) * m.radius * 0.96);
      orbitGroup.add(mMesh);
    });

    // 10. Mouse Interaction & Parallax
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Raycasting for planet clicks
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);

      // Check main central planet
      const mainIntersect = raycaster.intersectObject(mainMesh);
      if (mainIntersect.length > 0) {
        onSelectRef.current('home');
        return;
      }

      // Check orbiting planets
      const interactiveMeshes = orbitingPlanetMeshes.map((p) => p.mesh);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const clickedPlanetId = intersects[0].object.userData.planetId;
        if (clickedPlanetId) {
          onSelectRef.current(clickedPlanetId);
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

    // 11. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Parallax effect on camera
      camera.position.x = mouse.x * 1.2;
      camera.position.y = 4.5 + mouse.y * 0.8;
      camera.lookAt(0, -1.8, 0);

      // Rotate Main Planet slowly
      mainMesh.rotation.y += delta * 0.07;
      auraPoints.rotation.y += delta * 0.12;

      // Update positions of orbiting planets along their tracks
      orbitingPlanetMeshes.forEach((p) => {
        // Slow continuous orbit
        p.angle += delta * p.speed;

        const x = Math.cos(p.angle) * p.radius;
        const z = Math.sin(p.angle) * p.radius * 0.96;
        p.group.position.set(x, 0, z);

        p.mesh.rotation.y += delta * 0.2;

        // Highlight if active
        const isActive = activePlanetRef.current === p.id;
        p.glowMesh.scale.setScalar(isActive ? 1.6 : 1.25);
        (p.glowMesh.material as THREE.MeshBasicMaterial).opacity = isActive ? 0.55 : 0.22;
      });

      // Subtle Starfield rotation
      starField.rotation.y = elapsed * 0.003;

      renderer.render(scene, camera);
    };

    animate();

    // 12. Cleanup
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
      auraGeo.dispose();
      auraMat.dispose();
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
      className="fixed inset-0 z-0 overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 65%, #071e3d 0%, #030d22 45%, #020612 100%)',
      }}
      title="Bấm vào các hành tinh để xem thông tin chi tiết"
      aria-label="Không gian hệ hành tinh tương tác"
    />
  );
};
