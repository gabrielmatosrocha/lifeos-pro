const assert = require('assert')

function calculateRhythm(actionsCount) {
  return Math.min(100, actionsCount * 12)
}

assert.equal(calculateRhythm(0), 0)
assert.equal(calculateRhythm(3), 36)
assert.equal(calculateRhythm(20), 100)

console.log('Engine tests passed')
