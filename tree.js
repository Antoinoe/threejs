import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GUI } from 'https://cdn.skypack.dev/dat.gui';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';


const trees = [];

const gui = new GUI();
const positionFolder = gui.addFolder('Trees Position');

// const save_trees = document.getElementById('save_trees');
// save_trees.addEventListener('click', () => {
//   console.log('Saving trees position to a json file.');
//   const positions = []
//   trees.forEach(element => {
//        positions.push(element.position)
//      });
//   console.log(positions)
//   // Convertir le tableau d'objets Vector3 en tableau d'objets JSON
//   const jsonArray = positions.map(vector => ({ x: vector.x, y: vector.y, z: vector.z }));

//   // Convertir le tableau d'objets JSON en format JSON
//   const jsonContent = JSON.stringify(jsonArray, null, 2);

//   // Example: Créer un fichier JSON et le télécharger
//   const date = new Date();
//   const timeOfDay = `${date.getFullYear()}_${date.getMonth()+1}_${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
//   const fileName = `trees_position${timeOfDay}.json`;
//   const blob = new Blob([jsonContent], { type: 'application/json' });

//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = fileName;

//   // Append the link to the body
//   document.body.appendChild(link);

//   // Trigger the click event on the link
//   link.click();

//   // Remove the link from the DOM
//   document.body.removeChild(link);

// });





export class Tree {
  constructor(scene, x, y, z, trunkTexturePath, leavesTexturePath) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.z = z;
    this.startScale = 0.1;
    this.trunkTexturePath = trunkTexturePath;
    this.leavesTexturePath = leavesTexturePath;
    this.tree = null;
    this.loadTree();
  }

  async loadTree() {
    const fbxLoader = new FBXLoader();

    await new Promise((resolve) => {
      fbxLoader.load(
        'models/Coniferous_Trees/Tree_Spruce_small_02.fbx',
        (object) => {
          object.traverse((child) => {
            if (child.isMesh) {
              const mesh = child;

              if (mesh.material.name.includes('Trunk')) {
                const trunkTexture = new THREE.TextureLoader().load(this.trunkTexturePath);
                trunkTexture.wrapS = THREE.RepeatWrapping;
                trunkTexture.wrapT = THREE.RepeatWrapping;
                mesh.material.map = trunkTexture;
              } else if (mesh.material.name.includes('Leaves')) {
                const leavesTexture = new THREE.TextureLoader().load(this.leavesTexturePath);
                leavesTexture.wrapS = THREE.RepeatWrapping;
                leavesTexture.wrapT = THREE.RepeatWrapping;
                mesh.material.map = leavesTexture;
              }
            }
          });

          object.scale.set(1,1,1); // Définir une échelle initiale
          this.tree = object;
          this.scene.add(object);
        
          object.position.set(this.x, this.y, this.z);
          
          
          resolve();
          trees.push(object);
          this.addGUIControls(object, trees.length);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
          console.log(error);
        }
        
      );
      
    });

    
  }

  addGUIControls(object, index) {
    const singleTree = positionFolder.addFolder(`Tree${index}`);

    singleTree.add(object.position, 'x', -500, 35.0).name('X');
    singleTree.add(object.position, 'y', -5.0, 50.0).name('Y');
    singleTree.add(object.position, 'z', -25.0, 485).name('Z');

    gui.open();
  }    

  updateScale(){
    if(this.startScale<1.0){
      this.tree.scale.add(0.01,0.01,0.01,)
    }
  }
  
}

const animate = ()=>{
    
}

animate()