package main

import "fmt"

func modelsCmd() *cobra.Command {
	cmd := &cobra.Command{Use: "models", Short: "List and set default models"}
	cmd.RunE = func(cmd *cobra.Command, args []string) error {
		fmt.Println("Thinking: DeepSeek R1 -> LLaMA 3.1 405B -> OpenThinker-32B")
		fmt.Println("Coding: Qwen3-Coder-480B-A35B -> DeepSeek Coder V2 -> Code Llama 70B -> StarCoder 2")
		return nil
	}
	return cmd
}
