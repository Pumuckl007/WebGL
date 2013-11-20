// Global scene object
var scene;

// Global camera object
var camera;
var models = new Array(Math.pow(2, 32)-1);
var callbacks = new Array(Math.pow(2, 32)-1);
var light1;
var object2;
var ground;
var dynamicsWorld;

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
  scene = new THREE.Scene();


var collision_config = new Bullet.CollisionConfiguration();
var dispatcher = new Bullet.Dispatcher(collision_config),
  worldAabbMin = new Vecmath.Vec3(-10000, -10000, -10000),
  worldAabbMax = new Vecmath.Vec3(10000, 10000, 10000);
        
var overlappingPairCache = new Bullet.BroadphaseInterface(
  worldAabbMin, worldAabbMax, 0xfffe, 0xffff, 16384, null),
  constraintSolver = new Bullet.ConstraintSolver();

dynamicsWorld = new Bullet.CollisionWorld(
  dispatcher, overlappingPairCache, constraintSolver, collision_config);
  dynamicsWorld.setGravity(new Vecmath.Vec3(0, -30, 0));


  camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.05, 300);
  camera.position.set(0, 0, 10);
  camera.rotation.order = "YXZ";
  camera.lookAt(scene.position);
  scene.add(camera);

  // by 1.5 on the x axis and by 4 on the z axis and add the mesh to the scene.
  fiter = PinaCollada('fighterMrk1', 1, 0, 1);
  callbacks[0] = function(model){
    fiter = model;
  }
  var groundShape = new Bullet.BoxShape(new Vecmath.Vec3(200, 10, 200));
        
  var groundTransform = new Bullet.Transform();
        
  groundTransform.setIdentity();
  
  groundTransform.origin.set3(0,-25,0);
  
  var localInertia = new Vecmath.Vec3(0,0,0);
  
  var cInfo = new Bullet.RigidBodyConstructionInfo(0, null, groundShape, localInertia);
  
  var body = new Bullet.RigidBody(cInfo);
  
  body.setWorldTransform(groundTransform);
  
  dynamicsWorld.addRigidBody(body);

  var groundGeometry = new THREE.CubeGeometry(200,10,200);
  groundGeometry.computeFaceNormals();
  var groundMaterial = new THREE.MeshPhongMaterial({color: 0xff0000});
  groundMaterial.bumpMap    = THREE.ImageUtils.loadTexture('../textures/terrain.png')
  groundMaterial.bumpScale = 20;
  ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.castShadow = true;
  ground.receiveShadow = true;
  console.log(ground);
  ground.position.y = -25;
  scene.add(ground);

  //add light
  light1 = new THREE.DirectionalLight(0xffffff);
  light1.position.set(10, 10, 10).normalize();
  light1.castShadow = true;
  light1.shadowDarkness = 20;
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
 var k = 0;
 var renderObjects = new Array(Math.pow(2,32) -1);
 var physicsObjects = new Array(Math.pow(2,32) -1);
 function renderScene(){
  if(fiter != null && rotate){
      k += 0.02;
    fiter.rotation.y = k;
  }
  var t1=new Date().getTime();
        
  var ms = (t1 - t0);
  t0 = t1;
  if(k%1 = 0){
    var groundShape = new Bullet.BoxShape(new Vecmath.Vec3(4, 1, 4));
    var groundTransform = new Bullet.Transform();
    groundTransform.setIdentity();
    groundTransform.origin.set3(0, y0, 0);
    var localInertia = new Vecmath.Vec3(0, 0, 0);
    var mass = 2;
    groundShape.calculateLocalInertia(mass, localInertia);
    var cInfo = new Bullet.RigidBodyConstructionInfo(mass, null, groundShape, localInertia);
    cInfo.linearDamping = 0.5;
    cInfo.angularDamping = 0.5;
    var body = new Bullet.RigidBody(cInfo);
    body.setWorldTransform(groundTransform);
    dynamicsWorld.addRigidBody(body);
    var groundGeometry = new THREE.CubeGeometry(4,1,4);
    groundGeometry.computeFaceNormals();
    var groundMaterial = new THREE.MeshPhongMaterial({color: 0xff0000});
    ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.castShadow = true;
    ground.receiveShadow = true;
    ground.position.y = 0;
    scene.add(ground);
    console.log(body);
  }
  dynamicsWorld.stepSimulation1(ms / 1000);
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