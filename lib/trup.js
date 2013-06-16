var fs = require('fs-extra');
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

Trup.prototype.baseUrl = "http://webservices.nextbus.com/service/publicJSONFeed?";

Trup.prototype.urls = {
  "routeList": this.baseUrl + "command=routeList&a=ttc",
  "routeConfig": this.baseUrl +"command=routeConfig&a=ttc&r={route}" // {route} is a valid route id ex: 501, 76 etc
};
