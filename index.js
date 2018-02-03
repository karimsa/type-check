/**
 * @file index.js
 * @license MIT
 * @copyright 2018-present Karim Alibhai.
 */

const assert = require('assert')

function createError (expected, given, isOptional) {
  return new TypeError(`Unexpected value of type "${given}" (expected ${expected}${isOptional ? '?' : ''})`)
}

/**
 * Throws a TypeError when value does not match type based
 * on typeOf() value.
 */
function typeAssert (type, value) {
  const isOptional = type[type.length - 1] === '?'
  const givenType = module.exports.typeOf(value)

  // trim the '?'
  if (isOptional) {
    type = type.substr(0, type.length - 1)
  }

  // types match, everyone is happy
  if (givenType === type) {
    return
  }

  // if its optional, then don't fail for undefined or null
  if (isOptional && (value === undefined || value === null)) {
    return
  }

  // otherwise throw error
  throw createError(type, givenType, isOptional)
}

function typeAssertMany (types, value) {
  for (const type of types) {
    try {
      typeAssert(type, value)

      // if didn't throw error, we have successfully
      // matched a type - exit right away
      return
    } catch (_) {}
  }

  // if nothing matched, then die
  throw createError(`any of: ${types.join(', ')}`, module.exports.typeOf(value))
}

function typeCheck (type, value) {
  if (typeof type === 'string') {
    type = [type]
  }

  assert(Array.isArray ? Array.isArray(type) : type instanceof Array, 'type must be a valid array')
  typeAssertMany(type, value)
}

module.exports = typeCheck
module.exports.typeOf = require('type-detect')
