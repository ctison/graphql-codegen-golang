# GraphQL Code Generator plugin for generating Golang

## Roadmap

- [x] Generate types
- [x] Generate queries and mutations
- [ ] Generate subscriptions with gorilla websocket
- [ ] Generate Terraform providers
- [ ] Generate CLI
- [ ] Add more configuration options
- [ ] Avoid possible naming collisions

This package generates Golang types from GraphQL schema, and can optionally generate:

- An HTTP client
- A Terraform provider wrapping the generated HTTP client (TODO)
- A cobra CLI wrapping the generated HTTP client (TODO)

## Install

The package is published to [graphql-codegen-golang](https://www.npmjs.com/package/graphql-codegen-golang).

```sh
pnpm add -DE graphql-codegen-golang
yarn add -DE graphql-codegen-golang
npm install -DE graphql-codegen-golang
```

## Usage: `codegen.yaml`

```yaml
schema: examples/graphql/schema.graphql
documents: examples/graphql/!(schema).graphql
generates:
  examples/graphql/graphql.go:
    hooks:
      afterOneFileWrite: go fmt
    plugins:
      - graphql-codegen-golang:
          packageName: graphql # default
          generateHTTPClient: true # default
```

See [`graphql.config.yaml`](/graphql.config.yaml) for more.

## Configuration

Configuration source is at [src/config.ts](/packages/graphql-codegen-golang/src/config.ts)

| Name               | Type    | Default | Description                                |
| ------------------ | ------- | ------- | ------------------------------------------ |
| packageName        | string  | graphql | Name of the generated Golang package.      |
| generateHTTPClient | boolean | true    | Should an GraphQL HTTP client be generated |
