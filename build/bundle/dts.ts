import path from 'path'
import glob from 'fast-glob'

import { buildOutput, entryRoot, pkgRoot, projectRoot } from '../utils/paths'
import { excludeFiles } from '../utils/pkg'
import { replace, extractVueScript, defineConfig, watch, build, defineVueTypes } from '../dts'

export interface BuildDTSOption {
  vueVersion: '2' | '3'
}

async function createDTSConfig (options: BuildDTSOption) {
  const { vueVersion } = options
  const __IS_VUE2__ = vueVersion === '2'
  const __IS_VUE3__ = !__IS_VUE2__

  const filePaths = excludeFiles(
    await glob(['**/*.{js,ts,vue}', '!ui-vue/**/*'], {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )

  const entryPaths = excludeFiles(
    await glob('**/*.{js,ts,vue}', {
      cwd: entryRoot,
      onlyFiles: true,
    })
  )

  const input = [
    ...filePaths.map(file => ({ id: file, projectPath: path.relative(process.cwd(), file) })),
    ...entryPaths.map(file => ({ id: path.resolve(entryRoot, file), projectPath: path.resolve(pkgRoot, file) })), // output in file/index.d.ts
  ]

  return defineConfig({
    root: projectRoot,
    input,
    paths(id) {
      if (id === 'vue3' || id === 'vue2') {
        return 'vue'
      }
      return id
    },
    tsConfig: {
      compilerOptions: {
        outDir: path.resolve(buildOutput, `vue${vueVersion}`, 'types'),
        baseUrl: projectRoot,
        paths: {
          '@ui-vue/*': ['packages/*'],
          '@ui-vue/adapter': [`packages/adapter/vue${vueVersion}.ts`],
        }
      },
      tsConfigFilePath: path.resolve(projectRoot, 'tsconfig.json'),
    },
    plugins: [
      await extractVueScript({}),
      replace({
        values: {
          __IS_VUE2__: String(__IS_VUE2__),
          __IS_VUE3__: String(__IS_VUE3__),
        },
        preventAssignment: true
      }),
      await defineVueTypes({
        vueVersion,
      })
    ],
  })
}

export async function buildDTS () {
  const config3 = await createDTSConfig({ vueVersion: '3' })
  const config2 = await createDTSConfig({ vueVersion: '2' })
  await build(config3)
  await build(config2)
}

export async function watchDTS () {
  const config3 = await createDTSConfig({ vueVersion: '3' })
  const config2 = await createDTSConfig({ vueVersion: '2' })
  const build3 = await watch(config3)
  const build2 = await watch(config2)

  return async (id: string) => {
    await Promise.all([
      build2(id),
      build3(id)
    ])
  }
}
