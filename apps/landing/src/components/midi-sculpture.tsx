"use client";

import { useEffect, useRef, useState } from "react";

const fallbackNotes = [
  [7, 61, 13, 0], [18, 47, 10, 1], [30, 35, 15, 2], [45, 55, 11, 3],
  [56, 27, 14, 4], [69, 40, 10, 5], [80, 19, 16, 6],
];

export default function MidiSculpture() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"poster" | "loading" | "webgl">("poster");

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const capable = (navigator.hardwareConcurrency || 2) >= 6;
    if (reduced || !finePointer || !capable) return;

    let disposed = false;
    let cleanupScene: (() => void) | undefined;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || disposed || cleanupScene) return;
        observer.disconnect();
        setMode("loading");

        const THREE = await import("three");
        if (disposed) return;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
        camera.position.set(0, 1.5, 12);

        const group = new THREE.Group();
        group.rotation.set(-0.32, -0.42, -0.06);
        scene.add(group);

        const noteGeometry = new THREE.BoxGeometry(1, 0.24, 0.34);
        const noteMaterial = new THREE.MeshStandardMaterial({ color: 0xa8ff38, roughness: 0.48, metalness: 0.05 });
        const sourceMaterial = new THREE.MeshStandardMaterial({ color: 0xe9ece3, roughness: 0.7, metalness: 0 });
        const noteCount = 28;
        const notes = new THREE.InstancedMesh(noteGeometry, noteMaterial, noteCount);
        const sourceNotes = new THREE.InstancedMesh(noteGeometry, sourceMaterial, 7);
        const matrix = new THREE.Matrix4();

        const pattern = [0, 1.2, 2.2, 0.7, 3.1, 1.8, 4.0];
        for (let route = 0; route < 4; route += 1) {
          for (let index = 0; index < 7; index += 1) {
            const x = -4.7 + index * 1.55 + (route % 2) * 0.12;
            const y = 2.55 - route * 1.55 + (pattern[index] - 2) * 0.2 * (0.72 + route * 0.12);
            const z = (route - 1.5) * 0.48;
            const width = 0.68 + ((index + route) % 3) * 0.18;
            matrix.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion(), new THREE.Vector3(width, 1, 1));
            notes.setMatrixAt(route * 7 + index, matrix);
          }
        }

        for (let index = 0; index < 7; index += 1) {
          const x = -4.7 + index * 1.55;
          const y = 4.15 + (pattern[index] - 2) * 0.16;
          matrix.compose(new THREE.Vector3(x, y, 0), new THREE.Quaternion(), new THREE.Vector3(0.76 + (index % 3) * 0.18, 1, 1));
          sourceNotes.setMatrixAt(index, matrix);
        }

        notes.instanceMatrix.needsUpdate = true;
        sourceNotes.instanceMatrix.needsUpdate = true;
        group.add(notes, sourceNotes);

        const gridMaterial = new THREE.LineBasicMaterial({ color: 0x334033, transparent: true, opacity: 0.58 });
        const gridPoints: number[] = [];
        for (let x = -5.5; x <= 5.5; x += 1.1) gridPoints.push(x, -3.2, -1.2, x, 5.0, -1.2);
        for (let y = -3.2; y <= 5.0; y += 0.82) gridPoints.push(-5.5, y, -1.2, 5.5, y, -1.2);
        const gridGeometry = new THREE.BufferGeometry();
        gridGeometry.setAttribute("position", new THREE.Float32BufferAttribute(gridPoints, 3));
        group.add(new THREE.LineSegments(gridGeometry, gridMaterial));

        scene.add(new THREE.HemisphereLight(0xedeee7, 0x071007, 1.35));
        const keyLight = new THREE.DirectionalLight(0xa8ff38, 2.2);
        keyLight.position.set(3, 6, 8);
        scene.add(keyLight);

        let renderRequested = false;
        const resizeAndRender = () => {
          renderRequested = false;
          const width = host.clientWidth;
          const height = host.clientHeight;
          if (canvas.width !== Math.floor(width * renderer.getPixelRatio()) || canvas.height !== Math.floor(height * renderer.getPixelRatio())) {
            renderer.setSize(width, height, false);
            camera.aspect = width / Math.max(1, height);
            camera.updateProjectionMatrix();
          }
          renderer.render(scene, camera);
        };
        const requestRender = () => {
          if (!renderRequested) {
            renderRequested = true;
            window.requestAnimationFrame(resizeAndRender);
          }
        };

        const onPointerMove = (event: PointerEvent) => {
          const rect = host.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          group.rotation.y = -0.42 + x * 0.24;
          group.rotation.x = -0.32 + y * 0.16;
          requestRender();
        };
        const onPointerLeave = () => {
          group.rotation.set(-0.32, -0.42, -0.06);
          requestRender();
        };
        host.addEventListener("pointermove", onPointerMove, { passive: true });
        host.addEventListener("pointerleave", onPointerLeave, { passive: true });

        const resizeObserver = new ResizeObserver(requestRender);
        resizeObserver.observe(host);
        resizeAndRender();
        setMode("webgl");

        cleanupScene = () => {
          resizeObserver.disconnect();
          host.removeEventListener("pointermove", onPointerMove);
          host.removeEventListener("pointerleave", onPointerLeave);
          noteGeometry.dispose();
          noteMaterial.dispose();
          sourceMaterial.dispose();
          gridGeometry.dispose();
          gridMaterial.dispose();
          renderer.dispose();
        };
      },
      { rootMargin: "240px 0px", threshold: 0.05 },
    );

    observer.observe(host);
    return () => {
      disposed = true;
      observer.disconnect();
      cleanupScene?.();
    };
  }, []);

  return (
    <div className={`midi-sculpture is-${mode}`} ref={hostRef}>
      <div className="sculpture-poster" aria-hidden="true">
        <div className="poster-source">
          {fallbackNotes.map(([x, y, width, index]) => <i key={index} style={{ left: `${x}%`, top: `${y - 42}%`, width: `${width}%` }} />)}
        </div>
        {[0, 1, 2, 3].map((route) => (
          <div className="poster-route" style={{ "--poster-route": route } as React.CSSProperties} key={route}>
            {fallbackNotes.map(([x, y, width, index]) => <i key={index} style={{ left: `${x + (route % 2) * 1.4}%`, top: `${y + ((index + route) % 3) * 2}%`, width: `${width - route * 0.7}%` }} />)}
          </div>
        ))}
      </div>
      <canvas ref={canvasRef} role="img" aria-label="Interactive 3D score showing one MIDI motif split into four editable variations" />
      <div className="sculpture-ui">
        <span>PHYSICAL SCORE / 04 ROUTES</span>
        <span>{mode === "webgl" ? "MOVE TO INSPECT" : mode === "loading" ? "PREPARING DETAIL" : "STATIC PERFORMANCE MODE"}</span>
      </div>
      <div className="sculpture-axis" aria-hidden="true"><span>PITCH</span><i /><span>TIME</span></div>
    </div>
  );
}
