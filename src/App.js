import { useRef, useEffect, Suspense } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Canvas, useThree } from "react-three-fiber";
import * as Three from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import GUI from "lil-gui";
import floorTexture from "./images.jpeg";
import wallTexture from "./wall.jpeg";
import { CharacterControls } from "./characterControls";
import { KeyDisplay } from "./utils";
import BasicCharacterController from "./thirdperson/BasicCharacterController";
import { Physics } from "@react-three/cannon";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);

    controls.minDistance = 3;
    controls.maxDistance = 20;
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);
  return null;
};

function Bed() {
  const gltf = useLoader(GLTFLoader, "/bed.glb");
  //console.log(gltf.nodes);
  return (
    <primitive
      object={gltf.scene}
      // position={[280, 0, -470]}
      position={[2.8, 1, 2.2]}
      rotation={[0, -0.85, 0]}
      scale={[1.9, 1.9, 1.9]}
    />
  );
}

function Computer() {
  const gltf = useLoader(GLTFLoader, "/computer.glb");
  //console.log(gltf.nodes);
  return (
    <primitive
      object={gltf.scene}
      // position={[280, 0, -470]}
      position={[1, 1, 0.6]}
      // rotation={[0, 3.2, 0]}
      rotation={[0, Math.PI * 1.5, 0]}
      scale={0.4}
    />
  );
}

function Chair() {
  const gltf = useLoader(GLTFLoader, "/chair.glb");
  //console.log(gltf.nodes);
  return (
    <primitive
      object={gltf.scene}
      // position={[280, 0, -470]}
      position={[1, 0.8, 2]}
      // rotation={[0, 3.2, 0]}
      rotation={[0, Math.PI * 1.5, 0]}
      scale={0.7}
    />
  );
}

function Bike() {
  const gltf = useLoader(GLTFLoader, "/bike.glb");
  //console.log(gltf.nodes);
  return (
    <primitive
      object={gltf.scene}
      // position={[280, 0, -470]}
      position={[0, 0.3, 3.5]}
      // rotation={[0, 3.2, 0]}
      rotation={[0, 0.3, 0]}
      scale={0.3}
    />
  );
}

function Soldier({ camera }) {
  let characterControls;
  const gltf = useLoader(GLTFLoader, "/Soldier.glb");
  const model = gltf.scene;
  model.traverse(function (object) {
    if (object.isMesh) {
      object.castShadow = true;
    }
  });
  const gltfAnimations = gltf.animations;
  const mixer = new Three.AnimationMixer(model);
  const animationsMap = new Map();

  gltfAnimations
    .filter((a) => a.name != "TPose")
    .forEach((a) => {
      animationsMap.set(a.name, mixer.clipAction(a));
    });

  characterControls = new CharacterControls(
    model,
    mixer,
    animationsMap,
    camera,
    "Idle"
  );

  const keysPressed = {};
  const keyDisplayQueue = new KeyDisplay();
  document.addEventListener(
    "keydown",
    (event) => {
      keyDisplayQueue.down(event.key);
      if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle();
      } else {
        keysPressed[event.key.toLowerCase()] = true;
      }
    },
    false
  );
  document.addEventListener(
    "keyup",
    (event) => {
      keyDisplayQueue.up(event.key);
      keysPressed[event.key.toLowerCase()] = false;
    },
    false
  );

  const clock = new Three.Clock();
  function animate() {
    let mixerUpdateDelta = clock.getDelta();
    if (characterControls) {
      characterControls.update(mixerUpdateDelta, keysPressed);
    }
    // orbitControls.update()
    // renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  // document.body.appendChild(renderer.domElement);
  animate();

  //console.log(gltf.nodes);
  return (
    <primitive
      object={model}
      // position={[280, 0, -470]}
      position={[1.2, 0.4, 0.65]}
      rotation={[0, -6.9, 0]}
      scale={[2, 1.5, 2]}
    />
  );
}

function Closet() {
  const gltf = useLoader(GLTFLoader, "/closet.glb");
  //console.log(gltf.nodes);
  return (
    <primitive
      object={gltf.scene}
      // position={[280, 0, -470]}
      position={[1.8, 0, 7.35]}
      // rotation={[0, 3.2, 0]}
      rotation={[0, 2.5, 0]}
      scale={3}
    />
  );
}

function Desk() {
  const gltf = useLoader(GLTFLoader, "/desk.glb");
  //console.log(gltf.nodes);
  return (
    <primitive
      object={gltf.scene}
      // position={[280, 0, -470]}
      position={[1.2, 0.4, 0.65]}
      rotation={[0, -6.9, 0]}
      scale={[2, 1.5, 2]}
    />
  );
}

function Hotel() {
  const gltf = useLoader(GLTFLoader, "/hotel.glb");
  //console.log(gltf.nodes);
  return (
    <primitive
      object={gltf.scene}
      // position={[280, 0, -470]}
      position={[30, 2, 0.65]}
      rotation={[0, -3.145/2, 0]}
      scale={2}
      // scale={[2, 1.5, 2]}
    />
  );
}

function Floor() {
  const texture = useLoader(Three.TextureLoader, floorTexture);

  return (
    <mesh
      geometry={new Three.BoxGeometry(5, 0.1, 6)}
      position={[2.5, 0, 3]}
      // material={new Three.MeshBasicMaterial({ color: 0xba8c63 })}
    >
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  );
}

function Wall({ geometry, position }) {
  const texture = useLoader(Three.TextureLoader, wallTexture);
  return (
    <mesh
      geometry={geometry}
      position={position}
      // material={new Three.MeshBasicMaterial({
      //   color: 0xffd700 })}
    >
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  );
}
function App() {
  const GUICOMPONENET = new GUI();
  const meshRef = useRef();
  const cameraRef = useRef();
  // //console.log(meshRef.current.position)

  const positionArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
  const positionAttribute = new Three.BufferAttribute(positionArray, 3);
  const newgemoetry = new Three.BufferGeometry();
  newgemoetry.setAttribute("position", positionAttribute);
  // positionArray[0] = 0;
  // positionArray[1] = 0;
  // positionArray[2] = 0;

  // positionArray[3] = 0;
  // positionArray[4] = 1;
  // positionArray[5] = 0;

  // positionArray[6] = 0;
  // positionArray[7] = 1;
  // positionArray[8] = 0;

  const camera = new Three.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // update the camera

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  });

  window.addEventListener("dblclick", () => {
    //console.log("doubleclick");
    if (!(document.fullscreenElement || document.webkitFullscreenElement)) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitFullscreenElement) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      // document.documentElement.
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  });
  // const aspcectRatio = sizes.width/sizes.height
  // const camera = new Three.OrthographicCamera(-1*aspcectRatio,1*aspcectRatio,1,-1,0.1,100);

  // camera.position.z = 3;
  // camera.position.y = 4

  // camera.position.x = 1
  const handleClick = () => {
    camera.lookAt(meshRef.current.position);
    //console.log(meshRef.current.position.distanceTo(camera.position));
    camera.position.x = 10;
    camera.position.y = 10;
    camera.position.z = 10;
    camera.lookAt([0, 0, 0]);
  };

  const axesHelper = new Three.AxesHelper(3);
  const rotation = new Three.Euler(0, 0, 0);
  let time = Date.now();
  const clock = new Three.Clock();
  const cursor = {
    x: 0,
    y: 0,
  };
  window.addEventListener("mousemove", (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
    //console.log(cursor);
  });
  // const tick = () => {
  //   // gsap.to(meshRef.current.position,{duration:1,x:2})

  //   //console.log(clock.getElapsedTime())
  //   const currentTime = Date.now()
  //   const delta = currentTime - time
  //   const elapsedTime = clock.getElapsedTime()
  //   // // time=currentTime
  //   meshRef.current.rotation.y = Math.sin(elapsedTime);
  //   // meshRef.current.rotation.x = Math.cos(elapsedTime);
  //   camera.position.x = Math.sin(cursor.x*Math.PI*2)*3
  //   camera.position.z = Math.cos(cursor.x*Math.PI*2)*3
  //   camera.position.y = cursor.y
  //   camera.lookAt(meshRef.current.position)

  //   window.requestAnimationFrame(tick);
  // };

  // setTimeout(() => {
  //   tick();
  // }, 1000);
  //console.log(window.devicePixelRatio);
  const BCC = new BasicCharacterController({ camera });
  // mesh.rotation.reorder
  return (
    <div
      className="App"
      style={{ height: "100vh", width: "100vw", backgroundColor: "black" }}
    >
      <button
        style={{ position: "absolute", zIndex: 10 }}
        onClick={() => {
          handleClick();
        }}
      >
        Distance
      </button>
      <Canvas
        ref={cameraRef}
        camera={camera}
        pixelRatio={Math.min(window.devicePixelRatio, 2)}
      >
        {/* <GUICOMPONENET/> */}
        <Suspense fallback={"loading"}>
          <mesh
            ref={meshRef}
            // geometry={new Three.BoxGeometry(1, 1, 1,0,1,1)}
            geometry={newgemoetry}
            material={
              new Three.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
            }
            position={[0, 5.6, 1]}
            rotation={rotation}
          />
          <CameraController />
          <Wall
            geometry={new Three.BoxGeometry(5, 3, 0.1)}
            position={[2.5, 1.5, 0]}
          />

          <Wall
            geometry={new Three.BoxGeometry(0.1, 3, 5)}
            position={[5, 1.5, 2.5]}
            // material={new Three.MeshBasicMaterial({ color: 0xffd700 })}
          />
          <Wall
            geometry={new Three.BoxGeometry(5, 3, 0.1)}
            position={[2.5, 1.5, 6]}
          />

          {/* <mesh 
            geometry={new Three.PlaneGeometry(100, 100, 100,100,100,100)}
            rotation={[-Math.PI/2,0,0]}
            material={new Three.MeshBasicMaterial({ 
              color: 0x9fb4b8, 
              wireframe:true
            })}

            /> */}
          {/* <BCC/> */}

          <gridHelper args={[100, 100]} />
          {/* <axesHelper scale={3} /> */}
          <Bed />
          <Desk />
          <Computer />
          <Chair />
          <Bike />
          <Closet />
          <Floor />
          <Soldier camera={camera} />
          <Hotel/>
          {/* <OrbitControls/> */}
        </Suspense>
        <directionalLight />
        <directionalLight />
        <directionalLight />
        <directionalLight />
        <directionalLight />
        <directionalLight />
        <directionalLight />
      </Canvas>
    </div>
  );
}

export default App;
