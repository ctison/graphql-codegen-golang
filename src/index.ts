import {
  PluginFunction,
  PluginValidateFn,
} from '@graphql-codegen/plugin-helpers'
import { GolangPluginConfig } from './config'
import { GolangGenerator } from './generator'

export const plugin: PluginFunction<GolangPluginConfig> = (
  schema,
  documents,
  config
) => {
  const generator = new GolangGenerator(schema, config)
  const notDefined = <T>(x: T | undefined): x is T => {
    return x !== undefined
  }
  return generator.generate(
    documents.map(document => document.document).filter(notDefined)
  )
}

export const validate: PluginValidateFn = async (_, __, ___, outputFile) => {
  if (!outputFile.endsWith('.go')) {
    throw new Error(
      `Plugin "golang" requires output file extension to be ".go"!`
    )
  }
}
