import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import * as shapes from './shapes.js';
import * as tree from './tree.js'
import {GUI} from 'https://cdn.skypack.dev/dat.gui';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';



// Create a scene
const scene = new THREE.Scene();
// Create a camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(50, 100, 20);

// Import the canvas element
const canvas = document.getElementById('canvas');

// Create a WebGLRenderer and set its width and height
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // Antialiasing is used to smooth the edges of what is rendered
    antialias: true,
    // Activate the support of transparency
    //alpha: true
    
});

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );

const textureLoader = new THREE.TextureLoader();

// Adding a background
let textureEquirec = textureLoader.load( './img/background.jpg' );
textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
textureEquirec.colorSpace = THREE.SRGBColorSpace;

scene.background = textureEquirec;
//const tree1 = new tree.Tree(scene, 0, 0, 0, './models/Coniferous_Trees/texture_solid.png', './models/Coniferous_Trees/texture_gradient.png');

//scene.add(new tree.Tree(scene, 0, 0, 0, './models/Coniferous_Trees/texture_solid.png', './models/Coniferous_Trees/texture_gradient.png'));
const objLoader = new OBJLoader();

const [terrain_tex, terrain_obj] = await Promise.all([
  textureLoader.loadAsync('./img/doppelmarsh_terrain_texture.png'),
  objLoader.loadAsync('Terrain.obj'),
]);

terrain_obj.traverse(function (child) {
  if (child.isMesh) {
    child.material.map = terrain_tex;
    child.geometry.computeVertexNormals();
  }
});

scene.add(terrain_obj);

const light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set( 0, 1, 0);
scene.add( light );

const ambientLight = new THREE.AmbientLight(0xffffff,1.0);
scene.add(ambientLight);


// Create the controls
const controls = new OrbitControls(camera, canvas);

// Handle the window resize event
window.addEventListener('resize', () => {
    // Update the camera
    camera.aspect =  window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update the renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    console.log("resize")
});


const clickPositions = [];
const raycaster = new THREE.Raycaster();
window.addEventListener('click', onClick);
function onClick(event) {
     // Récupérer la position de la souris
     const mouse = new THREE.Vector2();
     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
 
     // Mettre à jour le raycaster
     raycaster.setFromCamera(mouse, camera);
 
     // Obtenir l'intersection avec le mesh du terrain
     const intersects = raycaster.intersectObject(terrain_obj);
 
     if (intersects.length > 0) {
       // Obtenir la position du point d'intersection
       console.log(intersects)
       const intersectionPoint = intersects[0].point;
       handleTerrainClick(intersectionPoint)
}}
function handleTerrainClick(position) {
    console.log('Clic sur le terrain à la position :', position);
    const terrainPosition = terrain_obj.position;
    const adjustedPosition = new THREE.Vector3(
        position.x - terrainPosition.x,
        position.y - terrainPosition.y,
        position.z - terrainPosition.z
    );
    const newTree = new tree.Tree(scene, adjustedPosition.x, adjustedPosition.y, adjustedPosition.z,'./models/Coniferous_Trees/texture_solid.png', './models/Coniferous_Trees/texture_gradient.png');
}

// Créez une variable pour stocker la vitesse de déplacement
const movementSpeed = 1.0;
// Ajoutez une fonction pour gérer le mouvement de l'objet
const handleMovement = (objToMove) => {
    // Vérifie si la touche enfoncée est la touche Left arrow
    if (keyStates['ArrowLeft']) {
        objToMove.position.x -= movementSpeed;
    }
    // Vérifie si la touche enfoncée est la touche Right arrow
    if (keyStates['ArrowRight']) {
        objToMove.position.x += movementSpeed;
    }
    // Vérifie si la touche enfoncée est la touche Up arrow
    if (keyStates['ArrowUp']) {
        objToMove.position.z -= movementSpeed;
    }
    // Vérifie si la touche enfoncée est la touche Down arrow
    if (keyStates['ArrowDown']) {
        objToMove.position.z += movementSpeed;
        console.log("BAS");
    }
};

// Utilisez une variable pour stocker l'état des touches
const keyStates = {};
// Ajoutez des écouteurs d'événements pour les touches fléchées
window.addEventListener('keydown', (event) => {
    keyStates[event.key] = true;
});

window.addEventListener('keyup', (event) => {
    keyStates[event.key] = false;
});

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass({
    strength: 0.1,
    radius: 1,
    threshold: 0.1,
    exposure: 1
});
const outputPass = new OutputPass();
composer.addPass(renderPass);
composer.addPass(bloomPass);
composer.addPass(outputPass);
const gui = new GUI();
const postProcess = gui.addFolder('Post Process');
const bloom = postProcess.addFolder('bloom');
bloom.add(bloomPass,'strength',0.0,2.0).name('Strength');
// bloom.add(bloomPass,'radius',0.0,10.0).name('Radius');
//bloom.add(bloomPass,'threshold',0.0,10.0).name('Threshold');
// bloom.add(bloomPass,'exposure',0.0,10.0).name('Exposure');

//  Update()
const animate = () => {
    // Call animate recursively
    requestAnimationFrame(animate);
    
    // Update the controls
    controls.update();
    //handleMovement(shapes.sphere1);
    // Render the scene
    renderer.render(scene, camera);
    composer.render();
    
}

// Call animate for the first time
animate();

document.getElementById('fileInput').addEventListener('change', handleFileSelect);
function handleFileSelect(event) {
    const fileInput = event.target;
    
    if (fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
      
      // Lire le contenu du fichier en tant que texte
      const reader = new FileReader();
      
      reader.onload = function (e) {
        try {
          const jsonData = JSON.parse(e.target.result);
          console.log('Contenu JSON :', jsonData);
          jsonData.forEach((position, index) =>{
            const instantiatedTree = new tree.Tree(scene, position.x, position.y, position.z, './models/Coniferous_Trees/texture_solid.png', './models/Coniferous_Trees/texture_gradient.png');
          })
        } 
        catch (error) {
          console.error('Erreur lors de la lecture du fichier JSON :', error.message);
        }
      };
      
      reader.readAsText(selectedFile);
    }
  }