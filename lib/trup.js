var fs = require('fs-extra');
var path = require('path');

exports = module.exports = Trup;
exports.urls = Trup.urls;

var defaults = {
  "out": "./out"
};

function Trup(dir, opts, cb) {
  if(!dir) throw new Error('you must pass in the directory you are working in');

  this.dir = dir;
  this.out = opts && opts.out ? opts.out : defaults.out;
  this.out = path.join(this.dir, this.out);

  var self = this;
  fs.remove(this.out, function(err) {
    console.log('   \033[36mdelete\033[0m : ' + self.out);
     if(err) throw new Error(err);
     fs.mkdirs(self.out, function(err) {
       console.log('   \033[36mcreate\033[0m : ' + self.out);
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
