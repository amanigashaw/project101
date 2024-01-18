//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";


function createModel(modelName, lights, cameraPosition, containerId, texturePaths) {
  function changeTexture(object, texturePath) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(texturePath, function () {
        object.traverse((child) => {
            if (child.isMesh) {
                // Check if the material has a map property
                if (child.material.map) {
                    child.material.map.dispose();
                }

                // Apply the new texture
                child.material.map = texture;
                child.material.needsUpdate = true;
            }
        });
    });
}


//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(cameraPosition);
//Keep the 3D object on a global variable so we can access it later
let object;
let currentTextureIndex = 0;

//OrbitControls allow the camera to move around the scene
let controls;

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `models/${modelName}/model.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);


    changeTexture(object, texturePaths[currentTextureIndex]);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);


const changeTextureButton1 = document.getElementById("changeTextureButton1");
const changeTextureButton2 = document.getElementById("changeTextureButton2");
changeTextureButton1.addEventListener("click", () => {
  currentTextureIndex = 1;
  changeTexture(object, texturePaths[currentTextureIndex]);
});

changeTextureButton2.addEventListener("click", () => {
  currentTextureIndex = 0;
  changeTexture(object, texturePaths[currentTextureIndex]);
});


//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true , antialias: true}); //Alpha: true allows for the transparent   ground
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
const container = document.getElementById(containerId);
container.appendChild(renderer.domElement);

lights.forEach(light => {
  // Clone the light for each scene
  const clonedLight = light.clone();
  scene.add(clonedLight);
});

//Set how far the camera will be from the 3D model
// camera.position.z =  1;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1);

ambientLight.castShadow = true;
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.enableDamping = false;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 2;



//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement
  if (object) {
            object.rotation.y += 0.01;
        }
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});



//Start the 3D rendering
animate();
}

// Define lights
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(0, 2, -4);
topLight.castShadow = true;

const ambientLight = new THREE.DirectionalLight(0xffffff, 1);
ambientLight.position.set(0, -2, -2);
ambientLight.castShadow = true;

const addedlight = new THREE.DirectionalLight(0xffffff, 1);
ambientLight.position.set(0, 4, 2);
ambientLight.castShadow = true;


// Define camera positions
const cameraPosition1 = new THREE.Vector3(0, 0, 1.5);
const cameraPosition2 = new THREE.Vector3(0, 0, 1.5);
const cameraPosition3 = new THREE.Vector3(0, 0, 1);
const cameraPosition4 = new THREE.Vector3(0, 0, 1.5);


// Call the function for each model with different lights, camera positions, and container IDs
const texturePaths1 = ["models/pants/black.webp", "models/pants/white.webp"];
const texturePaths2 = ["models/longsleeve/black.webp", "models/longsleeve/white.webp"];
const texturePaths3 = ["models/shorts/black.webp", "models/shorts/white.webp"];
const texturePaths4 = ["models/tshirt/black.webp", "models/tshirt/white.webp"];

createModel('pants', [topLight, ambientLight], cameraPosition1, 'container1', texturePaths1);
createModel('longsleeve', [topLight, ambientLight], cameraPosition2, 'container2', texturePaths2);
createModel('shorts', [topLight, ambientLight], cameraPosition3, 'container3', texturePaths3);
createModel('tshirt', [topLight, ambientLight], cameraPosition4, 'container4', texturePaths4);







document.addEventListener('touchmove', function (e) {
  e.preventDefault();
}, { passive: false });

document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     
                                                                         
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                
                                                                         
function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        if (xDiff > 0) {
            /* right swipe */ 
        } else {
            /* left swipe */
        }                       
    } else {
        if (yDiff > 0) {
            // Scroll up the desired div
            var targetDiv = document.getElementById('containerMain'); // Replace 'yourDivId' with the actual ID of your div
            if (targetDiv) {
                targetDiv.scrollTop += window.innerHeight;
            }
        } else { 
            // Scroll down the desired div
            var targetDiv = document.getElementById('containerMain'); // Replace 'yourDivId' with the actual ID of your div
            if (targetDiv) {
                targetDiv.scrollTop -= window.innerHeight;
            }
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};
