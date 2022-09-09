package rickandmorty

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/spf13/cobra"
)

type FlagInt struct {
	Value *Int
}

func (f FlagInt) String() string {
	if f.Value == nil {
		return "nil"
	}
	return fmt.Sprintf("%v", *f.Value)
}

func (f *FlagInt) Set(s string) error {
	nbr, err := strconv.ParseInt(s, 10, 64)
	if err != nil {
		return err
	}
	nbr2 := Int(nbr)
	f.Value = &nbr2
	return nil
}

func (f FlagInt) Type() string { return "int" }

type GetCharactersCmd struct {
	Cmd   *cobra.Command
	Flags struct {
		Page FlagInt
	}
}

func (cmd *GetCharactersCmd) Execute(_cmd *cobra.Command, args []string) error {
	resp, err := GetCharacters("https://rickandmortyapi.com/graphql", http.DefaultClient, &GetCharactersVariables{
		Page: cmd.Flags.Page.Value,
	})
	if err != nil {
		return fmt.Errorf("failed to make the graphql call: %w", err)
	}
	b, err := json.MarshalIndent(resp, "", "  ")
	if err != nil {
		fmt.Println(fmt.Sprintf("%v", resp))
		return fmt.Errorf("failed to JSONify response: %w", err)
	}
	fmt.Println(string(b))
	return nil
}

func NewGetCharactersCmd() *GetCharactersCmd {
	cmd := &GetCharactersCmd{
		Cmd: &cobra.Command{
			DisableAutoGenTag:     true,
			DisableFlagsInUseLine: true,
			Use:                   "get-characters",
		},
	}
	cmd.Cmd.PersistentFlags().Var(&cmd.Flags.Page, "page", "")
	cmd.Cmd.RunE = cmd.Execute
	return cmd
}

func NewRootCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use: "rickandmorty",
	}
	cmd.AddCommand(NewGetCharactersCmd().Cmd)
	return cmd
}
