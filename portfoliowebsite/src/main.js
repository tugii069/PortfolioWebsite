import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Create a new Three.js scene
const scene = new THREE.Scene();

// Set up the camera with a perspective view
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create a WebGL renderer and attach it to the canvas element
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

// Set the pixel ratio and size of the renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Position the camera and render the scene
camera.position.setZ(5);
renderer.render(scene, camera);

// Define the initial coordinates for the heart shape
const x = 0, y = 0;

// Create a heart shape using Bezier curves
const heartShape = new THREE.Shape();
heartShape.moveTo(x + 2.5, y + 2.5);
heartShape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
heartShape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
heartShape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
heartShape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 5.5, x + 8, y + 3.5);
heartShape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
heartShape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

// Define extrusion settings for the heart shape
const extrudeSettings = {
    depth: 2, // Reduce depth for a flatter look
    bevelEnabled: true,
    bevelSegments: 10,
    bevelSize: 0.5, // Adjust bevel size
    bevelThickness: 0.5 // Adjust bevel thickness
};

// Create a 3D geometry from the heart shape
const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

// Create a material with a metallic look
const material = new THREE.MeshStandardMaterial({
    color: 0xA8A9AD, // Silver color
    metalness: 0.5, // Metallic effect
    roughness: 10 // Surface roughness
});

// Create a mesh from the geometry and material
const mesh = new THREE.Mesh(geometry, material);

// Position and scale the heart mesh
mesh.position.set(0, 0, 20); // Move it back in the scene
mesh.scale.set(0.5, 0.5, 0.5); // Scale it down
scene.add(mesh); // Add the mesh to the scene

// Add a point light to the scene
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

// Add ambient light to the scene
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Add orbit controls to allow camera movement
const controls = new OrbitControls(camera, renderer.domElement);

// Create a group to hold all the stars
const stars = new THREE.Group();

// Function to create and position a star
function addStar() {
    const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
    const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(starGeometry, starMaterial);

    // Randomly position the star within a 100-unit cube
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);

    // Add the star to the stars group
    stars.add(star);
}

// Create 200 stars and add them to the scene
Array(200).fill().forEach(addStar);
scene.add(stars);

// Load a space texture for the background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Load a texture for the "tugay" cube
const tugayTexture = new THREE.TextureLoader().load('tugay2.jpg');
const tugay = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshBasicMaterial({ map: tugayTexture })
);
scene.add(tugay);

// Load textures for the moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

// Create a moon mesh with a normal map for added detail
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({
        map: moonTexture,
        normalMap: normalTexture
    })
);
scene.add(moon);

// Position the moon and tugay cube
moon.position.z = 30;
moon.position.setX(-10);
tugay.position.z = -5;
tugay.position.x = 5;

// Function to move the camera based on scroll position
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;

    // Rotate the moon and tugay cube
    moon.rotation.x += 0.05;
    moon.rotation.y += 0.075;
    moon.rotation.z += 0.05;

    tugay.rotation.x += 0.01;
    tugay.rotation.y += 0.01;
    tugay.rotation.z += 0.01;

    // Adjust camera position and rotation based on scroll
    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
}

// Attach the moveCamera function to the scroll event
document.body.onscroll = moveCamera;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the heart, moon, and tugay cube
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.005;
    mesh.rotation.z += 0.005;

    moon.rotation.x += 0.005;
    moon.rotation.y += 0.005;
    moon.rotation.z += 0.005;

    tugay.rotation.x += 0.005;
    tugay.rotation.y += 0.005;
    tugay.rotation.z += 0.005;

    // Update orbit controls and render the scene
    controls.update();
    renderer.render(scene, camera);
}

// Start the animation loop
animate();