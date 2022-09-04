package rickandmorty

import (
	"testing"
)

const URL_API = "https://rickandmortyapi.com/graphql"

var client = NewClient(URL_API)

func TestGetRicks(t *testing.T) {
	chars, err := client.GetCharacters(nil)
	if err != nil {
		t.Fatal(err)
	}
	if chars.Characters.Results == nil || len(*chars.Characters.Results) == 0 {
		t.Fatalf("result is empty: %v", chars.Characters.Results)
	}
	t.Log((*chars.Characters.Results)[0])
}
