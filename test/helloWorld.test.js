const assert = require('assert');

describe('helloWorld', () => {
  it('should return "Hello, World!"', () => {
    const result = helloWorld();
    assert.strictEqual(result, 'Hello, World!');
  });
});

function helloWorld() {
  return 'Hello, World!';
}