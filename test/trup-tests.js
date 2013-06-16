
var assert = require('assert');
var fs = require('fs-extra');
var path = require('path');
var trup = require('../lib/trup');
var testRoot = path.join(process.cwd(), '/test');
var out = path.join(testRoot, '/out');
var customOut = '/_save';

describe("trup", function() {
  describe("with default arguments", function() {
    var worker;
    beforeEach(function(done) {
      worker = new trup({'dir': testRoot}, done);
    });

    afterEach(function(done) {
      fs.remove(out, function(err) {
        if(err) console.log(err);
        done();
      });
    });

    it("should create without error", function() {
      assert.doesNotThrow(function() { var worker = new trup(); },  Error);
    });

    it("should create the out directory", function(done) {
      fs.exists(out, function(exists) {
        assert(exists, 'the default out directory was not created');
        done();
      });
    });

    it("should have urls property", function() {
      assert(worker.urls, 'should have urls property');
    });

    it("should have routeList url property", function() {
      assert(worker.urls.routeList, 'should have routeList urls property');
    });

    it("should have routeConfig url property", function() {
      assert(worker.urls.routeConfig, 'should have routeConfig urls property');
    });
  });

  describe("with custom opts", function() {
    var worker;
    beforeEach(function(done) {
      worker = new trup({'agency':'guelph',"out": customOut, 'dir': testRoot}, done);
    });

    afterEach(function(done) {
      fs.remove(path.join(testRoot, customOut), function(err) {
        if(err) console.log(err);
        done();
      });
    });

    it("should create the custom out directory", function(done) {
      fs.exists(path.join(testRoot, customOut), function(exists) {
        assert(exists, 'the custom out directory was not created');
        done();
      });
    });

    it("should have custom directory", function() {
      assert(worker.dir, testRoot);

    });
    it("should have custom agency", function() {
      assert(worker.agency, 'guelph');

    });
  });
});
