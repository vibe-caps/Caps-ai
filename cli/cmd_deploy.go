package main

import "fmt"

func deployCmd() *cobra.Command {
	var target string
	cmd := &cobra.Command{Use: "deploy", Short: "Deploy to Vercel/Render/Railway"}
	cmd.Flags().StringVar(&target, "target", "vercel", "Target platform")
	cmd.RunE = func(cmd *cobra.Command, args []string) error {
		fmt.Println("Deploying to", target, "(stub)")
		return nil
	}
	return cmd
}
