import fs from 'fs/promises'
import path from 'path'
import defu from 'defu'
import { Project } from 'ts-morph'
import { green, red, yellow, bold } from 'chalk'
import type { SourceFile } from 'ts-morph'

import { TypesDefinitionsBuildContext, GenerateTypesDefinitionsOptions, InputOptions, Loader, Setup } from './types'

// resolve es import id and replace new id
function resolveId (content: string, replace: (id: string) => string) {
  const reg = /(from\s*['"](\S*?['"]))|(import\s*\(\s*['"](\S*?['"])\s*\))/gm
  return content.replace(reg, (s, _all_static, staticImport, _all_dynamic, dynamicImport) => {
    const id: string = (staticImport || dynamicImport || '').slice(0, -1)
    const replaceId = replace(id) || id
    return s.replace(id, replaceId)
  })
}

async function loadFile (ctx: TypesDefinitionsBuildContext, input: InputOptions): Promise<SourceFile> {
  const { project, loader } = ctx

  const code = await fs.readFile(input.id, 'utf-8')
  let fileMeta = Object.assign(input, { code })
  for (let i = 0; i < loader.length; i++) {
    const result = loader[i].call(ctx, fileMeta)
    if (result) {
      fileMeta = result
    }
  }

  const sourceFile = project.createSourceFile(fileMeta.projectPath, fileMeta.code, { overwrite: true })
  return sourceFile
}

async function createContext (config: GenerateTypesDefinitionsOptions): Promise<TypesDefinitionsBuildContext> {
  const { root, tsConfig, plugins } = config

  const project = new Project(defu({
    compilerOptions: {
      baseUrl: root,
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true,
      noEmitOnError: true,
      skipLibCheck: true,
    },
    skipAddingFilesFromTsConfig: true,
  }, tsConfig))


  const context: TypesDefinitionsBuildContext = defu(
    {
      loader: plugins.reduce<Loader[]>((result, plugin) => plugin.loader ? result.concat(plugin.loader) : result, []),
      setup: plugins.reduce<Setup[]>((result, plugin) => plugin.setup ? result.concat(plugin.setup) : result, []),
      project,
      sourceFiles: [],
      buildFile: async (sourceFile: SourceFile) => {
        const relativePath = path.relative(context.root, sourceFile.getFilePath())
        console.log(yellow(`Generating definition for file: ${bold(relativePath)}`))

        const emitOutput = sourceFile.getEmitOutput()
        const emitFiles = emitOutput.getOutputFiles()
        if (emitFiles.length === 0) {
          console.log(red(`Emit no file: ${bold(relativePath)}`))
          return
        }

        const tasks = emitFiles.map(async (outputFile) => {
          const filepath = outputFile.getFilePath()
          await fs.mkdir(path.dirname(filepath), {
            recursive: true,
          })

          await fs.writeFile(
            filepath,
            resolveId(outputFile.getText(), config.paths),
            'utf8'
          )

          console.log(green(`Definition for file: ${bold(relativePath)} generated`))
        })

        await Promise.all(tasks)
      }
    },
    config,
  )
  context.sourceFiles = await Promise.all(config.input.map((inputOption) => loadFile(context, inputOption)))
  await Promise.all(context.setup.map(fn => fn.call(context)))

  const diagnostics = project.getPreEmitDiagnostics()
  console.log(project.formatDiagnosticsWithColorAndContext(diagnostics))

  await project.emit({ emitOnlyDtsFiles: true })
  return context
}

export function defineConfig (opts: GenerateTypesDefinitionsOptions): GenerateTypesDefinitionsOptions {
  return opts
}

export async function build (config: GenerateTypesDefinitionsOptions) {
  const context = await createContext(config)
  const { sourceFiles } = context

  await Promise.all(sourceFiles.map(context.buildFile))
}

export async function watch (config: GenerateTypesDefinitionsOptions) {
  const context = await createContext(config)
  return async (id: string) => {
    const sourceFile = await loadFile(context, { id, projectPath: id })
    await context.buildFile(sourceFile)
  }
}
