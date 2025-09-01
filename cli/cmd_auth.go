package main

import (
	"fmt"
)

func authCmd() *cobra.Command {
	cmd := &cobra.Command{Use: "auth", Short: "Login and store API token"}
	cmd.RunE = func(cmd *cobra.Command, args []string) error {
		fmt.Println("Auth flow (stub). Store token in ~/.caps/config.json")
		return nil
	}
	return cmd
}
