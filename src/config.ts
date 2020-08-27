/**
 * GolangPluginConfig lets you configure how GolangVisitor generates
 * Golang code from GraphQL schemas and documents.
 */
export interface GolangPluginConfig {
  /**
   * Name of the generated Golang package. Defaults to `graphql`.
   * ```go
   * package graphql
   * ```
   */
  packageName?: string
}
