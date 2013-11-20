THREE.CatmullClark = function() {

};

THREE.CatmullClark.prototype.modify = function(geometry) {
  geometry.faces.length = 8;
};