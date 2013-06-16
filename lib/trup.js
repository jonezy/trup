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
    function(cb){
      self.saveData(cb);
    },
    function(cb) {
      cb && cb();
    }
  ], function(err, status) {
    if(err) console.log(err);
  });
};

Trup.prototype.getRoutes = function(cb) {
  writeMessage('Downloading routes');

  var self = this;
  this.executeRequest(this.urls.routeList, function(data) {
    self.routeList = data;
    cb(null);
  });
};

Trup.prototype.getStops = function(cb) {
  writeMessage('Downloading stops, this may take a while');

  var self = this;
  var full = {
    "routes": []
  };
  async.forEach(this.routeList.route, function(r, next) {
    var url = self.urls.routeConfig.replace('{route}', r.tag);
    self.executeRequest(url, function(data) {
      var out = path.join( self.out, r.tag + '.json' );
      var combined = {
        'title': r.title,
        'tag': r.tag,
        'stops': data.route.stop
      };
      full.routes.push(combined);
      next();
    });
  },function(err) {
    self.finalData = full;
    cb(null);
  });
};

Trup.prototype.saveData = function(cb) {
  writeMessage('Saving data');
  var out = path.join( this.out, 'all.json' );
  fs.outputJson(out, this.finalData, function(err) {
    if(err) cb(err);
    writeMessage('Data saved to ' + out);
    cb(null);
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

function writeMessage(msg) {
  console.log('   \033[36m '+ msg + ' \033[0m');
}
