# GraphQL Code Generator plugin for generating Golang

> This package is work in progress.

## Roadmap

- [x] Generate types
- [x] Generate queries and mutations
- [ ] Generate subscriptions with gorilla websocket
- [ ] Add more configuration options
- [ ] Avoid possible naming collisions
- [ ] Write tests

This package generates Golang types and requests which use:

- [bytes](https://pkg.go.dev/bytes)
- [encoding/json](https://pkg.go.dev/encoding/json)
- [fmt](https://pkg.go.dev/fmt)
- [net/http](https://pkg.go.dev/net/http)
- [io/ioutil](https://pkg.go.dev/io/ioutil)
- [strings](https://pkg.go.dev/strings)

## Install

The package is published to [graphql-codegen-golang](https://www.npmjs.com/package/graphql-codegen-golang).

```sh
pnpm install -DE graphql-codegen-golang
yarn install -DE graphql-codegen-golang
npm install -DE graphql-codegen-golang
```

## Usage: `codegen.yaml`

```yaml
schema: pkg/graphql/schema.graphql
documents: pkg/graphql/!(schema).graphql
generates:
  pkg/graphql/graphql.go:
    hooks:
      afterOneFileWrite: go fmt
    plugins:
      - graphql-codegen-golang:
          packageName: graphql # default
```

## Configuration

Configuration source is at [src/config.ts](src/config.ts)

| Name        | Default | Description                           |
| ----------- | ------- | ------------------------------------- |
| packageName | graphql | Name of the generated Golang package. |
