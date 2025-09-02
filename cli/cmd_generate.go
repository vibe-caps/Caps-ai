package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func generateCmd() *cobra.Command {
	var specPath string
	cmd := &cobra.Command{Use: "generate", Short: "Trigger code generation from a spec"}
	cmd.Flags().StringVar(&specPath, "spec", "projectSpec.json", "Path to project spec JSON")
	cmd.RunE = func(cmd *cobra.Command, args []string) error {
		b, err := os.ReadFile(specPath)
		if err != nil { return err }
		resp, err := http.Post(getCodegenURL()+"/codegen", "application/json", bytes.NewReader(b))
		if err != nil { return err }
		defer resp.Body.Close()
		io.Copy(os.Stdout, resp.Body)
		return nil
	}
	return cmd
}
