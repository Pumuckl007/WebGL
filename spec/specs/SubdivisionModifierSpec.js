describe("SubdivisionModifier", function() {
  var modifier;
  beforeEach(function(){
    modifier = new THREE.CatmullClark(1);
  });
  describe("#modify", function() {
    it("generates 8 faces given plane", function() {
      var plane = new THREE.PlaneGeometry();
      modifier.modify(plane);
      expect(plane.faces.length).toEqual(8);
    });
    // it("dose x", function() {
      // var plane = new THREE.PlaneGeometry(1,1);
      // modifier.modify(plane);
      // var face = plane.faces[0];
      // console.log(face);
      // expect(face.a === 0 || face.b === 0 || face.c === 0).toBeTruthy();
    // });
  });
});