# GraphQL Code Generator plugin for generating Golang

> This package is work in progress. Contributions are welcome <3.

This package generates Golang types and requests which use:

- [encoding/json](https://pkg.go.dev/encoding/json)
- [net/http](https://pkg.go.dev/net/http)

## Install

The package is published to [graphql-codegen-golang](https://www.npmjs.com/package/graphql-codegen-golang).

```
npm install -D graphql-codegen-golang
yarn install -D graphql-codegen-golang
```

## Usage: `codegen.yaml`

```yaml
hooks:
  afterAllFileWrite: go fmt

schema: graphql/schema.graphql
documents: graphql/documents/**/*.graphql
generates:
  gen/output.go:
    plugins:
      - graphql-codegen-golang
```

## Configuration

Configuration source is at [src/config.ts](src/config.ts)

| Name        | Default | Description                           |
| ----------- | ------- | ------------------------------------- |
| packageName | graphql | Name of the generated Golang package. |

## License

MIT
