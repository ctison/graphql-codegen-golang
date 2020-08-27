import { PluginFunction, PluginValidateFn } from '@graphql-codegen/plugin-helpers'
import { parse, printSchema } from 'graphql'
import { GolangPluginConfig } from './config'
import { GolangVisitor } from './visitor'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const plugin: PluginFunction<GolangPluginConfig> = (schema, documents, config, info) => {
  const printedSchema = printSchema(schema)
  const astNode = parse(printedSchema)
  const visitor = new GolangVisitor(config)
  visitor.visit(astNode)
  return visitor.generate()
}

export const validate: PluginValidateFn = async (schema, documents, config, outputFile: string) => {
  if (!outputFile.endsWith('.go')) {
    throw new Error(`Plugin "golang" requires output file extension to be ".go"!`)
  }
}
