/**
 * GolangPluginConfig lets you configure how GolangGenerator generates
 * Golang code from GraphQL schemas and documents.
 */
export interface IGolangPluginConfig {
  /**
   * Name of the generated Golang package.
   * @defaultValue graphql
   * @example
   * ```go
   * package graphql
   * ```
   */
  packageName?: string
}
