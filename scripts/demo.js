// Global scene object
var scene;

// Global camera object
var camera;
var blenderShape;
var light1;

// Initialize the scene
initializeScene();

// Render the scene (map the 3D world to the 2D scene)
function step(timestamp) {
  renderScene();
  requestAnimationFrame(step);
}

requestAnimationFrame(step);
renderScene();

/**
 * Initialze the scene.
 */
function initializeScene(){
  // Check whether the browser supports WebGL. If so, instantiate the hardware accelerated
  // WebGL renderer. For antialiasing, we have to enable it. The canvas renderer uses
  // antialiasing by default.
  // The approach of multiplse renderers is quite nice, because your scene can also be
  // viewed in browsers, which don't support WebGL. The limitations of the canvas renderer
  // in contrast to the WebGL renderer will be explained in the tutorials, when there is a
  // difference.
  if(Detector.webgl){
    renderer = new THREE.WebGLRenderer({antialias:true});

  // If its not supported, instantiate the canvas renderer to support all non WebGL
  // browsers
  } else {
    renderer = new THREE.CanvasRenderer();
  }

  // Set the background color of the renderer to black, with full opacity
  renderer.setClearColor(0x000000, 1);

  // Get the size of the inner window (content area) to create a full size renderer
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  // Set the renderers size to the content areas size
  renderer.setSize(canvasWidth, canvasHeight);

  // Get the DIV element from the HTML document by its ID and append the renderers DOM
  // object to it
  document.getElementById("WebGLCanvas").appendChild(renderer.domElement);

  // Create the scene, in which all objects are stored (e. g. camera, lights,
  // geometries, ...)
  scene = new THREE.Scene();

  // Now that we have a scene, we want to look into it. Therefore we need a camera.
  // Three.js offers three camera types:
  //  - PerspectiveCamera (perspective projection)
  //  - OrthographicCamera (parallel projection)
  //  - CombinedCamera (allows to switch between perspective / parallel projection
  //    during runtime)
  // In this example we create a perspective camera. Parameters for the perspective
  // camera are ...
  // ... field of view (FOV),
  // ... aspect ratio (usually set to the quotient of canvas width to canvas height)
  // ... near and
  // ... far.
  // Near and far define the cliping planes of the view frustum. Three.js provides an
  // example (http://mrdoob.github.com/three.js/examples/
  // -> canvas_camera_orthographic2.html), which allows to play around with these
  // parameters.
  // The camera is moved 10 units towards the z axis to allow looking to the center of
  // the scene.
  // After definition, the camera has to be added to the scene.
  camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100);
  camera.position.set(0, 0, 10);
  camera.lookAt(scene.position);
  scene.add(camera);

  // by 1.5 on the x axis and by 4 on the z axis and add the mesh to the scene.
  window.object1 = PinaCollada('test', 1);
    scene.add(window.object1);

  //add light
  light1 = new THREE.DirectionalLight(0xffffff);
  light1.position.set(1, 1, 1).normalize();
  light1.castShadiw = true;
  light1.color.setHex(0xEDF4F5);
  scene.add(light1);
  var ambientLight = new THREE.AmbientLight(0x202020);
  scene.add(ambientLight);
}
function PinaCollada(modelname, scale) {
    var loader = new THREE.ColladaLoader();
    var localObject;
    loader.options.convertUpAxis = true;
    loader.load( 'models/'+modelname+'.dae', function colladaReady( collada ) {
        scene.add(collada.scene);
        blenderShape = collada.scene;
        localObject = collada.scene;
        localObject.scale.x = localObject.scale.y = localObject.scale.z = scale;
        localObject.updateMatrix();
    } );
    return localObject;
}
/**
 * Render the scene. Map the 3D world to the 2D screen.
 */
 var k = 0;
 function renderScene(){
    k += 0.02;
  if(blenderShape != null)
  blenderShape.rotation.y = -k/20;
  renderer.render(scene, camera);
}