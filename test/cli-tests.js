var assert = require('assert');
var trup  = require('../bin/trup');

describe("trup cli", function() {
  it("it should have an update command", function() {
   var expected = "update"; 
   var actual = "";
   for(var i = 0; i < trup.commands.length;i++) {
     if(trup.commands[i].name === expected)
       actual = trup.commands[i].name;
   }
   assert.equal(expected,actual);
  });
});
