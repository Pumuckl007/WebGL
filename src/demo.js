// Global scene object
var scene;

// Global camera object
var camera;
var models = new Array(Math.pow(2, 32)-1);
var callbacks = new Array(Math.pow(2, 32)-1);
var ground;
var block_material;
var objectGeometry;

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
  scene.setGravity(new THREE.Vector3( 0, -60, 0 ));


  camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.05, 1000);
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

  

  // by 1.5 on the x axis and by 4 on the z axis and add the mesh to the scene.
  fiter = PinaCollada('fighterMrk1', 1, 0, 1, true);
  callbacks[0] = function(model, geometry){
    fiter = model;
    fiter.name = "ground";
  }
  var none = PinaCollada('fighterMrk1', 1, 1, 0, false);
  callbacks[1] = function(model, geometry){
    objectGeometry = geometry;
  }
  var groundGeometry = new THREE.CubeGeometry(500,30,500);
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
  ground.position.y = -25;
  ground.name = "ground";
  scene.add(ground);
  generate();
  var intersect_plane = new THREE.Mesh(
    new THREE.PlaneGeometry( 150, 150 ),
    new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })
  );
  intersect_plane.rotation.x = Math.PI / -2;
  scene.add( intersect_plane );
  var ambientLight = new THREE.AmbientLight(0x202020);
  scene.add(ambientLight);
}
function PinaCollada(modelname, scale, index, subdivision, shouldAdd) {
  var manager = new THREE.LoadingManager();
  var loader = new THREE.OBJLoader(manager);
  var localObject;
  loader.load( '../models/'+modelname+'.obj', function colladaReady( object ) {
    object2 = object;
    var geometry = object[1][0];

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
    if(shouldAdd)
      scene.add( mesh );
    mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
    mesh.updateMatrix();
    models[index] = mesh;
    callback(index, mesh, geometry);
  } );
  return localObject;
}
 var k = 0, l = 0;
 function renderScene(){
  if(fiter != null && rotate){
      k += 0.02;
    fiter.rotation.y = k;
  }
  scene.simulate();
  renderer.render(scene, camera);
}
function callback(index, object, geometry){
  callbacks[index](object, geometry);
}
function reset(){
  for(var i = 1; i<scene.__objectsAdded.length; i++){
    if(scene.__objectsAdded[i].name !== "ground"){
      scene.remove(scene.__objectsAdded[i]);
    }
  }
  for(var i = 1; i<scene.__objects.length; i++){
    if(scene.__objects[i].name !== "ground"){
      scene.remove(scene.__objects[i]);
    }
  }
  generate();
  return true;
}
function generate(){
  for(var i = 0; i<5; i++){
    for(var h = 0; h<5; h++){
      for(var o = 0; o<5; o++){
        var boxg = new THREE.CubeGeometry(2,2,2);
        boxg.computeFaceNormals();
        objectMat = Physijs.createMaterial(
          new THREE.MeshLambertMaterial({color: '#1166bb', emissive: '#111111'}),
          .4, // medium friction
          .4 // medium restitution
        );
        obj = new Physijs.BoxMesh( boxg, objectMat );
        obj.position.x = -5 + i*2;
        obj.position.y = -8 + o*2;
        obj.position.z = -5 + h*2;
        obj.receiveShadow = true;
        obj.castShadow = true;
        scene.add( obj );
      }
    }
  }
}
function loadShader(url) {
  var req = new XMLHttpRequest();
  req.open("GET", url, false);
  req.send(null);
  return (req.status == 200) ? req.responseText : null;
};