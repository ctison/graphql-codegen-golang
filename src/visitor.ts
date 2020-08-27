import {
  DocumentNode,
  visit,
  TypeNode,
  NamedTypeNode,
  ListTypeNode,
  NonNullTypeNode,
} from 'graphql'
import { GolangFormatter } from './formatter'
import { GolangPluginConfig } from './config'

/**
 * GolangVisitor parses GraphQL schemas and documents, and generates Golang types and requests.
 * ```ts
 * const visitor = new GolangVisitor()
 * visitor.visit(astNode)
 * visitor.generate() // -> Golang code
 * ```
 */
export class GolangVisitor {
  private config: GolangPluginConfig
  private fmt: GolangFormatter

  /**
   * `types` holds all Golang types mapped to those parsed from GraphQL schemas.
   */
  public types: { [key: string]: string } = {}
  /**
   * `scalars` holds scalar types parsed from GraphQL schemas.
   *
   * It is prefilled with default ones from https://graphql.org/learn/schema/#scalar-types.
   */
  public scalars: { [key: string]: string } = {
    Int: 'int32',
    Float: 'float64',
    String: 'string',
    Boolean: 'bool',
    ID: 'string',
  }
  /**
   * `objects` holds object types parsed from GraphQL schemas.
   */
  public objects: {
    [key: string]: {
      name: string
      type: TypeNode
    }[]
  } = {}
  /**
   * `inputs` holds input types parsed from GraphQL schemas.
   */
  public inputs: {
    [key: string]: {
      name: string
      type: TypeNode
    }[]
  } = {}
  /**
   * `enums` holds enum types parsed from GraphQL schemas.
   */
  public enums: { [key: string]: string[] } = {}

  constructor(config?: GolangPluginConfig) {
    this.config = config ?? {}
    this.fmt = new GolangFormatter(this.config)
  }

  /**
   * Visit GraphQL schema and store parsed types into the following properties:
   * - `types`
   * - `scalars`
   * - `objects`
   * - `inputs`
   * - `enums`
   *
   * Use it with GraphQL schema(s) before generating Golang code.
   * @param astNode A GraphQL schema
   */
  visit(astNode: DocumentNode): void {
    visit(astNode, {
      ScalarTypeDefinition: node => {
        const name = this.fmt.formatName(node.name.value)
        this.types[node.name.value] = name
        this.scalars[name] = 'string'
      },
      EnumTypeDefinition: node => {
        const name = this.fmt.formatName(node.name.value)
        this.types[node.name.value] = name
        this.enums[name] = node.values?.map(value => value.name.value) ?? []
      },
      ObjectTypeDefinition: node => {
        const name = this.fmt.formatName(node.name.value)
        this.types[node.name.value] = name
        this.objects[name] =
          node.fields?.map(field => ({
            name: field.name.value,
            type: field.type,
          })) ?? []
      },
      InputObjectTypeDefinition: node => {
        const name = this.fmt.formatName(node.name.value)
        this.types[node.name.value] = name
        this.inputs[name] =
          node.fields?.map(field => ({
            name: field.name.value,
            type: field.type,
          })) ?? []
      },
    })
  }

  /**
   * Generate complete Golang code from stored properties parsed from GraphQL schema(s).
   */
  generate(): string {
    const l: string[] = [this.generatePackage(), this.generateImports()]
    // Generate scalars
    if (this.scalars) {
      l.push(this.generateSection('Scalars'), this.generateScalars())
    }
    // Generate objects
    if (this.objects) {
      l.push(this.generateSection('Objects'), this.generateObjects())
    }
    // Generate inputs
    if (this.inputs) {
      l.push(this.generateSection('Inputs'), this.generateInputs())
    }
    // Generate enums
    if (this.enums) {
      l.push(this.generateSection('Enums'), this.generateEnums())
    }
    l.push(this.generateQueries())
    return l.join('\n')
  }

  generateSection(name: string): string {
    return ['', '/'.repeat(80), `// ${name}`, ''].join('\n')
  }

  generatePackage(): string {
    return [
      `package ${this.config.packageName ?? 'graphql'}`,
      '',
      '// Code generated by graphql-codegen-golang ; DO NOT EDIT.',
    ].join('\n')
  }

  generateImports(): string {
    return ['', 'import (', '  "encoding/json"', '//  "net/http"', ')'].join('\n')
  }

  generateQueries(): string {
    const l = [
      'type GraphQLQuery struct {',
      '  Query         string                 `json:"query"`',
      '  OperationName string                 `json:"operationName,omitempty"`',
      '  Variables     map[string]interface{} `json:"variables,omitempty"`',
      '}',
      '',
      'type GraphQLResponse struct {',
      '  Data json.RawMessage',
      '}',
    ]
    return l.join('\n')
  }

  generateScalars(): string {
    const l: string[] = []
    Object.entries(this.scalars).forEach(([name, type]) => {
      l.push(`type ${name} ${type}`)
    })
    return l.join('\n')
  }

  generateEnums(): string {
    const l: string[] = []
    Object.entries(this.enums).forEach(([enumName, values], i) => {
      if (i > 0) l.push('')
      l.push(`type ${enumName} string`, '', 'const (')
      values.forEach(name => {
        l.push(`  ${enumName}${this.fmt.formatName(name)} ${enumName} = "${name}"`)
      })
      l.push(')')
    })
    return l.join('\n')
  }

  generateObjects(): string {
    const l: string[] = []
    Object.entries(this.objects).forEach(([objectName, fields], i) => {
      if (i > 0) l.push('')
      l.push(`type ${objectName} struct {`)
      fields.forEach(field => {
        l.push(`  ${this.fmt.formatName(field.name)} ${this.generateType(field.type, field.name)}`)
      })
      l.push('}')
    })
    return l.join('\n')
  }

  generateInputs(): string {
    const l: string[] = []
    Object.entries(this.inputs).forEach(([inputName, fields], i) => {
      if (i > 0) l.push('')
      l.push(`type ${inputName} struct {`)
      fields.forEach(field => {
        l.push(`  ${this.fmt.formatName(field.name)} ${this.generateType(field.type, field.name)}`)
      })
      l.push('}')
    })
    return l.join('\n')
  }

  generateType(typeNode: TypeNode, fieldName: string, prefix = '', nonNull = false): string {
    switch (typeNode.kind) {
      case 'NamedType': {
        const name = (typeNode as NamedTypeNode).name.value
        return `${prefix}${nonNull ? '' : '*'}${this.types[name] ?? name} \`json:"${fieldName}${
          nonNull ? '' : ',omitempty'
        }"\``
      }
      case 'NonNullType':
        return this.generateType((typeNode as NonNullTypeNode).type, fieldName, prefix, true)
      case 'ListType':
        return this.generateType((typeNode as ListTypeNode).type, fieldName, prefix + '[]')
    }
  }
}
