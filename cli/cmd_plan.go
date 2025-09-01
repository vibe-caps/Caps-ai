package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func planCmd() *cobra.Command {
	var prompt string
	cmd := &cobra.Command{Use: "plan", Short: "Create a project plan from a prompt"}
	cmd.Flags().StringVarP(&prompt, "prompt", "p", "", "Prompt describing the app")
	cmd.RunE = func(cmd *cobra.Command, args []string) error {
		if prompt == "" && len(args) > 0 { prompt = args[0] }
		if prompt == "" { return fmt.Errorf("prompt is required") }
		body, _ := json.Marshal(map[string]string{"prompt": prompt})
		resp, err := http.Post(getOrchestratorURL()+"/plan", "application/json", bytes.NewReader(body))
		if err != nil { return err }
		defer resp.Body.Close()
		var out map[string]any
		json.NewDecoder(resp.Body).Decode(&out)
		b, _ := json.MarshalIndent(out, "", "  ")
		fmt.Println(string(b))
		return nil
	}
	return cmd
}
