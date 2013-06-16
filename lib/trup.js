var async = require('async');
var fs = require('fs-extra');
var http = require('http');
var path = require('path');

exports = module.exports = Trup;
exports.urls = Trup.urls;

var defaults = {
  "agency": "ttc",
  "out": "./out",
  "dir": process.cwd()
};

function Trup(opts, cb) {
  this.agency = opts && opts.agency ? opts.agency : defaults.agency;
  this.dir = opts && opts.dir ? opts.dir : defaults.dir;
  this.out = opts && opts.out ? opts.out : defaults.out;
  this.out = path.join(this.dir, this.out);

  init(this.out, cb);
}

function init(out, cb) {
  fs.remove(out, function(err) {
     if(err) throw new Error(err);
     fs.mkdirs(out, function(err) {
       if(err) throw new Error(err);
       cb && cb();
     });
  });
}

Trup.prototype.baseUrl = "webservices.nextbus.com";
Trup.prototype.path = "/service/publicJSONFeed?";
Trup.prototype.urls = {
  "routeList": "command=routeList&a=ttc",
  "routeConfig": "command=routeConfig&a=ttc&r={route}" // {route} is a valid route id ex: 501, 76 etc
};

Trup.prototype.run = function(cb) {
  var self = this;
  async.waterfall([
    function(cb){
      self.getRoutes(cb);
    },
    function(cb){
      self.getStops(cb);
    },
    function(cb) {
      cb && cb();
    }
  ], function(err, status) {
    if(err) console.log(err);
  });
};

Trup.prototype.getRoutes = function(cb) {
console.log('   \033[36m Downloading routes \033[0m');
  var self = this;
  this.executeRequest(this.urls.routeList, function(data) {
    self.routeList = data;
    cb(null);
  });
};

Trup.prototype.getStops = function(cb) {
  console.log('   \033[36m Downloading stops, this may take a while \033[0m');

  var self = this;
  async.forEach(this.routeList.route, function(r) {
    var url = self.urls.routeConfig.replace('{route}', r.tag);
    self.executeRequest(url, function(data) {
      var out = path.join( self.out, r.tag + '.json' );
      var combined = {
        'routeList': r,
        'routeConfig': data
      }
      console.log('Saving ', out);
      fs.outputJson(out, combined, function(err) { cb(err); });
    });
  }, function(err) {
    cb(err);
  });
};

Trup.prototype.executeRequest = function(endPoint, cb) {
  var options = {
    host: this.baseUrl,
    port: 80,
    path: this.path + endPoint,
    method: "GET"
  };

  var data = "";
  var apiReq = http.request(options, function(apiRes) {
    apiRes.setEncoding('utf8');
    apiRes.on('data', function(chunk) {
      data += chunk;
    });
    apiRes.on('end', function() {
      cb && cb(JSON.parse(data));
    });
  }).end();
};
