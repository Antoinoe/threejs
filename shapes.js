import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

const ground_geo = new THREE.BoxGeometry(100,2,100);
const ground_mat = new THREE.MeshPhysicalMaterial( { color: 0xffffff } );
const ground = new THREE.Mesh(ground_geo, ground_mat);
ground.position.set(0,0,0)
export{ground}

const sphere1_geo = new THREE.SphereGeometry( 5, 32, 32 );
const sphere1_mat = new THREE.MeshPhysicalMaterial( { color: 0xffff00 } );
const sphere1 = new THREE.Mesh(sphere1_geo, sphere1_mat);
sphere1.position.set(0,6,0)
export{sphere1}

const sphere2_geo = new THREE.SphereGeometry( 5, 32, 32 );
const sphere2_mat = new THREE.MeshPhysicalMaterial( { color: 0xff00 } );
const sphere2 = new THREE.Mesh(sphere2_geo, sphere2_mat);
sphere2.position.set(0,6,20)
export{sphere2};


const table_leg_geo = new THREE.BoxGeometry(1,5,1);
const texture = textureLoader.load('./img/wood1.jpeg');
const table_leg_mat = new THREE.MeshPhysicalMaterial( {
    map: texture, // Attacher la texture au matériau
    metalness: 0.5, // Réglage de la métallicité du matériau
    roughness: 0.7, // Réglage de la rugosité du matériau
    clearcoat: 1.0, // Épaisseur du revêtement clair
    clearcoatRoughness: 0.1, // Rugosité du revêtement clair
    reflectivity: 1.0, // Réflectivité du matériau
    transmission: 0.0, // Transmission du matériau (0.0 signifie totalement opaque)
  });
const table_leg = new THREE.Mesh(table_leg_geo, table_leg_mat);
export{table_leg}

const table_top_geo = new THREE.BoxGeometry(15,1,5);
const table_top_mat = new THREE.MeshPhysicalMaterial( {
    clearcoat: 0.3,
    clearcoatRoughness: 0.25,
    color: 0xffff00,
    envMap: textureLoader.load( './img/wood1.jpeg' ),
    envMapIntensity: 1.0,
    ior: 1.25,
    iridescence: 0.8,
    metalness: 0,
    roughness: 0.2,
    thickness: 5.0,
    transmission: 1.0,
} );
const table_top = new THREE.Mesh(table_top_geo, table_top_mat);
export{table_top}

export const shapes= {
    table_leg_geo,table_top_geo
}