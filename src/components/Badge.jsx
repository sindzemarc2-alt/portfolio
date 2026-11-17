import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { INFOS } from "../donnees";

const S = 1.5; // taille du badge (1 = ancienne taille)
const NB_MAILLONS = 15; // nombre de maillons de la chaîne

const vec = new THREE.Vector3();
const ang = new THREE.Vector3();
const rot = new THREE.Vector3();
const dir = new THREE.Vector3();
const pos = new THREE.Vector3();
const tan = new THREE.Vector3();
const AXE_Y = new THREE.Vector3(0, 1, 0);

/* ---------- visuels du badge (acier brossé), dessinés en canvas ---------- */

function creerTexture(face) {
  const L = 640;
  const H = 900;
  const c = document.createElement("canvas");
  c.width = L;
  c.height = H;
  const g = c.getContext("2d");

  g.beginPath();
  g.roundRect(0, 0, L, H, 32);
  g.clip();

  // fond acier
  const fond = g.createLinearGradient(0, 0, L, H);
  fond.addColorStop(0, "#e3e8f0");
  fond.addColorStop(0.45, "#a4adbd");
  fond.addColorStop(1, "#d0d6e1");
  g.fillStyle = fond;
  g.fillRect(0, 0, L, H);

  // stries de métal brossé
  let s = 11;
  const hasard = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  for (let y = 0; y < H; y += 2) {
    g.fillStyle =
      hasard() > 0.5
        ? `rgba(255,255,255,${hasard() * 0.12})`
        : `rgba(0,0,0,${hasard() * 0.08})`;
    g.fillRect(0, y, L, 1);
  }

  // liseré bleu
  g.lineWidth = 10;
  g.strokeStyle = "#2563eb";
  g.strokeRect(5, 5, L - 10, H - 10);

  // fente en haut
  g.fillStyle = "#4b5565";
  g.beginPath();
  g.roundRect(L / 2 - 60, 40, 120, 26, 13);
  g.fill();

  g.textAlign = "center";

  let t;

  if (face === "front") {
    const cx = L / 2;
    const cy = 335;
    const r = 160;

    // cercle gris en attendant que la photo se charge
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.fillStyle = "#6b7487";
    g.fill();
    g.lineWidth = 8;
    g.strokeStyle = "#2563eb";
    g.stroke();

    // la photo, découpée en cercle
    const img = new Image();
    img.onload = () => {
      g.save();
      g.beginPath();
      g.arc(cx, cy, r, 0, Math.PI * 2);
      g.clip();
      g.drawImage(img, cx - r, cy - r, r * 2, r * 2);
      g.restore();
      g.lineWidth = 8;
      g.strokeStyle = "#2563eb";
      g.beginPath();
      g.arc(cx, cy, r, 0, Math.PI * 2);
      g.stroke();
      t.needsUpdate = true;
    };
    img.src = INFOS.photo;

    // le nom (réduit automatiquement s'il est trop long)
    const nom = INFOS.nom.toUpperCase();
    let taille = 56;
    g.font = `bold ${taille}px system-ui, sans-serif`;
    while (g.measureText(nom).width > L - 80 && taille > 24) {
      taille -= 2;
      g.font = `bold ${taille}px system-ui, sans-serif`;
    }
    g.fillStyle = "#0b1020";
    g.fillText(nom, L / 2, 600);

    g.fillStyle = "#1d4ed8";
    g.font = "700 36px system-ui, sans-serif";
    g.fillText(INFOS.metier.toUpperCase(), L / 2, 662);

    g.fillStyle = "rgba(11,16,32,0.55)";
    g.font = "26px system-ui, sans-serif";
    g.fillText("PORTFOLIO 2026", L / 2, 820);
  } else {
    g.fillStyle = "#0b1020";
    g.font = "bold 40px system-ui, sans-serif";
    g.fillText("SCAN ME", L / 2, 170);

    // faux QR code
    const n = 21;
    const cell = 16;
    const x0 = (L - n * cell) / 2;
    const y0 = 210;
    g.fillStyle = "#0b1020";
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (hasard() > 0.5) g.fillRect(x0 + i * cell, y0 + j * cell, cell, cell);
      }
    }
    const finder = (cx, cy) => {
      g.fillStyle = "#0b1020";
      g.fillRect(x0 + cx * cell, y0 + cy * cell, 7 * cell, 7 * cell);
      g.fillStyle = "#dfe4ec";
      g.fillRect(x0 + (cx + 1) * cell, y0 + (cy + 1) * cell, 5 * cell, 5 * cell);
      g.fillStyle = "#0b1020";
      g.fillRect(x0 + (cx + 2) * cell, y0 + (cy + 2) * cell, 3 * cell, 3 * cell);
    };
    finder(0, 0);
    finder(n - 7, 0);
    finder(0, n - 7);

    g.fillStyle = "#1d4ed8";
    g.font = "bold 44px system-ui, sans-serif";
    g.fillText("PORTFOLIO", L / 2, 690);
  }

  t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/* ---------- caméra adaptée à la taille de l'écran ---------- */

function AjusteCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    // écran étroit (téléphone) : on recule pour que le badge reste entier
    camera.position.z = size.width < 500 ? 31 : 25;
    camera.updateProjectionMatrix();
  }, [camera, size.width]);

  return null;
}

/* ---------- chaîne + badge avec physique ---------- */

function Lanyard() {
  const chaine = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    c.curveType = "chordal";
    return c;
  });

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // un maillon ovale
  const geoMaillon = useMemo(() => {
    const geo = new THREE.TorusGeometry(0.1, 0.03, 10, 24);
    geo.scale(0.75, 1.6, 1);
    return geo;
  }, []);

  const texFace = useMemo(() => creerTexture("front"), []);
  const texDos = useMemo(() => creerTexture("back"), []);

  const segment = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45 * S, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current) {
      [j1, j2].forEach((r) => {
        if (!r.current.lerped) {
          r.current.lerped = new THREE.Vector3().copy(r.current.translation());
        }
        const dist = Math.max(
          0.1,
          Math.min(1, r.current.lerped.distanceTo(r.current.translation()))
        );
        r.current.lerped.lerp(r.current.translation(), delta * (dist * 50));
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());

      // place chaque maillon le long de la courbe
      for (let i = 0; i < NB_MAILLONS; i++) {
        const t = i / (NB_MAILLONS - 1);
        curve.getPoint(t, pos);
        curve.getTangent(t, tan);
        dummy.position.copy(pos);
        dummy.quaternion.setFromUnitVectors(AXE_Y, tan);
        if (i % 2) dummy.rotateY(Math.PI / 2); // un maillon sur deux est tourné
        dummy.updateMatrix();
        chaine.current.setMatrixAt(i, dummy.matrix);
      }
      chaine.current.instanceMatrix.needsUpdate = true;

      // stabilise la rotation du badge
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  return (
    <>
      <group position={[0, 5.5, 0]}>
        <RigidBody ref={fixed} {...segment} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segment}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8 * S, 1.125 * S, 0.02]} />
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onLostPointerCapture={() => drag(false)}
            onPointerDown={(e) => {
              e.target.setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              );
            }}
          >
            {/* tranche métallique du badge */}
            <RoundedBox
              args={[1.6 * S, 2.25 * S, 0.05]}
              radius={0.08 * S}
              smoothness={4}
            >
              <meshStandardMaterial
                color="#aab3c2"
                metalness={1}
                roughness={0.25}
              />
            </RoundedBox>

            {/* face avant */}
            <mesh position={[0, 0, 0.026]}>
              <planeGeometry args={[1.6 * S, 2.25 * S]} />
              <meshPhysicalMaterial
                map={texFace}
                alphaTest={0.5}
                metalness={0.85}
                roughness={0.3}
                clearcoat={1}
                clearcoatRoughness={0.15}
              />
            </mesh>

            {/* face arrière */}
            <mesh position={[0, 0, -0.026]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[1.6 * S, 2.25 * S]} />
              <meshPhysicalMaterial
                map={texDos}
                alphaTest={0.5}
                metalness={0.85}
                roughness={0.3}
                clearcoat={1}
                clearcoatRoughness={0.15}
              />
            </mesh>

            {/* attache métallique */}
            <mesh position={[0, 1.3 * S, 0]}>
              <boxGeometry args={[0.3 * S, 0.26 * S, 0.09]} />
              <meshStandardMaterial
                color="#c0c7d3"
                metalness={1}
                roughness={0.2}
              />
            </mesh>
          </group>
        </RigidBody>
      </group>

      {/* la chaîne */}
      <instancedMesh
        ref={chaine}
        args={[undefined, undefined, NB_MAILLONS]}
        frustumCulled={false}
      >
        <primitive object={geoMaillon} attach="geometry" />
        <meshStandardMaterial color="#c9d0dc" metalness={1} roughness={0.22} />
      </instancedMesh>
    </>
  );
}

export default function Badge() {
  return (
    <Canvas
      camera={{ position: [0, 0, 25], fov: 20 }}
      dpr={[1, 2]}
      // un glissement vertical du doigt fait défiler la page au lieu de bloquer
      style={{ touchAction: "pan-y" }}
    >
      <AjusteCamera />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 6]} intensity={1.5} />

      {/* reflets pour l'effet métal (aucun téléchargement nécessaire) */}
      <Environment resolution={256}>
        <color attach="background" args={["#0b1330"]} />
        <Lightformer form="rect" intensity={3} color="white" position={[0, 4, 6]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={2} color="#9ec5ff" position={[-6, 0, 3]} rotation={[0, Math.PI / 2, 0]} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={2} color="#ffffff" position={[6, 1, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 3, 1]} />
        <Lightformer form="ring" intensity={2} color="#ffffff" position={[0, -3, 8]} scale={4} />
      </Environment>

      <Physics gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Lanyard />
      </Physics>
    </Canvas>
  );
}