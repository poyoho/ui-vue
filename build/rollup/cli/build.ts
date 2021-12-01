// fork from rollup/cli/build
import { rollup, RollupOptions } from 'rollup'
import { bold, cyan, green } from 'chalk'
import { handleError } from './logging'
import { relativeId } from './paths'
import { stderr } from './logging'

const SOURCEMAPPING_URL = 'sourceMappingURL'

export async function build (inputOptions: RollupOptions, silent = false) {
  const outputOptions = Array.isArray(inputOptions.output!) ? inputOptions.output! : [inputOptions.output!]
  const useStdout = !outputOptions[0].file && !outputOptions[0].dir
  const start = Date.now()
  const files = useStdout ? ['stdout'] : outputOptions.map(t => relativeId(t.file || t.dir!))
  if (!silent) {
    let inputFiles: string | undefined
    if (typeof inputOptions.input === 'string') {
      inputFiles = inputOptions.input
    } else if (inputOptions.input instanceof Array) {
      inputFiles = inputOptions.input.join(', ')
    } else if (typeof inputOptions.input === 'object' && inputOptions.input !== null) {
      inputFiles = Object.values(inputOptions.input).join(', ')
    }
    stderr(cyan(`\n${bold(inputFiles!)} → ${bold(files.join(', '))}...`))
  }

  const bundle = await rollup(inputOptions)

  if (useStdout) {
    const output = outputOptions[0]
    if (output.sourcemap && output.sourcemap !== 'inline') {
      handleError({
        code: 'ONLY_INLINE_SOURCEMAPS',
        message: 'Only inline sourcemaps are supported when bundling to stdout.'
      })
    }

    const { output: outputs } = await bundle.generate(output)
    for (const file of outputs) {
      let source: string | Uint8Array
      if (file.type === 'asset') {
        source = file.source
      } else {
        source = file.code
        if (output.sourcemap === 'inline') {
          source += `\n//# ${SOURCEMAPPING_URL}=${file.map!.toUrl()}\n`
        }
      }
      const filename = `//→ ${file.fileName}:`
      if (outputs.length > 1) process.stdout.write(`\n${cyan(bold(filename))}\n`)
      process.stdout.write(source as Buffer)
    }
    return
  }

  await Promise.all(outputOptions.map(bundle.write))
  await bundle.close()
  if (!silent) {
    stderr(green(`created ${bold(files.join(', '))} in ${bold(Date.now() - start)} ms`))
  }
}
