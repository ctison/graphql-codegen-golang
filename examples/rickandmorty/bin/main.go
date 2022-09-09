package main

import (
	"os"

	"github.com/ctison/graphql-codegen-golang/examples/rickandmorty"
)

func main() {
	cmd := rickandmorty.NewRootCmd()
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}
