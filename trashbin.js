// // scene.add(shapes.sphere1);
// // scene.add(shapes.sphere2);

// // const table = new THREE.Group();

// // const top1 = new THREE.Mesh(shapes.table_top.geometry, shapes.table_top.material);
// // top1.position.set(0,0,0);

// // const leg1 = new THREE.Mesh(shapes.table_leg.geometry, shapes.table_leg.material);
// // leg1.position.set(-6,-3,-2);

// // const leg2 = new THREE.Mesh(shapes.table_leg.geometry, shapes.table_leg.material);
// // leg2.position.set(-6,-3,2);

// // const leg3 = new THREE.Mesh(shapes.table_leg.geometry, shapes.table_leg.material);
// // leg3.position.set(6,-3,2);

// // const leg4 = new THREE.Mesh(shapes.table_leg.geometry, shapes.table_leg.material);
// // leg4.position.set(6,-3,-2);

// // table.add(top1);
// // table.add(leg1);
// // table.add(leg2);
// // table.add(leg3);
// // table.add(leg4);

// // scene.add(table);

// //scene.add(shapes.ground);

// import * as THREE from 'three';
// import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
// import { GUI } from 'https://cdn.skypack.dev/dat.gui';
// import download from 'downloadjs';

// const trees = [];

// const gui = new GUI();
// const positionFolder = gui.addFolder('Trees Position');

// const obj = {
//     createJson: function () {
//         trees.forEach((tree) => tree.createJsonFile());
//     },
// };
// gui.add(obj, 'createJson').name('Create JSON');

// export class Tree {
//     constructor(scene, x, y, z, trunkTexturePath, leavesTexturePath) {
//         this.scene = scene;
//         this.x = x;
//         this.y = y;
//         this.z = z;
//         this.trunkTexturePath = trunkTexturePath;
//         this.leavesTexturePath = leavesTexturePath;
//         this.tree = null;
//         this.loadTree();
//     }

//     test() {
//         console.log('test');
//     }

//     async loadTree() {
//         const fbxLoader = new FBXLoader();

//         await new Promise((resolve) => {
//             fbxLoader.load(
//                 'models/Coniferous_Trees/Tree_Spruce_small_02.fbx',
//                 (object) => {
//                     object.traverse((child) => {
//                         if (child.isMesh) {
//                             const mesh = child;

//                             if (mesh.material.name.includes('Trunk')) {
//                                 const trunkTexture = new THREE.TextureLoader().load(this.trunkTexturePath);
//                                 trunkTexture.wrapS = THREE.RepeatWrapping;
//                                 trunkTexture.wrapT = THREE.RepeatWrapping;
//                                 mesh.material.map = trunkTexture;
//                             } else if (mesh.material.name.includes('Leaves')) {
//                                 const leavesTexture = new THREE.TextureLoader().load(this.leavesTexturePath);
//                                 leavesTexture.wrapS = THREE.RepeatWrapping;
//                                 leavesTexture.wrapT = THREE.RepeatWrapping;
//                                 mesh.material.map = leavesTexture;
//                             }
//                         }
//                     });

//                     object.scale.set(1, 1, 1);
//                     object.position.set(this.x, this.y, this.z);
//                     this.tree = object;
//                     this.scene.add(object);
//                     trees.push(this);
//                     resolve();
//                     this.addGUIControls(object);
//                     this.test();
//                 },
//                 (xhr) => {
//                     console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
//                 },
//                 (error) => {
//                     console.log(error);
//                 }
//             );
//         });
//     }

//     addGUIControls(object) {
//         const singleTree = positionFolder.addFolder(`Tree${trees.length}`);
//         singleTree.add(object.position, 'x', -250.0, 250.0).name('X');
//         singleTree.add(object.position, 'y', -5.0, 50.0).name('Y');
//         singleTree.add(object.position, 'z', -250.0, 250.0).name('Z');

//         gui.open();
//     }

//     createJsonFile() {
//         const jsonContent = JSON.stringify(trees.map((tree) => tree.tree.position));
//         download(jsonContent, 'trees_positions.json', 'application/json');
//     }
// }
