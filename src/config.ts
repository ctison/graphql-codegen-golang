/**
 * GolangPluginConfig lets you configure how GolangGenerator generates
 * Golang code from GraphQL schemas and documents.
 */
export interface GolangPluginConfig {
  /**
   * Name of the generated Golang package.
   * @default graphql
   * @example
   * ```go
   * package graphql
   * ```
   */
  packageName?: string
}
