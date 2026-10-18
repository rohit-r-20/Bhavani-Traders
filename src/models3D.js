/**
 * Bhavani Traders - 3D Hardware Clamp Interactive Experience
 * Features:
 * - Dynamic 3D Heavy C-Clamp with cast iron & aged brass materials
 * - Mouse parallax, 360 drag inspection, and tighten/loosen screw animation
 * - Built-in procedural Canvas 2.5D fallback if WebGL or CDN is unavailable
 * - Full respect for prefers-reduced-motion
 */

import { sound } from './sound.js';

export class ClampVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.width = this.container.clientWidth || 400;
    this.height = this.container.clientHeight || 420;

    // State
    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.targetRotation = { x: 0.25, y: -0.45 };
    this.currentRotation = { x: 0.25, y: -0.45 };
    this.parallax = { x: 0, y: 0 };
    this.autoRotate = !this.reducedMotion;
    this.isClamping = false;
    this.clampProgress = 0.35; // 0 (open) to 1 (tightened)
    this.targetClampProgress = 0.35;

    // Three.js instances
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.clampGroup = null;
    this.spindleGroup = null;
    this.handleMesh = null;
    this.animFrameId = null;

    this.init();
  }

  async init() {
    this.setupListeners();

    // Try loading Three.js from CDN
    try {
      const THREE = await this.loadThreeJS();
      if (THREE) {
        this.initThree(THREE);
        return;
      }
    } catch {
      // Fallback below
    }

    // Fallback to high-precision procedural 2.5D Canvas
    this.initCanvasFallback();
  }

  async loadThreeJS() {
    if (window.THREE) return window.THREE;
    try {
      const module = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
      return module;
    } catch {
      return null;
    }
  }

  initThree(THREE) {
    this.THREE = THREE;
    const canvas = document.createElement('canvas');
    canvas.className = 'clamp-3d-canvas';
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Interactive 3D model of a heavy-duty industrial C-clamp');
    this.container.appendChild(canvas);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0.4, 6.2);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    // Set buffer size without injecting fixed inline CSS width/height
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffedd4, 2.2); // Warm brass sunlight
    dirLight1.position.set(4, 6, 5);
    dirLight1.castShadow = true;
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa5c4d4, 1.2); // Cool rim light
    dirLight2.position.set(-5, -2, -3);
    this.scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xd4af37, 1.5, 8); // Golden specular highlight
    pointLight.position.set(0, 1, 3);
    this.scene.add(pointLight);

    // Build the 3D Clamp Object
    this.buildClampModel(THREE);

    // Ground contact shadow disc
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x111614,
      transparent: true,
      opacity: 0.18,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.8;
    this.scene.add(shadowMesh);

    // Animation Loop
    const animate = () => {
      this.animFrameId = requestAnimationFrame(animate);

      // Auto rotation
      if (this.autoRotate && !this.isDragging && !this.reducedMotion) {
        this.targetRotation.y += 0.0035;
      }

      // Smooth damping
      const smoothing = 0.08;
      this.currentRotation.x += (this.targetRotation.x + this.parallax.y - this.currentRotation.x) * smoothing;
      this.currentRotation.y += (this.targetRotation.y + this.parallax.x - this.currentRotation.y) * smoothing;

      if (this.clampGroup) {
        this.clampGroup.rotation.x = this.currentRotation.x;
        this.clampGroup.rotation.y = this.currentRotation.y;
      }

      // Clamp spindle movement
      const clampStep = (this.targetClampProgress - this.clampProgress) * 0.1;
      if (Math.abs(clampStep) > 0.001) {
        this.clampProgress += clampStep;
        this.updateSpindlePosition();
      }

      this.renderer.render(this.scene, this.camera);
    };

    animate();
    this.setupInteractions(canvas);
  }

  buildClampModel(THREE) {
    this.clampGroup = new THREE.Group();

    // Material Definitions
    // 1. Cast Body Material (deep forest green iron with heavy metallic sheen)
    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e3629,
      roughness: 0.42,
      metalness: 0.65,
    });

    // 2. Aged Brass & Machined Steel Material for screw, handle, and anvil
    const agedBrassMat = new THREE.MeshStandardMaterial({
      color: 0xbfa15f,
      roughness: 0.32,
      metalness: 0.88,
    });

    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x4a525a,
      roughness: 0.35,
      metalness: 0.85,
    });

    // --- C-FRAME CONSTRUCTION ---
    // Create heavy C-shaped curve using 2D shape extrusion
    const shape = new THREE.Shape();
    const rOuter = 1.6;
    const rInner = 0.85;
    const thickness = 0.38;

    // Outer contour
    shape.moveTo(-0.1, -1.5);
    shape.lineTo(-0.9, -1.5);
    shape.absarc(-0.9, 0, rOuter, -Math.PI * 0.45, Math.PI * 0.45, false);
    shape.lineTo(-0.1, 1.5);
    shape.lineTo(-0.1, 1.15); // Top Jaw Anvil support
    shape.lineTo(-0.7, 1.15);
    shape.absarc(-0.7, 0, rInner, Math.PI * 0.45, -Math.PI * 0.45, true);
    shape.lineTo(-0.1, -1.15); // Bottom Threaded Boss support
    shape.closePath();

    const extrudeSettings = {
      steps: 2,
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 4
    };

    const frameGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    frameGeo.center();
    const frameMesh = new THREE.Mesh(frameGeo, castIronMat);
    frameMesh.castShadow = true;
    frameMesh.receiveShadow = true;
    this.clampGroup.add(frameMesh);

    // Reinforcing Spine Rib
    const spineGeo = new THREE.TorusGeometry(1.25, 0.08, 8, 32, Math.PI * 0.95);
    const spineMesh = new THREE.Mesh(spineGeo, agedBrassMat);
    spineMesh.rotation.z = Math.PI * 0.52;
    spineMesh.position.set(-0.7, 0, 0.19);
    this.clampGroup.add(spineMesh);

    // Top Anvil (Stationary clamping jaw)
    const anvilGeo = new THREE.CylinderGeometry(0.3, 0.32, 0.22, 24);
    const anvilMesh = new THREE.Mesh(anvilGeo, steelMat);
    anvilMesh.position.set(0.68, 1.05, 0);
    this.clampGroup.add(anvilMesh);

    // Bottom Threaded Collar / Boss
    const collarGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.55, 24);
    const collarMesh = new THREE.Mesh(collarGeo, castIronMat);
    collarMesh.position.set(0.68, -1.05, 0);
    this.clampGroup.add(collarMesh);

    // --- SPINDLE SCREW ASSEMBLY (Moveable) ---
    this.spindleGroup = new THREE.Group();
    this.spindleGroup.position.set(0.68, -0.6, 0);

    // Threaded Rod Shaft
    const rodLength = 2.4;
    const rodGeo = new THREE.CylinderGeometry(0.18, 0.18, rodLength, 24);
    const rodMesh = new THREE.Mesh(rodGeo, agedBrassMat);
    this.spindleGroup.add(rodMesh);

    // Thread rings simulation (grooves on the screw)
    const ringGeo = new THREE.TorusGeometry(0.19, 0.018, 6, 18);
    for (let i = -0.9; i < 0.9; i += 0.09) {
      const ring = new THREE.Mesh(ringGeo, steelMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = i;
      this.spindleGroup.add(ring);
    }

    // Swivel Clamping Foot (Top Pad)
    const padGeo = new THREE.CylinderGeometry(0.28, 0.25, 0.14, 24);
    const padMesh = new THREE.Mesh(padGeo, steelMat);
    padMesh.position.y = rodLength / 2;
    this.spindleGroup.add(padMesh);

    // Lower Handle Collar (T-junction)
    const handleCollarGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.3, 20);
    const handleCollar = new THREE.Mesh(handleCollarGeo, agedBrassMat);
    handleCollar.position.y = -rodLength / 2;
    this.spindleGroup.add(handleCollar);

    // Tommy Bar (Sliding T-Handle)
    this.handleMesh = new THREE.Group();
    this.handleMesh.position.y = -rodLength / 2;

    const barGeo = new THREE.CylinderGeometry(0.07, 0.07, 1.4, 16);
    const barMesh = new THREE.Mesh(barGeo, steelMat);
    barMesh.rotation.z = Math.PI / 2;
    this.handleMesh.add(barMesh);

    // End Spheres / Caps on Handle
    const capGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const cap1 = new THREE.Mesh(capGeo, agedBrassMat);
    cap1.position.x = 0.7;
    const cap2 = new THREE.Mesh(capGeo, agedBrassMat);
    cap2.position.x = -0.7;
    this.handleMesh.add(cap1);
    this.handleMesh.add(cap2);

    this.spindleGroup.add(this.handleMesh);
    this.clampGroup.add(this.spindleGroup);

    this.clampGroup.scale.set(1.2, 1.2, 1.2);
    this.scene.add(this.clampGroup);

    this.updateSpindlePosition();
  }

  updateSpindlePosition() {
    if (!this.spindleGroup) return;
    // Map progress 0..1: Y position moves up towards anvil
    // Min gap (tightened): pad touches anvil near Y = 0.95
    // Max gap (open): pad lowered down to Y = 0.0
    const minY = -0.9;
    const maxY = -0.05;
    const currentY = minY + this.clampProgress * (maxY - minY);
    this.spindleGroup.position.y = currentY;

    // Rotate handle as it turns
    if (this.handleMesh) {
      this.handleMesh.rotation.y = this.clampProgress * Math.PI * 12;
    }
  }

  toggleClamp() {
    this.isClamping = !this.isClamping;
    this.targetClampProgress = this.isClamping ? 0.88 : 0.2;
    
    // Audio tactile feedback
    sound.playRatchetClick(this.isClamping ? 2 : -1);
    const toggleBtn = document.getElementById('clamp-action-btn');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', this.isClamping ? 'true' : 'false');
      toggleBtn.innerHTML = this.isClamping
        ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg> Loosen Clamp Jaw`
        : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg> Tighten Heavy Clamp`;
    }
  }

  resetView() {
    this.targetRotation = { x: 0.25, y: -0.45 };
    this.autoRotate = !this.reducedMotion;
    sound.playMetallicTap(720, 0.05);
  }

  setupInteractions(element) {
    const onPointerDown = (e) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.prevMouse = { x: e.clientX, y: e.clientY };
      element.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.prevMouse.x;
        const deltaY = e.clientY - this.prevMouse.y;
        this.targetRotation.y += deltaX * 0.008;
        this.targetRotation.x += deltaY * 0.008;
        this.targetRotation.x = Math.max(-0.9, Math.min(0.9, this.targetRotation.x));
        this.prevMouse = { x: e.clientX, y: e.clientY };

        // Subtle ratchet clicks on active drag rotation
        if (Math.abs(deltaX) > 12) {
          sound.playRatchetClick(Math.random() * 0.5);
        }
      } else {
        // Parallax on hover
        const rect = element.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        this.parallax.x = nx * 0.15;
        this.parallax.y = ny * 0.12;
      }
    };

    const onPointerUp = () => {
      this.isDragging = false;
      element.style.cursor = 'grab';
    };

    element.style.cursor = 'grab';
    element.style.touchAction = 'pan-y';
    element.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Double click to toggle clamp screw
    element.addEventListener('dblclick', () => this.toggleClamp());

    // Window / Container Resize with ResizeObserver
    const handleResize = () => {
      if (!this.container || !this.renderer) return;
      this.width = this.container.clientWidth || 280;
      this.height = this.container.clientHeight || 340;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height, false);
    };

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(handleResize);
      ro.observe(this.container);
    } else {
      window.addEventListener('resize', handleResize);
    }
  }

  setupListeners() {
    // Action Buttons
    const clampBtn = document.getElementById('clamp-action-btn');
    if (clampBtn) {
      clampBtn.addEventListener('click', () => this.toggleClamp());
    }

    const resetBtn = document.getElementById('clamp-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetView());
    }

    // Media query listener for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      this.autoRotate = !e.matches;
    });
  }

  // --- PROCEDURAL 2.5D CANVAS FALLBACK ---
  // Guaranteed zero-dependency fallback that looks crisp and tactile
  initCanvasFallback() {
    const canvas = document.createElement('canvas');
    canvas.className = 'clamp-3d-canvas';
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Precision technical diagram of a heavy-duty industrial clamp');
    canvas.style.touchAction = 'pan-y';
    this.container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      this.width = this.container.clientWidth || 280;
      this.height = this.container.clientHeight || 320;
      canvas.width = this.width * dpr;
      canvas.height = this.height * dpr;
    };
    resize();
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(resize);
      ro.observe(this.container);
    } else {
      window.addEventListener('resize', resize);
    }

    let angle = -0.4;
    let targetAngle = -0.4;

    const render = () => {
      if (this.autoRotate && !this.isDragging && !this.reducedMotion) {
        targetAngle += 0.005;
      }
      angle += (targetAngle + this.parallax.x - angle) * 0.08;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, this.width, this.height);

      const cx = this.width / 2;
      const cy = this.height / 2 + 10;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // Shadow
      ctx.save();
      ctx.fillStyle = 'rgba(26, 31, 36, 0.12)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 140, 110 + 20 * Math.abs(cosA), 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw 2.5D Isometric Clamp Frame
      ctx.save();
      ctx.translate(cx, cy);

      // Back frame spine
      const gradient = ctx.createLinearGradient(-120 * cosA, -100, 120 * cosA, 100);
      gradient.addColorStop(0, '#1E3629');
      gradient.addColorStop(0.5, '#2A4736');
      gradient.addColorStop(1, '#15241C');

      ctx.lineWidth = 26;
      ctx.strokeStyle = gradient;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(60 * cosA, -90);
      ctx.lineTo(-80 * cosA, -90);
      ctx.bezierCurveTo(-140 * cosA, -90, -140 * cosA, 90, -80 * cosA, 90);
      ctx.lineTo(60 * cosA, 90);
      ctx.stroke();

      // Metallic highlight bevel on spine
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#B88636';
      ctx.beginPath();
      ctx.arc(-80 * cosA, 0, 80 * Math.abs(cosA) + 12, Math.PI * 0.45, Math.PI * 1.55);
      ctx.stroke();

      // Top Anvil
      ctx.fillStyle = '#4A525A';
      ctx.beginPath();
      ctx.rect(40 * cosA - 15, -102, 30, 20);
      ctx.fill();

      // Bottom Collar
      ctx.fillStyle = '#2A4736';
      ctx.beginPath();
      ctx.rect(40 * cosA - 18, 80, 36, 26);
      ctx.fill();

      // Spindle Rod (Moveable screw)
      const screwProgress = this.clampProgress;
      const padY = 70 - screwProgress * 130;

      const brassGrad = ctx.createLinearGradient(0, padY, 0, 150);
      brassGrad.addColorStop(0, '#E5C16C');
      brassGrad.addColorStop(0.5, '#B88636');
      brassGrad.addColorStop(1, '#7C551C');

      ctx.fillStyle = brassGrad;
      ctx.fillRect(50 * cosA - 7, padY, 14, 150 - padY);

      // Screw Swivel Foot (Pad)
      ctx.fillStyle = '#3D434A';
      ctx.beginPath();
      ctx.rect(50 * cosA - 16, padY - 8, 32, 10);
      ctx.fill();

      // Tommy Bar T-Handle
      const handleWidth = 90 * cosA;
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#D1D5DB';
      ctx.beginPath();
      ctx.moveTo(50 * cosA - handleWidth / 2, 150);
      ctx.lineTo(50 * cosA + handleWidth / 2, 150);
      ctx.stroke();

      // Handle End Caps
      ctx.fillStyle = '#B88636';
      ctx.beginPath();
      ctx.arc(50 * cosA - handleWidth / 2, 150, 6, 0, Math.PI * 2);
      ctx.arc(50 * cosA + handleWidth / 2, 150, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.restore();

      requestAnimationFrame(render);
    };

    render();

    // Interaction handlers
    canvas.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.prevMouse.x;
        targetAngle += dx * 0.01;
        this.prevMouse = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });

    canvas.addEventListener('dblclick', () => this.toggleClamp());
  }
}
