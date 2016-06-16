var assert = require('assert');
var memdb = require('../lib/memdb');

describe('memdb', function () {
    // Hooks
    beforeEach(function () {
        memdb.clear();
    });

    describe('.save(doc)', function () {
        it('should save the document', function () {
            var pet = { name: 'Tobi' };
            memdb.save(pet);
            var ret = memdb.first({ name: 'Tobi' });
            assert(ret == pet);
        })
    });

    describe('.save(doc, cb) with async', function () { // 测试异步函数
        it('should save the document', function () {
            var pet = { name: 'Tobi' };
            memdb.save(pet, function (done) {
                var ret = memdb.first({ name: 'Tobi' });
                assert(ret == pet);
                done(); //告诉Mocha你已经完成这个测试用例了
            });
        })
    });

    describe('.first(obj)', function () {
        it('should return the first matching doc', function () {
            var tobi = { name: 'Tobi' };
            var loki = { name: 'Loki' };

            memdb.save(tobi);
            memdb.save(loki);

            var ret = memdb.first({ name: 'Tobi' });
            assert(ret == tobi);

            ret = memdb.first({ name: 'Loki' });
            assert(ret == loki);
        });
    });

    it('should return null when no doc matches', function () {
        var ret = memdb.first({ name: 'Manny' });
        assert(ret == null);
    });
});


// type `mocha` to run