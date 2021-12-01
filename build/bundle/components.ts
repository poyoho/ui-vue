import path from 'path'
import { defineConfig } from 'rollup'
import os from 'os'
import glob from 'fast-glob'
import events from 'events'
import replace from '@rollup/plugin-replace'
import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import json from '@rollup/plugin-json'
import filesize from 'rollup-plugin-filesize'

import { reporter, build, watch } from '../rollup'
import { buildOutput, projectRoot, projectPackage, entryPackage, pkgRoot, } from '../utils/paths'
import { sourceMap } from '../utils/env'
import { runParallel } from '../utils/utils'
import { filterTargets } from '../utils/command'
import { excludeFiles } from '../utils/pkg'
import { WatchEventEmitter } from '../typings/event'

export interface BuildComponentOption {
  input: string
  outputRoot: string
  file: string
  vueVersion: '2' | '3'
}


function getExternal () {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const masterPkg = require(projectPackage)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const entryPkg = require(entryPackage)
  const externalPackages: (string|RegExp)[] = Object.keys({
    ...masterPkg.peerDependencies,
    ...masterPkg.dependencies,
    ...entryPkg.peerDependencies,
    ...entryPkg.dependencies,
  })
  externalPackages.push(/.(scss|css)$/)
  return externalPackages
}

function normalize(path: string): string {
  if (path.indexOf('\\') !== -1) {
    path = path.replace(/\\/g, '/')
  }
  if (path.indexOf('./') === -1) {
    path = `./${path}`
  }
  return path
}

async function createComponentBundleConfig (options: BuildComponentOption) {
  const { vueVersion, input, outputRoot, file } = options
  const __IS_VUE2__ = vueVersion === '2'
  const __IS_VUE3__ = !__IS_VUE2__
  const external = getExternal()
  return defineConfig({
    input,
    output: {
      format: 'es',
      dir: path.dirname(path.resolve(outputRoot, file)),
      sourcemap: sourceMap,
      // output resolve id
      paths(id) {
        if (id.startsWith('@ui-vue')) {
          return normalize(path.relative(
            path.dirname(path.resolve(outputRoot, file)),
            id.replace('@ui-vue', outputRoot),
          ))
        }
        return id
      }
    },
    plugins: [
      replace({
        // transform: string replace code
        values: {
          __IS_VUE2__: String(__IS_VUE2__),
          __IS_VUE3__: String(__IS_VUE3__),
          __DEV__: String(true),
          'vue2': 'vue',
          'vue3': 'vue'
        },
        preventAssignment: true
      }),
      // resolveId: replace id
      alias({
        entries: {
          '@ui-vue/adapter': path.resolve(`packages/adapter/vue${vueVersion}.ts`),
        }
      }),
      resolve({
        browser: true
      }),
      __IS_VUE2__
        ? (await import('rollup-plugin-vue2')).default({
          css: false,
        })
        : (await import('rollup-plugin-vue')).default({
          target: 'browser',
        }),
      esbuild({
        sourceMap,
        tsconfig: path.resolve(projectRoot, 'tsconfig.json'),
        exclude: [
          'node_modules'
        ]
      }),
      json(),
      filesize({ reporter }),
    ],
    external (id) {
      return external.some(k => {
        if (k instanceof RegExp) {
          return k.test(id)
        }
        return new RegExp('^' + k).test(id)
      })
    }
  })
}

function formatPathsToOptions (result: BuildComponentOption[], file: string) {
  const input = path.resolve(pkgRoot, file)
  result.push({ file, input, outputRoot: path.resolve(buildOutput, 'vue2/lib/'), vueVersion: '2' })
  result.push({ file, input, outputRoot: path.resolve(buildOutput, 'vue3/lib/'), vueVersion: '3' })
  return result
}

export async function buildComponent () {
  const filePaths = excludeFiles(
    // styles build with other config
    // adapter build in bundle
    await glob(['**/index.ts', '**/css.ts', '!styles/**/*', '!adapter/**/*'], {
      cwd: pkgRoot,
      onlyFiles: true,
    })
  ).reduce(formatPathsToOptions, [])

  await runParallel(
    os.cpus().length,
    filePaths,
    async function generateComponentBundle (options) {
      const config = await createComponentBundleConfig(options)
      await build(config)
    }
  )
}

export async function watchComponent (_targets: string[]) {
  const targets = await filterTargets(_targets)
  const filePaths = targets
    .map(target => path.relative(pkgRoot, path.resolve(pkgRoot, 'components', target, 'index.ts')))
    .concat(
      await glob(['**/index.ts', '!components/**/*', '**/css.ts', '!adapter/**/*'], {
        cwd: pkgRoot,
        onlyFiles: true,
      })
    )
    .reduce(formatPathsToOptions, [])

  const emitter = new events.EventEmitter() as WatchEventEmitter
  await runParallel(
    os.cpus().length,
    filePaths,
    async function generateComponentBundle (options) {
      const config = await createComponentBundleConfig(options)
      const watcher = watch(config)
      watcher.watcher.on('change', (id, event) => {
        emitter.emit('change', id, event)
      })
    }
  )
  return emitter
}
