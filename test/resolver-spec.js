var assert = require('assert'),
    sinon = require('sinon'),
    facade = require('../src/backend/facade'),
    resolver = require('../src/resolver');

describe('resolver', function () {

    it('return null if cannot find route', function () {
        sinon.stub(facade, "getCachedRoutes").returns([{}]);

        assert.equal(resolver.resolveRoute("http://monsanto.com/abc", ""), null);
    });

    it('returns route if found by host', function () {
        sinon.stub(facade, "getCachedRoutes").returns([{route: 'abc.monsanto.com'}]);

        assert.equal(resolver.resolveRoute("/xyz", "abc.monsanto.com").route, 'abc.monsanto.com');
    });

    it('returns route if found, level 1', function () {
        sinon.stub(facade, "getCachedRoutes").returns([{route: 'abc.monsanto.com'}]);

        assert.equal(resolver.resolveRoute("/abc", "abc.monsanto.com").route, 'abc.monsanto.com');
    });

    it('returns route if found, level 2', function () {
        sinon.stub(facade, "getCachedRoutes").returns([{route: 'abc.monsanto.com/def'}]);

        assert.equal(resolver.resolveRoute("/def", "abc.monsanto.com").route, 'abc.monsanto.com/def');
    });

    it('returns route if found, level 3', function () {
        sinon.stub(facade, "getCachedRoutes").returns([{route: 'abc.monsanto.com/def/ghi'}]);

        assert.equal(resolver.resolveRoute("/def/ghi", "abc.monsanto.com").route, 'abc.monsanto.com/def/ghi');
    });

    it('does not go to level 5', function () {
        sinon.stub(facade, "getCachedRoutes").returns([{route: 'abc/def/ghi/jkl/mno'}]);

        assert.equal(resolver.resolveRoute("/def/ghi/jkl/mno", "abc"), null);
    });

    it('uses closest path', function () {
        sinon.stub(facade, "getCachedRoutes").returns([{route: 'abc/def'}]);

        assert.equal(resolver.resolveRoute("/def/ghi", "abc").route, 'abc/def');
    });

    it('returns whole cache object', function () {
        sinon.stub(facade, "getCachedRoutes").returns([{route: 'abc/def', fruit: "banana"}]);

        assert.equal(resolver.resolveRoute("/def/ghi", "abc").fruit, 'banana');
    });

    it('adds service urls', function () {
        sinon.stub(facade, "getCachedRoutes").returns([{route: 'abc/def', services: ['service1']}]);

        sinon.stub(facade, "getCachedHosts").returns({service1: [{url: "www.monsanto.com"}]});

        assert.equal(resolver.resolveRoute("/def/ghi", "abc").instances.service1[0].url, 'www.monsanto.com');
    });

    afterEach(function () {
        restore(facade.getCachedRoutes);
        restore(facade.getCachedHosts);
    });

    function restore(mockFunc) {
        if (mockFunc.restore) {
            mockFunc.restore();
        }
    }
});