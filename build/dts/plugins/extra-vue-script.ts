import path from 'path'
import { createFilter, FilterPattern } from '@rollup/pluginutils'
import { Plugin } from '../types'
import compiler from '@vue/compiler-sfc'

interface ExtractVueScriptOptions {
  include?: FilterPattern
  exculde?: FilterPattern
}

export async function extractVueScript ({
  include = /\.vue$/,
  exculde,
}: ExtractVueScriptOptions): Promise<Plugin> {
  const filter = createFilter(include, exculde)

  return {
    loader (data) {
      const { code, id } = data
      if (!filter(id)) {
        return null
      }
      // just extract script so we can use vue3 compiler
      const sfc = compiler.parse(code)
      const { script, scriptSetup } = sfc.descriptor
      if (!script && !scriptSetup) {
        return null
      }
      let content = ''
      let isTS = false
      if (script && script.content) {
        content += script.content
        if (script.lang === 'ts') isTS = true
      }
      if (scriptSetup) {
        const compiled = compiler.compileScript(sfc.descriptor, {
          id: 'xxx',
        })
        content += compiled.content
        if (scriptSetup.lang === 'ts') isTS = true
      }
      data.code = content
      data.projectPath = path.relative(process.cwd(), id) + (isTS ? '.ts' : '.js')

      return data
    }
  }
}
