import type { ProjectOptions, Project, SourceFile } from 'ts-morph'

export interface InputOptions {
  id: string
  projectPath: string
}
export type ChangeFunctionArguments = InputOptions & { code: string }
export type Loader = (this: PluginContext, opts: ChangeFunctionArguments) => ChangeFunctionArguments | null
export type Setup = (this: PluginContext) => void

export type TypesDefinitionsBuildContext = GenerateTypesDefinitionsOptions & {
  project: Project
  sourceFiles: SourceFile[]
  setup: Setup[]
  loader: Loader[] // loader file
  buildFile(sourceFile: SourceFile): Promise<void>
}

type PluginContext = Omit<TypesDefinitionsBuildContext, 'emitFile'>

export interface Plugin {
  setup?: Setup
  loader?: Loader // loader file
}

export interface GenerateTypesDefinitionsOptions {
  root: string
  input: InputOptions[]
  tsConfig: ProjectOptions
  plugins: Plugin[]
  paths: (id: string) => string
}
