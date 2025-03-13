import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(5);
renderer.render(scene, camera);

const x = 0, y = 0;

const heartShape = new THREE.Shape();
heartShape.moveTo(x + 2.5, y + 2.5); 
heartShape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
heartShape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
heartShape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
heartShape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 5.5, x + 8, y + 3.5);
heartShape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
heartShape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

const extrudeSettings = {
    depth: 2, // Tiefe verringern
    bevelEnabled: true,
    bevelSegments: 10,
    bevelSize: 0.5, // Bevel-Größe anpassen
    bevelThickness: 0.5 // Bevel-Dicke anpassen
};

const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
const material = new THREE.MeshStandardMaterial({
    color: 0xA8A9AD, 
    metalness: 0.5, 
    roughness: 10  
});
const mesh = new THREE.Mesh(geometry, material);

// Herzform positionieren, damit es das tugay-Objekt nicht stört
mesh.position.set(0, 0, 20); // Nach hinten verschieben
mesh.scale.set(0.5, 0.5, 0.5); // Optional: Weiter verkleinern
scene.add(mesh);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);


const controls = new OrbitControls(camera, renderer.domElement);

// Optimized star creation
const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const stars = new THREE.Group();

function addStar() {
    const star = new THREE.Mesh(starGeometry, starMaterial);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

    star.position.set(x, y, z);
    stars.add(star);
}

Array(200).fill().forEach(addStar);
scene.add(stars);

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

const tugayTexture = new THREE.TextureLoader().load('tugay2.jpg');
const tugay = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshBasicMaterial({ map: tugayTexture })
);
scene.add(tugay);

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({
        map: moonTexture,
        normalMap: normalTexture
    })
);
scene.add(moon);
moon.position.z = 30;
moon.position.setX(-10);
tugay.position.z = -5;
tugay.position.x = 5;

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    moon.rotation.x += 0.05;
    moon.rotation.y += 0.075;
    moon.rotation.z += 0.05;

    tugay.rotation.x += 0.01;
    tugay.rotation.y += 0.01;
    tugay.rotation.z += 0.01;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
}
document.body.onscroll = moveCamera;

function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.005;
    mesh.rotation.z += 0.005;
    moon.rotation.x += 0.005;
    moon.rotation.y += 0.005;
    moon.rotation.z += 0.005;
    tugay.rotation.x += 0.005;
    tugay.rotation.y += 0.005;
    tugay.rotation.z += 0.005;
    controls.update();
    renderer.render(scene, camera);
}
animate();