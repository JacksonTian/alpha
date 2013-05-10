var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

// http://nodejs.org/docs/latest/api/all.json
var api = require('./all.json');
var _ = require('underscore');

var Index = {};

var generate = function (api, pre) {
  _.forEach(api, function (val, key) {
    if (key === 'signatures') {
      return;
    }
    if (typeof val === 'object') {
      _.forEach(val, function (item, index) {
        var _pre = pre.concat([key, index]);
        Index[_pre.join('.')] = item.name;
        generate(item, _pre);
      });
    }
  });
};

generate(api, []);

var map = {};
_.forEach(Index, function (name, index) {
  if (map.hasOwnProperty(name)) {
    map[name].push(index);
  } else {
    map[name] = [index];
  }
});

var keys = Object.keys(map);

var hash = {};

exports.getKey = function (id) {
  return hash[id] || '';
};

exports.access = function (key) {
  var path = key.split('.');
  var index, obj = api;
  var namespace = [];
  while ((index = path.shift())) {
    obj = obj[index];
    if (obj.hasOwnProperty('name')) {
      namespace.push(obj.name);
    }
  }
  obj.path = namespace.join('/');
  obj.hash = crypto.createHash('md5').update(key).digest('hex');
  hash[obj.hash] = key;
  return obj;
};

var filter = function (keyword) {
  return keyword.replace(/\//ig, '\\/').replace(/\(/ig, '\\(').replace(/\)/ig, '\\)');
};

exports.search = function (keyword) {
  var reg = new RegExp(filter(keyword), 'i');
  var filtered = _.filter(keys, function (key) {
    return reg.test(key);
  });

  var ret = {};
  if (filtered.length > 0) {
    var matched;
    var more = [];
    if (filtered.indexOf(keyword) !== -1 && filtered.length > 1) {
      matched = keyword;
      more = filtered.filter(function (val) {
        return val !== keyword;
      });
    } else if (filtered.length === 1) {
      matched = filtered[0];
    }

    if (matched) {
      ret.status = 'MATCHED';
      var searched = map[matched];
      ret.result = searched.map(function (key) {
        return exports.access(key);
      });
      ret.more = more;
    } else {
      ret.status = 'TOO_MATCHED';
      ret.result = filtered;
    }
  } else {
    ret.status = 'UNMATCHED';
    ret.result = '';
  }
  return ret;
};

exports.status = function () {
  var api = require('./all.json');
  return api.modules.map(function (mod) {
    return {name: mod.name, stability: mod.stability};
  }).filter(function (mod) {
    return mod.stability !== undefined && mod.name !== 'module';
  });
};
