
init();

var pitch = 0;
var yaw = 0;
var rotate = false;

function init(){
  document.addEventListener('keydown', function(event) {
      if(event.keyCode == 65){ 
        var corretion = (Math.PI/2);
        var x = 3 * Math.cos(-(camera.rotation.y + Math.PI/2) + corretion) * Math.sin(-(camera.rotation.z) + corretion);
        var z = 3 * Math.sin(-(camera.rotation.y + Math.PI/2) + corretion) * Math.sin(-(camera.rotation.z) + corretion);
        var y = 3 * Math.cos(-(camera.rotation.z) + corretion);
        camera.position.x -= x;
        camera.position.y -= y;
        camera.position.z -= z;
        document.getElementById('engien').play();
      }
      if(event.keyCode == 68) {
        var corretion = (Math.PI/2);
        var x = 3 * Math.cos(-(camera.rotation.y + Math.PI/2) + corretion) * Math.sin(-(camera.rotation.z) + corretion);
        var z = 3 * Math.sin(-(camera.rotation.y + Math.PI/2) + corretion) * Math.sin(-(camera.rotation.z) + corretion);
        var y = 3 * Math.cos(-(camera.rotation.z) + corretion);
        camera.position.x += x;
        camera.position.y += y;
        camera.position.z += z;
        document.getElementById('engien').play();
      }
      if(event.keyCode == 87) {
        var corretion = (Math.PI/2);
        var x = 3 * Math.cos(-(camera.rotation.y) + corretion) * Math.sin(-(camera.rotation.x) + corretion);
        var z = 3 * Math.sin(-(camera.rotation.y) + corretion) * Math.sin(-(camera.rotation.x) + corretion);
        var y = 3 * Math.cos((camera.rotation.x) + corretion);
        camera.position.x -= x;
        camera.position.y -= y;
        camera.position.z -= z;
        document.getElementById('engien').play();
      }
      if(event.keyCode == 83) {
        var corretion = (Math.PI/2);
        var x = 3 * Math.cos(-(camera.rotation.y) + corretion) * Math.sin(-(camera.rotation.x) + corretion);
        var z = 3 * Math.sin(-(camera.rotation.y) + corretion) * Math.sin(-(camera.rotation.x) + corretion);
        var y = 3 * Math.cos((camera.rotation.x) + corretion);
        camera.position.x += x;
        camera.position.y += y;
        camera.position.z += z;
        document.getElementById('engien').play();
      }
      if(event.keyCode === 70){
        objectMat = Physijs.createMaterial(
          new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( '../textures/terrain.png' ), ambient: 0xFFFFFF }),
          .4, // medium friction
          .4 // medium restitution
        );
        obj = new Physijs.ConvexMesh( objectGeometry, objectMat );
        obj.mass = 2000;
        obj.position.y = 0;
        obj.receiveShadow = true;
        obj.castShadow = true;
        obj.position.set(camera.position.x, camera.position.y, camera.position.z);
        obj.rotation.order = "YXZ";
        obj.rotation.y = camera.rotation.y + Math.PI/2;
        obj.rotation.z = camera.rotation.x;
        scene.add( obj );
        var corretion = (Math.PI/2);
        var x = -1 * Math.cos(-(camera.rotation.y) + corretion) * Math.sin(-(camera.rotation.x) + corretion);
        var z = -1 * Math.sin(-(camera.rotation.y) + corretion) * Math.sin(-(camera.rotation.x) + corretion);
        var y = Math.cos((camera.rotation.x) + corretion);
        var vec = new THREE.Vector3(x * 100,-y * 100,z * 100);
        obj.setLinearVelocity(vec);
        obj.setDamping(0.001, 0.1);
      }
      if(event.keyCode === 82){
        reset();
      }
    });
    document.addEventListener("click", function (e) {
    document.getElementById("WebGLCanvas").requestPointerLock = document.getElementById("WebGLCanvas").requestPointerLock ||
    document.getElementById("WebGLCanvas").mozRequestPointerLock ||
    document.getElementById("WebGLCanvas").webkitRequestPointerLock;
    document.getElementById("WebGLCanvas").requestPointerLock();
    rotate = !rotate;
  });
  document.addEventListener("mousemove", this.mouseMove, false);
  window.onresize = function(event) {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    // Set the renderers size to the content areas size
    renderer.setSize(canvasWidth, canvasHeight);
    var pos = camera.position;
    var rot = camera.rotation;
    camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 300);
    camera.position = pos;
    camera.rotation = rot;
  }
}
function mouseMove(e){
  var sensetivity = 0.02;
  var x = e.movementX ||
  e.mozMovementX          ||
  e.webkitMovementX       ||
  0,
  y = e.movementY ||
  e.mozMovementY      ||
  e.webkitMovementY   ||
  0;
  x = x * (Math.PI/180);
  y = y * (Math.PI/180);
  var dy = y * Math.cos(camera.rotation.z);
  var dx = x * Math.cos(camera.rotation.z);
  pitch -= y * sensetivity;
  yaw -= x * sensetivity;
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
}
function exitPointerLock(){
  document.exitPointerLock = document.exitPointerLock ||
  document.mozExitPointerLock ||
  document.webkitExitPointerLock;
  document.exitPointerLock();
}
function requestPointerLock(){
  document.getElementById("WebGLCanvas").requestPointerLock = document.getElementById("WebGLCanvas").requestPointerLock ||
  document.getElementById("WebGLCanvas").mozRequestPointerLock ||
  document.getElementById("WebGLCanvas").webkitRequestPointerLock;
  document.getElementById("WebGLCanvas").requestPointerLock();
}
