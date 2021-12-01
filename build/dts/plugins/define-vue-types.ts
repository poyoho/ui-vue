import path from 'path'
import glob from 'fast-glob'

import { Plugin } from '../types'
import { projectRoot } from '../../utils/paths'
import { excludeFiles } from '../../utils/pkg'

interface DefineVueTypesOptions {
  vueVersion: '2' | '3'
}

export async function defineVueTypes ({
  vueVersion
}: DefineVueTypesOptions): Promise<Plugin> {
  const globalDTSLibPaths = excludeFiles(
    await glob(['*.d.ts'], {
      cwd: path.resolve(projectRoot, 'typings'),
      absolute: true,
      onlyFiles: true,
    })
  )

  return {
    setup () {
      this.project.addSourceFilesAtPaths(globalDTSLibPaths)
      this.project.createSourceFile('typings/vue.d.ts', `declare module "vue" { export * from "vue${vueVersion}" }`, { overwrite: true })
    },
  }
}
