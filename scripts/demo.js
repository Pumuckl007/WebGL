// Global scene object
var scene;

// Global camera object
var camera;
var models = new Array(Math.pow(2, 32)-1);
var callbacks = new Array(Math.pow(2, 32)-1);
var light1;
var object2;

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
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;

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
  camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.05, 100);
  camera.position.set(0, 0, 10);
  camera.rotation.order = "YXZ";
  camera.lookAt(scene.position);
  scene.add(camera);

  // by 1.5 on the x axis and by 4 on the z axis and add the mesh to the scene.
  fiter = PinaCollada('fiterMrk1', 1, 0, 2);
  callbacks[0] = function(model){
    fiter = model;
  }

  var groundGeometry = new THREE.Geometry();
  groundGeometry.vertices.push(new THREE.Vector3(-100,-1,-100));
  groundGeometry.vertices.push(new THREE.Vector3(100,-1,-100));
  groundGeometry.vertices.push(new THREE.Vector3(-100,-1,100));
  groundGeometry.vertices.push(new THREE.Vector3(100,-1,100));
  groundGeometry.faces.push(new THREE.Face3(0,2,1));
  groundGeometry.faces.push(new THREE.Face3(2,3,1));
  groundGeometry.computeFaceNormals();
  var groundMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
  var ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.castShadow = true;
  ground.receiveShadow = true;
  scene.add(ground);

  //add light
  light1 = new THREE.DirectionalLight(0xffffff);
  light1.position.set(10, 10, 10).normalize();
  light1.castShadow = true;
  light1.shadowDarkness = 0.5;
  light1.shadowCameraVisible = true;
  light1.color.setHex(0xEDF4F5);
  scene.add(light1);
  var ambientLight = new THREE.AmbientLight(0x202020);
  scene.add(ambientLight);
}
function PinaCollada(modelname, scale, index, subdivision) {
  var manager = new THREE.LoadingManager();
  var loader = new THREE.OBJLoader(manager);
  var localObject;
  loader.load( 'models/'+modelname+'.obj', function colladaReady( object ) {
    scene.add(object[0]);
    object2 = object;
    var geometry = object[1][0];
    console.log(geometry);

    var modifier = new THREE.SubdivisionModifier(subdivision);

    modifier.modify( geometry );
    var texture = THREE.ImageUtils.loadTexture('textures/'+modelname+".png");
    var material = new THREE.MeshBasicMaterial({map: texture});

    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
    mesh.updateMatrix();
    models[index] = mesh;
    callback(index, mesh);
  } );
  return localObject;
}
 var k = 0;
 function renderScene(){
  k += 0.02;
  if(fiter != null){
    fiter.rotation.y = k;
  }
  renderer.render(scene, camera);
}
function callback(index, object){
  callbacks[index](object);
}
function loadShader(url) {
  var req = new XMLHttpRequest();
  req.open("GET", url, false);
  req.send(null);
  return (req.status == 200) ? req.responseText : null;
};