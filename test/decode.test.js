'use strict';

const assert = require('assert');
const decode = require('../lib/fixtures/decode');
const decodeMin = require('../lib/fixtures/decode.min');


describe('test/decode.test.js', () => {

  it('should decode base64', () => {
    let obj = decode('JTdCJTIyZGF0YSUyMiUzQTElN0Q=');
    assert(obj.data === 1);
    obj = decodeMin('JTdCJTIyZGF0YSUyMiUzQTElN0Q=');
    assert(obj.data === 1);

    const data = { a: 1 };
    const encoded = new Buffer(encodeURIComponent(JSON.stringify(data))).toString('base64');
    obj = decode(encoded);
    assert(obj.a === 1);
  });

  it('should decode undefined', () => {
    assert(typeof decode() === 'object');
    assert(typeof decodeMin() === 'object');
  });

  it('should decode error', () => {
    try {
      decode('1');
      throw new Error('should not run');
    } catch (err) {
      assert(err.message === 'atob failed: The string to be decoded is not correctly encoded.');
    }
    try {
      decodeMin('1');
      throw new Error('should not run');
    } catch (err) {
      assert(err.message === 'atob failed: The string to be decoded is not correctly encoded.');
    }
  });

});
