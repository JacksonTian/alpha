var api = require('../');

describe('index', function () {
  describe('search', function () {
    it('should ok', function () {
      var result = api.search('module');
      result.status.should.be.equal('MATCHED');
      result.result.should.have.length(4);
      result.should.have.property('more');
      result.more.should.have.length(6);
      result.result.forEach(function (item) {
        item.should.have.property('textRaw');
        item.should.have.property('name', 'module');
        item.should.have.property('type');
        item.should.have.property('desc');
        item.should.have.property('path');
      });
    });

    it('should UNMATCHED', function () {
      var result = api.search('hehe');
      result.status.should.be.equal('UNMATCHED');
      result.result.should.have.length(0);
      result.should.not.have.property('more');
    });

    it('should not throw', function () {
      (function(){
        var result = api.search('/:8-)');
        result.status.should.be.equal('UNMATCHED');
        result.result.should.have.length(0);
        result.should.not.have.property('more');
      }).should.not.throw();

      (function(){
        var result = api.search('/');
        result.status.should.be.equal('UNMATCHED');
        result.result.should.have.length(0);
        result.should.not.have.property('more');
      }).should.not.throw();
    });
  });
});

