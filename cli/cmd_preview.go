package main

import (
	"fmt"
)

func previewCmd() *cobra.Command {
	cmd := &cobra.Command{Use: "preview", Short: "Open local or hosted preview"}
	cmd.RunE = func(cmd *cobra.Command, args []string) error {
		fmt.Println("Preview URL will be displayed here (stub)")
		return nil
	}
	return cmd
}
