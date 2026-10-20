import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SpaceCanvasProps {
  scrollProgress: number; // 0 to 1
  currentSectionIndex: number;
}

export const SpaceCanvas: React.FC<SpaceCanvasProps> = ({ scrollProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number>(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect mobile and reduced motion preferences
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera & Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02040a, 0.0008);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      2500
    );
    camera.position.set(0, 2, 28);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: !isMobile,
      alpha: false,
    });
    renderer.setClearColor(0x02040a, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // 2. Lighting (Cinematic Space Lighting)
    const ambientLight = new THREE.AmbientLight(0x071524, 0.9);
    scene.add(ambientLight);

    // Key Light (Cyan / Star sun)
    const sunLight = new THREE.DirectionalLight(0x40e0d0, 2.8);
    sunLight.position.set(20, 15, 25);
    scene.add(sunLight);

    // Subtle Cyan Rim Fill Light
    const rimLight = new THREE.DirectionalLight(0x00f3ff, 1.2);
    rimLight.position.set(-25, -10, -15);
    scene.add(rimLight);

    // 3. Multi-Layer Starfields & Cosmic Dust
    const createStarField = (count: number, size: number, color: number, spread: number) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const c = new THREE.Color(color);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // Spherical distribution
        const radius = THREE.MathUtils.randFloat(spread * 0.3, spread);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Subtle color variance
        const lum = THREE.MathUtils.randFloat(0.7, 1.2);
        colors[i3] = c.r * lum;
        colors[i3 + 1] = c.g * lum;
        colors[i3 + 2] = c.b * lum;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      return new THREE.Points(geometry, material);
    };

    const starCountFactor = isMobile ? 0.4 : 1;
    const deepStars = createStarField(Math.floor(2500 * starCountFactor), 1.2, 0x88ccff, 900);
    const midStars = createStarField(Math.floor(1200 * starCountFactor), 2.2, 0x00f3ff, 600);
    const closeStars = createStarField(Math.floor(350 * starCountFactor), 3.5, 0xffffff, 350);

    scene.add(deepStars);
    scene.add(midStars);
    scene.add(closeStars);

    // Cosmic Dust in Foreground
    const dustCount = Math.floor(250 * starCountFactor);
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 80;
      dustPos[i + 1] = (Math.random() - 0.5) * 80;
      dustPos[i + 2] = (Math.random() - 0.5) * 60;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 1.8,
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const cosmicDust = new THREE.Points(dustGeo, dustMat);
    scene.add(cosmicDust);

    // 4. Centerpiece 3D Planet & Atmosphere
    // Procedural Planet Texture
    const createPlanetTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      // Deep Space Base
      ctx.fillStyle = '#030b18';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Continent & Ocean patterns
      for (let i = 0; i < 45; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 140 + 30;
        const grad = ctx.createRadialGradient(x, y, 5, x, y, radius);
        grad.addColorStop(0, '#0e3a53');
        grad.addColorStop(0.5, '#062035');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Tech Grid & Cybernetic Glowing Veins (Night Lights)
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.6;
      for (let y = 30; y < canvas.height; y += 45) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < canvas.width; x += 30) {
          ctx.lineTo(x, y + Math.sin(x * 0.05 + y) * 4);
        }
        ctx.stroke();
      }

      // Bright Tech Nodes
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 120; i++) {
        const nx = Math.random() * canvas.width;
        const ny = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.arc(nx, ny, Math.random() * 2 + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return texture;
    };

    const planetTexture = createPlanetTexture();

    // Planet Core Mesh
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    const planetRadius = 8.2;
    const planetGeo = new THREE.SphereGeometry(planetRadius, 64, 64);
    const planetMat = new THREE.MeshStandardMaterial({
      map: planetTexture,
      roughness: 0.65,
      metalness: 0.35,
      emissive: new THREE.Color(0x021526),
      emissiveIntensity: 0.6,
    });
    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetGroup.add(planetMesh);

    // Planet Atmospheric Fresnel Glow (Custom Shader)
    const atmosphereGeo = new THREE.SphereGeometry(planetRadius * 1.15, 64, 64);
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
          float glow = pow(fresnel, 2.2);
          vec3 cyanColor = vec3(0.0, 0.95, 1.0);
          gl_FragColor = vec4(cyanColor, glow * 0.7);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    planetGroup.add(atmosphereMesh);

    // Planetary Ring with Cyber Debris
    const ringRadiusInner = planetRadius * 1.45;
    const ringRadiusOuter = planetRadius * 2.3;
    const ringParticleCount = Math.floor(1500 * starCountFactor);
    const ringGeo = new THREE.BufferGeometry();
    const ringPos = new Float32Array(ringParticleCount * 3);
    const ringColors = new Float32Array(ringParticleCount * 3);

    for (let i = 0; i < ringParticleCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const dist = THREE.MathUtils.randFloat(ringRadiusInner, ringRadiusOuter);
      ringPos[i3] = Math.cos(angle) * dist;
      ringPos[i3 + 1] = THREE.MathUtils.randFloatSpread(0.4);
      ringPos[i3 + 2] = Math.sin(angle) * dist;

      // Cyan to silver gradient
      const factor = Math.random();
      ringColors[i3] = factor * 0.2;
      ringColors[i3 + 1] = 0.8 + factor * 0.2;
      ringColors[i3 + 2] = 1.0;
    }

    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
    ringGeo.setAttribute('color', new THREE.BufferAttribute(ringColors, 3));

    const ringMat = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const planetRing = new THREE.Points(ringGeo, ringMat);
    planetRing.rotation.x = Math.PI * 0.35;
    planetRing.rotation.y = Math.PI * 0.12;
    planetGroup.add(planetRing);

    // Orbiting Satellite / Beacon Probe
    const satelliteGroup = new THREE.Group();
    const probeBodyGeo = new THREE.OctahedronGeometry(0.35, 0);
    const probeBodyMat = new THREE.MeshStandardMaterial({
      color: 0x00f3ff,
      emissive: 0x00f3ff,
      emissiveIntensity: 0.8,
      metalness: 0.9,
    });
    const probeMesh = new THREE.Mesh(probeBodyGeo, probeBodyMat);
    satelliteGroup.add(probeMesh);

    // Probe solar panels
    const panelGeo = new THREE.BoxGeometry(1.6, 0.05, 0.4);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x032b45, metalness: 0.8 });
    const panelMesh = new THREE.Mesh(panelGeo, panelMat);
    satelliteGroup.add(panelMesh);

    // Blinking light
    const probeLight = new THREE.PointLight(0x00f3ff, 2.5, 12);
    satelliteGroup.add(probeLight);
    scene.add(satelliteGroup);

    // Distant Moon / Second celestial body
    const moonGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.8,
      emissive: 0x082f49,
      emissiveIntensity: 0.2,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(-35, 18, -40);
    scene.add(moonMesh);

    // 5. Mouse Interaction & Parallax Variables
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse to [-1, 1]
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 6. Camera Waypoints for the 6 Cosmic Sectors
    // [Opening -> About -> Skills -> Projects -> Journey -> Contact]
    const waypoints = [
      // 0: Hero / Opening - Majestic vista of planet
      { camPos: new THREE.Vector3(0, 1.5, 26), lookAt: new THREE.Vector3(0, 0, 0), planetPos: new THREE.Vector3(4.5, -0.5, 0) },
      // 1: About / Holographic Dossier - Zoom in, planet tilts, focus on digital grid
      { camPos: new THREE.Vector3(-4, 0.5, 20), lookAt: new THREE.Vector3(1, 0, 0), planetPos: new THREE.Vector3(7, -0.2, -2) },
      // 2: Skills / Energy Nodes - Viewing orbital ring and planetary plane
      { camPos: new THREE.Vector3(6, 4, 22), lookAt: new THREE.Vector3(-1, 1, 0), planetPos: new THREE.Vector3(-6, -1.5, -4) },
      // 3: Projects / Deep Space Station - Wide orbital track
      { camPos: new THREE.Vector3(-3, -2, 24), lookAt: new THREE.Vector3(1, -0.5, 0), planetPos: new THREE.Vector3(5.5, 2.5, -6) },
      // 4: Journey / Glowing Orbital Trajectory - Panoramic angle showing ring arc
      { camPos: new THREE.Vector3(5, 3, 21), lookAt: new THREE.Vector3(0, 0, -2), planetPos: new THREE.Vector3(-4, -0.8, -3) },
      // 5: Contact / Subspace Gateway - Facing forward into the cosmic horizon
      { camPos: new THREE.Vector3(0, 1, 23), lookAt: new THREE.Vector3(0, 0, -5), planetPos: new THREE.Vector3(0, -3.2, -5) },
    ];

    const currentCamPos = new THREE.Vector3().copy(waypoints[0].camPos);
    const currentLookAt = new THREE.Vector3().copy(waypoints[0].lookAt);
    const currentPlanetPos = new THREE.Vector3().copy(waypoints[0].planetPos);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let satelliteAngle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Calculate Waypoint Interpolation based on scrollProgress
      const progress = THREE.MathUtils.clamp(scrollRef.current, 0, 1);
      const totalSegments = waypoints.length - 1;
      const segmentProgress = progress * totalSegments;
      const segmentIndex = Math.min(Math.floor(segmentProgress), totalSegments - 1);
      const segmentFraction = segmentProgress - segmentIndex;

      // Smooth hermite / smoothstep interpolation
      const smoothFraction = segmentFraction * segmentFraction * (3 - 2 * segmentFraction);

      const wpStart = waypoints[segmentIndex];
      const wpEnd = waypoints[Math.min(segmentIndex + 1, waypoints.length - 1)];

      const targetCamPos = new THREE.Vector3().lerpVectors(wpStart.camPos, wpEnd.camPos, smoothFraction);
      const targetLookAt = new THREE.Vector3().lerpVectors(wpStart.lookAt, wpEnd.lookAt, smoothFraction);
      const targetPlanetPos = new THREE.Vector3().lerpVectors(wpStart.planetPos, wpEnd.planetPos, smoothFraction);

      // Apply subtle mouse parallax to camera position and target
      const parallaxFactor = prefersReducedMotion ? 0.05 : 0.8;
      targetCamPos.x += mouse.x * parallaxFactor;
      targetCamPos.y += mouse.y * (parallaxFactor * 0.7);
      targetLookAt.x += mouse.x * (parallaxFactor * 0.4);

      // Interpolate current camera & planet positions
      currentCamPos.lerp(targetCamPos, 0.06);
      currentLookAt.lerp(targetLookAt, 0.06);
      currentPlanetPos.lerp(targetPlanetPos, 0.06);

      camera.position.copy(currentCamPos);
      camera.lookAt(currentLookAt);

      planetGroup.position.copy(currentPlanetPos);

      // Continuous subtle planetary rotation
      const spinSpeed = prefersReducedMotion ? 0.02 : 0.08;
      planetMesh.rotation.y += delta * spinSpeed;
      planetRing.rotation.z += delta * (spinSpeed * 0.4);

      // Mouse interactive tilt for planet
      planetGroup.rotation.x = mouse.y * 0.12;
      planetGroup.rotation.z = -mouse.x * 0.12;

      // Orbiting Satellite calculation
      satelliteAngle += delta * 0.45;
      const satRadius = planetRadius * 1.6;
      satelliteGroup.position.set(
        currentPlanetPos.x + Math.cos(satelliteAngle) * satRadius,
        currentPlanetPos.y + Math.sin(satelliteAngle * 0.8) * 2.5,
        currentPlanetPos.z + Math.sin(satelliteAngle) * satRadius
      );
      satelliteGroup.lookAt(currentPlanetPos);

      // Blinking beacon on satellite
      probeLight.intensity = Math.sin(elapsed * 6) > 0.3 ? 3.5 : 0.8;

      // Background Starfields Parallax Rotation
      deepStars.rotation.y = elapsed * 0.005 + mouse.x * 0.02;
      midStars.rotation.y = elapsed * 0.012 + mouse.x * 0.04;
      closeStars.rotation.y = elapsed * 0.02 + mouse.x * 0.08;

      // Cosmic dust drift
      cosmicDust.rotation.y = elapsed * 0.015;
      cosmicDust.rotation.x = elapsed * 0.008;

      // Moon subtle orbit
      moonMesh.position.x = -35 + Math.sin(elapsed * 0.08) * 4;
      moonMesh.position.y = 18 + Math.cos(elapsed * 0.08) * 2;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Dispose Three.js objects
      planetTexture.dispose();
      planetGeo.dispose();
      planetMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      probeBodyGeo.dispose();
      probeBodyMat.dispose();
      panelGeo.dispose();
      panelMat.dispose();
      moonGeo.dispose();
      moonMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      deepStars.geometry.dispose();
      midStars.geometry.dispose();
      closeStars.geometry.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #071527 0%, #02040a 80%)',
      }}
      aria-hidden="true"
    />
  );
};
