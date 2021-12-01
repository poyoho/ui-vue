import os from 'os'
import fs from 'fs-extra'
import path from 'path'
import glob from 'fast-glob'
import postcss from 'postcss'
import dartSass from 'sass'
import { magenta, bold, green } from 'chalk'
import chokidar from 'chokidar'

import { buildOutput, pkgRoot, stylesRoot } from '../utils/paths'
import { runParallel, debounce } from '../utils/utils'
import { excludeFiles } from '../utils/pkg'

export interface BuildStyleOption {
  input: string
  outputs: string[]
}

async function buildStyleBundle ({ input, outputs }: BuildStyleOption) {
  const start = Date.now()
  outputs.forEach((output) => console.log(magenta(`\n${bold(input)} → ${bold(output)}...`)))
  const css = dartSass.renderSync({
    file: input,
  }).css.toString('utf-8')
  outputs.forEach((output => {
    // copy
    fs.copySync(
      input,
      output.replace('.css', '.scss')
    )
    postcss()
      .process(css, {
        from: input,
        to: output,
      })
      .then(result => {
        // clean css
        return result.css
      })
      .then((cleanCss) => {
        fs.writeFileSync(output, cleanCss, { encoding: 'utf-8', })
        console.log(green(`created ${output} in ${bold(Date.now() - start)} ms`))
      })
  }))
}

function formatPathsToOptions (result: BuildStyleOption[], file: string) {
  const input = path.resolve(pkgRoot, file)
  const outputs = [
    path.resolve(buildOutput, 'vue2/lib', file),
    path.resolve(buildOutput, 'vue3/lib', file),
  ]

  result.push({ input, outputs: outputs.map(file => file.replace('.scss', '.css')) })
  return result
}

export async function buildStyle () {
  // copy src paths
  const stylesPaths = path.relative(pkgRoot, stylesRoot)
  fs.copySync(
    path.resolve(pkgRoot, stylesPaths),
    path.resolve(buildOutput, 'vue2/lib', stylesPaths),
  )

  fs.copySync(
    path.resolve(pkgRoot, stylesPaths),
    path.resolve(buildOutput, 'vue3/lib', stylesPaths),
  )
  // find need build scss
  const filePaths = excludeFiles(
    await glob(['**/*.scss', '!styles/**/*.scss'], {
      cwd: pkgRoot,
      onlyFiles: true,
    })
  ).concat(excludeFiles(
    await glob(['styles/*.scss'], {
      cwd: pkgRoot,
      onlyFiles: true,
    })
  )).reduce(formatPathsToOptions, [])

  await runParallel(
    os.cpus().length,
    filePaths,
    async function generateStyleBundle (options) {
      await buildStyleBundle(options)
    }
  )
}

export async function watchStyle () {
  const filePaths = excludeFiles(
    await glob(['**/*.scss', '!styles/**/*.scss'], {
      cwd: pkgRoot,
      onlyFiles: true,
    })
  ).concat(excludeFiles(
    await glob(['styles/*.scss'], {
      cwd: pkgRoot,
      onlyFiles: true,
    })
  )).reduce(formatPathsToOptions, [])

  const idMapFilePaths = filePaths.reduce((prev, filepath) => {
    prev[filepath.input] = filepath
    return prev
  }, {})

  return chokidar
    .watch(filePaths.map(filepath => filepath.input))
    .on('add', debounce((id) => buildStyleBundle(idMapFilePaths[id])))
    .on('change', debounce((id) => buildStyleBundle(idMapFilePaths[id])))
}
