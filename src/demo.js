// Global scene object
var scene;

// Global camera object
var camera;
var models = new Array(Math.pow(2, 32)-1);
var callbacks = new Array(Math.pow(2, 32)-1);
var ground;
var block_material;

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
  physics_stats = null;
  // Check whether the browser supports WebGL. If so, instantiate the hardware accelerated
  // WebGL renderer. For antialiasing, we have to enable it. The canvas renderer uses
  // antialiasing by default.
  // The approach of multiplse renderers is quite nice, because your scene can also be
  // viewed in browsers, which don't support WebGL. The limitations of the canvas renderer
  // in contrast to the WebGL renderer will be explained in the tutorials, when there is a
  // difference.
    renderer = new THREE.WebGLRenderer({antialias:true});

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
  scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });
  scene.setGravity(new THREE.Vector3( 0, -30, 0 ));


  camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.05, 300);
  camera.position.set(0, 0, 10);
  camera.rotation.order = "YXZ";
  camera.lookAt(scene.position);
  scene.add(camera);
  // directional light
  var dir_light = new THREE.DirectionalLight( 0xFFFFFF );
  dir_light.position.set( 20, 30, -5 );
  dir_light.target.position.copy( scene.position );
  dir_light.castShadow = true;
  dir_light.shadowCameraLeft = -30;
  dir_light.shadowCameraTop = -30;
  dir_light.shadowCameraRight = 30;
  dir_light.shadowCameraBottom = 30;
  dir_light.shadowCameraNear = 20;
  dir_light.shadowCameraFar = 200;
  dir_light.shadowBias = -.001
  dir_light.shadowMapWidth = dir_light.shadowMapHeight = 2048;
  dir_light.shadowDarkness = .5;
  scene.add( dir_light );

  block_material = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( '../textures/terrain.png' ), ambient: 0xFFFFFF }),
    .4, // medium friction
    .4 // medium restitution
  );


  // by 1.5 on the x axis and by 4 on the z axis and add the mesh to the scene.
  fiter = PinaCollada('fighterMrk1', 1, 0, 1);
  callbacks[0] = function(model){
    fiter = model;
  }
  var groundGeometry = new THREE.CubeGeometry(200,10,200);
  groundGeometry.computeFaceNormals();
  var groundMaterial = new Physijs.createMaterial(new THREE.MeshPhongMaterial({color: 0xff0000}),
    .9,// hight friction
    .2); // low resitution
  groundMaterial.bumpMap    = THREE.ImageUtils.loadTexture('../textures/terrain.png')
  groundMaterial.bumpScale = 20;
  ground = new Physijs.BoxMesh(groundGeometry, groundMaterial,
    0, //mass
    { restitution: .2, friction: .8 });
  ground.castShadow = true;
  ground.receiveShadow = true;
  console.log(ground);
  ground.position.y = -25;
  scene.add(ground);
  var intersect_plane = new THREE.Mesh(
    new THREE.PlaneGeometry( 150, 150 ),
    new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })
  );
  intersect_plane.rotation.x = Math.PI / -2;
  scene.add( intersect_plane );
  var ambientLight = new THREE.AmbientLight(0x202020);
  scene.add(ambientLight);
}
function PinaCollada(modelname, scale, index, subdivision) {
  var manager = new THREE.LoadingManager();
  var loader = new THREE.OBJLoader(manager);
  var localObject;
  loader.load( '../models/'+modelname+'.obj', function colladaReady( object ) {
    object2 = object;
    var geometry = object[1][0];
    console.log(geometry);

    var modifier = new THREE.SubdivisionModifier(subdivision);
    modifier.modify( geometry );
    var texture = THREE.ImageUtils.loadTexture('../textures/'+modelname+".png");
    var material = new THREE.MeshPhongMaterial({
        // intermediate
        color: '#aaaaaa',
        // dark
        emissive: '#111111',
        // wireframe: true,
        map:texture
      });
    material.specularMap    = THREE.ImageUtils.loadTexture('../textures/'+modelname+"spec.png");
    material.specular  = new THREE.Color('grey');
    material.shading = THREE.SmoothShading;
    var mesh = new THREE.Mesh( geometry, material);
    scene.add( mesh );
    mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
    mesh.updateMatrix();
    models[index] = mesh;
    callback(index, mesh);
  } );
  return localObject;
}
 var k = 0, l = 0;
 function renderScene(){
  if(fiter != null && rotate){
      k += 0.02;
    fiter.rotation.y = k;
  }
  l++;
  if(l === 100){
    l = 0;
    block_geometry = new THREE.CubeGeometry( 4, 4, 4 );
    block = new Physijs.BoxMesh( block_geometry, block_material );
    block.position.y = 0;
    block.receiveShadow = true;
    block.castShadow = true;
    scene.add( block );
  }
  scene.simulate();
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