package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var version = "0.1.0"

func main() {
	root := &cobra.Command{Use: "caps", Short: "Caps AI CLI", Version: version}
	root.AddCommand(initCmd(), planCmd(), generateCmd(), previewCmd(), deployCmd(), modelsCmd(), authCmd())
	if err := root.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
