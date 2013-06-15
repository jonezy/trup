var assert = require('assert');
var trup  = require('../bin/trup');

describe("trup cli", function() {
  it("it should have an update command", function() {
   var expected = "update"; 
   var actual = "";
   for(var c in trup.commands) {
     if(c === "update")
       actual = c;
   }
   assert.equal(expected,actual);
  });

});
