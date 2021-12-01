import { RollupReplaceOptions } from '@rollup/plugin-replace'
import MagicString from 'magic-string'
import { createFilter } from '@rollup/pluginutils'
import { Plugin } from '../types'

function escape(str: string) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
}

// eslint-disable-next-line @typescript-eslint/ban-types
function ensureFunction(functionOrValue: Function | any) {
  if (typeof functionOrValue === 'function') return functionOrValue
  return () => functionOrValue
}

function longest (a: { length: number }, b: { length: number }) {
  return b.length - a.length
}

function getReplacements(options: RollupReplaceOptions) {
  if (options.values) {
    return Object.assign({}, options.values)
  }
  const values = Object.assign({}, options)
  delete values.delimiters
  delete values.include
  delete values.exclude
  delete values.sourcemap
  delete values.sourceMap
  return values
}

function mapToFunctions(object: Record<string, any>) {
  return Object.keys(object).reduce((fns, key) => {
    const functions = Object.assign({}, fns)
    functions[key] = ensureFunction(object[key])
    return functions
  }, {})
}

export function replace (options: RollupReplaceOptions): Plugin {
  const filter = createFilter(options.include, options.exclude)
  const { delimiters, preventAssignment } = options
  const functionValues = mapToFunctions(getReplacements(options))
  const keys = Object.keys(functionValues).sort(longest).map(escape)
  const lookahead = preventAssignment ? '(?!\\s*=[^=])' : ''
  const pattern = delimiters
    ? new RegExp(
      `${escape(delimiters[0])}(${keys.join('|')})${escape(delimiters[1])}${lookahead}`,
      'g'
    )
    : new RegExp(`\\b(${keys.join('|')})\\b(?!\\.)${lookahead}`, 'g')

  function executeReplacement(code: string, id: string) {
    const magicString = new MagicString(code)
    if (!codeHasReplacements(code, id, magicString)) {
      return code
    }

    return magicString.toString()
  }

  function codeHasReplacements(code: string, id: string, magicString: MagicString) {
    let result = false
    let match

    // eslint-disable-next-line no-cond-assign
    while ((match = pattern.exec(code))) {
      result = true

      const start = match.index
      const end = start + match[0].length
      const replacement = String(functionValues[match[1]](id))
      magicString.overwrite(start, end, replacement)
    }
    return result
  }

  return {
    loader (data) {
      if (!keys.length || !filter(data.id)) {
        return null
      }
      data.code = executeReplacement(data.code, data.id)
      return data
    }
  }
}
