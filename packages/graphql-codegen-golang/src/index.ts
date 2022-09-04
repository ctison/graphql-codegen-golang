import type {
  PluginFunction,
  PluginValidateFn,
} from '@graphql-codegen/plugin-helpers'
import type { IGolangPluginConfig } from './config'
import { GolangGenerator } from './generator'

export const plugin: PluginFunction<IGolangPluginConfig> = (
  schema,
  documents,
  config
) => {
  const generator: GolangGenerator = new GolangGenerator(schema, config)
  const notDefined = <T>(x: T | undefined): x is T => {
    return x !== undefined
  }
  return generator.generate(
    documents.map(document => document.document).filter(notDefined)
  )
}

export const validate: PluginValidateFn = async (
  schema,
  document,
  config,
  outputFile,
  allPlugins
) => {
  if (!outputFile.endsWith('.go')) {
    throw new Error(
      `Plugin "golang" requires output file extension to be ".go"!`
    )
  }
}
