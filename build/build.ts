import fs from 'fs-extra'
import minimist from 'minimist'

import { define } from './utils/env'
import { buildComponent } from './bundle/components'
import { buildDTS } from './bundle/dts'
import { buildStyle } from './bundle/styles'
import { buildOutput } from './utils/paths'

const args = minimist(process.argv.slice(2))
const sourceMap = args.sourcemap || args.s

async function run() {
  define({
    sourceMap
  })
  fs.removeSync(buildOutput)
  await buildComponent()
  await buildDTS()
  await buildStyle()
}

run()
