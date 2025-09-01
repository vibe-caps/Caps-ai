package main

import (
	"fmt"
	"os"
)

func initCmd() *cobra.Command {
	cmd := &cobra.Command{Use: "init", Short: "Scaffold project structure"}
	cmd.RunE = func(cmd *cobra.Command, args []string) error {
		_ = os.Mkdir("caps-project", 0o755)
		fmt.Println("Initialized caps-project/")
		return nil
	}
	return cmd
}
