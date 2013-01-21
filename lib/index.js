var fs = require('fs');
var path = require('path');

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
  obj.path = namespace.join('.');
  return obj;
};

exports.search = function (keyword) {
  var filtered = _.filter(keys, function (key) {
    return key.indexOf(keyword) !== -1;
  });

  var ret = {};
  if (filtered.length > 0) {
    var matched;
    if (filtered.indexOf(keyword) !== -1) {
      matched = keyword;
    } else if (filtered.length === 1) {
      matched = filtered[0];
    }

    if (matched) {
      ret.status = 'MATCHED';
      var searched = map[matched];
      ret.result = searched.map(function (key) {
        return exports.access(key);
      });
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
