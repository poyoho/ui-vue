import path from 'path'
import minimist from 'minimist'
import execa from 'execa'

import { define } from './utils/env'
import { projectRoot } from './utils/paths'
import { debounce } from './utils/utils'
import { watchDTS } from './bundle/dts'
import { watchComponent } from './bundle/components'
import { watchStyle } from './bundle/styles'

const args = minimist(process.argv.slice(2))
const targets = args._
const sourceMap = args.sourcemap || args.s

async function run() {
  define({
    sourceMap
  })
  const [
    emitter,
    dtsBuilder,
    // styleBuilder
  ] = await Promise.all([
    watchComponent(targets),
    watchDTS(),
    watchStyle()
  ])
  emitter.on('change', debounce(dtsBuilder))
  vite()
}

async function vite () {
  await execa(
    'yarn',
    [],
    {
      cwd: path.resolve(projectRoot, 'docs'),
      stdio: 'inherit',
    }
  )
  execa(
    'yarn',
    [
      'dev:vue2'
    ],
    {
      cwd: path.resolve(projectRoot, 'docs'),
      stdio: 'inherit',
    }
  )
  execa(
    'yarn',
    [
      'dev:bootstrap'
    ],
    {
      cwd: path.resolve(projectRoot, 'docs'),
      stdio: 'inherit',
    }
  )
}

run()
